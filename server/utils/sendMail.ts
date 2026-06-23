import dotenv from 'dotenv';
dotenv.config()
import nodemailer from "nodemailer"
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

type IEmail = {
    UserEmail: string,
    html: string,
    subject: string

}


async function sendEmail(emailData: IEmail) {

 
    const mailOptions = {
        from: "support@lms.com <support@lms.com>",
        to:  emailData.UserEmail,
        subject: emailData.subject,
        html: emailData.html
    };

    try {
        const res = await transporter.sendMail(mailOptions)
        return res
    } catch (err: any) {
        console.log(err.message)
    }
}


export default sendEmail