import { jwt } from "@elysiajs/jwt";

const CreateJwt = jwt({
  name: "jwt",
  secret:
    "Undermine-Resonant-Ashen-Imprison-Caption-Growing-Pursuant-Refined4-Tucking-Kindling-Hug-Remover-Account-Utilize-Unsaddle",
});
export const Jwt = CreateJwt.decorator.jwt;
