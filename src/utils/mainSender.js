const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const mailSender = async (email,title,body) => {
    try {
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        });

        let info = await transporter.sendMail({
            from: 'StudyNotion || CodeHelp - by Babbar',
            to:`${email}`,
            subject: `${title}`,
            html: `${body}`
        });
        return info;
    } catch (error) {
        console.log('Something went wrong in utils/mailSender');
        throw error;
    }
}

module.exports = mailSender;