import nodemailer from "nodemailer";

export const smtp = nodemailer.createTransport({
    host: "127.0.0.1",
    port: 1025,
    secure: false, // upgrade later with STARTTLS
});