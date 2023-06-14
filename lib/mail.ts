import { createTransport, getTestMessageUrl } from "nodemailer"

const port = process.env.MAIL_PORT || "587";

const transporter = createTransport({
    port: parseInt(port),
    host: process.env.MAIL_HOST,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});

const makeANiceEmail = (text: string) => {
    return `
        <div style="
            border: 1px solid black;
            padding: 20px;
            font-family: sans-serif;
            line-height: 2;
            font-size: 20px;
        ">
            <h2>Hello There!</h2>
            <p>${text}</p>
            <p>Bye! GeoffTheG</p>
        </div>
    `;
};

export const sendPasswordResetEmail = async (resetToken: string, to: string) => {
    const info = await transporter.sendMail({
        to,
        from: "Geoff@sickfits.com",
        subject: "Your password reset token!",
        html: makeANiceEmail(`Your Password Reset Token is here!
            <a href="${process.env.FRONTEND_URL}/reset?token=${resetToken}">Click Here to Reset</a>
        `)
    })
    if (process.env.MAIL_USER?.includes("ethereal.email")) {
        console.log(`Message Sent! Preview it at ${getTestMessageUrl(info)}`);
    };
};