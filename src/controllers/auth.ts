import { db } from "../services/db";
import { eq } from "drizzle-orm";
import { table } from "../schema";
import {BunRequest, CSRF} from "bun";
import {type _createUser, _viewUser} from "../models/User";
import { Jwt } from "../services/jwt";
import { JWTPayloadSpec } from "@elysiajs/jwt";
import { Elysia, t } from "elysia";
import { m } from "../models";
import {sendVerifyChallengeEmail} from "../notifications/email/verifyChallenge";


async function loginRequest(context: {
  body: { username: string; password: string };
  jwt: { sign: (arg0: { user: { id: number; username: string } }) => any };
}) {
  const { username, password } = context.body;
  if (!username || !password) {
    return {
      status: 400,
      body: { error: "Username and password are required." },
    };
  }
  const user = await db.query.users.findFirst({
    where: eq(table.users.username, username),
  });
  if (!user) {
    return {
      status: 401,
      body: { error: "Invalid username or password." },
    };
  }
  if (user && !(await Bun.password.verify(password, user.password))) {
    return {
      status: 401,
      body: { error: "Invalid username or password." },
    };
  }
  const signUser: object = {
    user: { id: user.id, username: user.username },
    timestamp: new Date().toJSON(),
  };
  const value: string = await Jwt.sign(signUser);
  return {
    status: 200,
    body: {
      message: "Login successful",
      data: signUser,
      jwt: { value: value, maxAge: 7 * 86400 },
    },
  };
}
interface RegisterRequest extends Omit<BunRequest, "body"> {
  body: _createUser;
}
const registerRequest = async (request: RegisterRequest) => {
  const { username, email, password } = request.body;
  if (!username || !email || !password) {
    return {
      status: 400,
      body: { error: "Username, email, and password are required." },
    };
  }

  const existingUser = await db.query.users.findFirst({
    where: eq(table.users.username, username),
  });
  if (existingUser) {
    return {
      status: 409,
      body: { error: "Username already exists." },
    };
  }

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/;
  if (!passwordRegex.test(password)) {
    return {
      status: 400,
      body: {
        error:
          "Password must be at least 12 characters long and include at least one uppercase letter, one lowercase letter, one digit, and one special character.",
      },
    };
  }

  const hasher = new Bun.CryptoHasher("sha1");
  const sha1Password = hasher.update(password).digest("hex");
  const passwordHashPrefix = sha1Password.substring(0, 5);
  const response = await fetch(
    `https://api.pwnedpasswords.com/range/${passwordHashPrefix}`,
  );
  const leakedPasswords = await response.text();
  if (leakedPasswords.includes(sha1Password.substring(5).toUpperCase())) {
    return {
      status: 400,
      body: {
        error:
          "This password has been leaked in a data breach. Please choose a different password.",
      },
    };
  }

  const hashedPassword = await Bun.password.hash(password);
  const newUser: { id: Number; username: String }[] = await db
    .insert(table.users)
    .values({
      username,
      email,
      password: hashedPassword,
    })
    .returning({ id: table.users.id, username: table.users.username });

  return {
    status: 201,
    body: { message: "User registered successfully", user: newUser },
  };
};

interface validatedUser extends JWTPayloadSpec {
    user: {
        id: number;
        username: string;
    },
    timestamp: string;
}

export async function validateUser(token: string): Promise< validatedUser | false> {
  const vu: any = await Jwt.verify(token);
  if (!vu || !vu.user || !vu.user.id || !vu.user.username || !vu.timestamp) {
      return false;
  }
  return {
    ...vu,
    user: {
      id: vu.user.id,
      username: vu.user.username,
    },
    timestamp: vu.timestamp,
  }
}
async function validateUserRequest(context: {
  body: { token: string };
  jwt: any;
}) {
  const result: JWTPayloadSpec | false = await validateUser(context.body.token);
  if (result) {
    return {
      status: 200,
      body: { message: "Token is valid", data: result },
    };
  }
  return {
    status: 401,
    body: { message: "Access Denied" },
  };
}
async function requestVerifyChallenge(context: { body: { id: number, token: string } }) {
  const tokenData: any = await validateUser(context.body.token)
  if(!tokenData || tokenData.user.id !== context.body.id) {
    return {
      status: 401,
      body: { message: "Invalid token or user ID mismatch" },
    };
  }
  const challengeCode = generateChallengeCode(12)
  const user = await db.query.users.findFirst({
    where: eq(table.users.id, context.body.id),
  });
  if (!user) {
      return {
      status: 404,
      body: { message: "User not found" },
      };
  }
  await sendVerifyChallengeEmail(challengeCode, user);
  await db.insert(table.verificationChallenge).values({
    userId: user.id,
    code: challengeCode,
    createdAt: new Date().toString(),
    expiresAt: new Date(Date.now() + 60 * 60 * 1000).toString(), // 60 minutes
    isUsed: false,
    type: "email"
  })
  return {
    status: 200,
    body: {
      message: "Verification challenge requested successfully",
      userId: context.body.id,
    },
  };
}
async function respondVerifyChallenge(context: { params: { code: string } }) {
  //TODO: Implement the logic to respond to a verification challenge
  console.log(
    "Responding to verification challenge for with code:",
    context.params,
  );
  return {
    status: 200,
    body: {
      message: "Verification challenge responded successfully",
      code: context.params.code,
    },
  };
}



function generateChallengeCode(length) {
  const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = "";
  const charactersLength = characters.length;
  for ( let i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}


export const auth = new Elysia({ prefix: "/auth" })
  .post("/validate", validateUserRequest, {
    body: t.Object({ token: t.String() }),
    detail: { tags: ["Auth"] },
  })
  .post("/login", loginRequest, {
    body: t.Pick(m.User._loginUser, ["username", "password"]),
    detail: { tags: ["Auth"] },
  })
  .post("/register", registerRequest, {
    body: t.Pick(m.User._createUser, ["username", "email", "password"]),
    detail: { tags: ["Auth"] },
  })
  .group("/verify", (verify) => {
    return verify
      .post("/request", requestVerifyChallenge, {
        body: t.Object({ id: t.Number(), token: t.String() }),
        detail: { tags: ["Auth"] },
      })
      .post("/respond/:code", respondVerifyChallenge, {
        detail: { tags: ["Auth"] },
      });
  });
