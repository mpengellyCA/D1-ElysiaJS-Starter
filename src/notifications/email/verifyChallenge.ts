import {smtp} from "../../services/smtp";


export async function sendVerifyChallengeEmail(challenge: string, user ) {

    const message = {
        from: "sender@example.com",
        to: user.email,
        subject: "Verify Your Email & Account",
        html: "<p style='font-size: 20px;'>Please Enter This Challenge Code: <span style='font-family: monospace; font-weight: 700;'>"+ challenge +"</span></p>",
    };
    return await smtp.sendMail(message);

}


