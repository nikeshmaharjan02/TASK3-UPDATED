const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    },
});


const sendEmail = async (to, subject, text) => {
    try {
        const mailOptions = {
            from: process.env.SMTP_USER,
            to,
            subject,
            text
        };

        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully to", to);
    } catch (error) {
        console.error("Email sending error:", error);
        throw new Error("Failed to send email");
    }
};

module.exports = sendEmail;
