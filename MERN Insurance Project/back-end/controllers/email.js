// emailService.js
const nodemailer = require('nodemailer');

// Create a transporter object using your email service provider
const transporter = nodemailer.createTransport({
    service: 'Gmail', // You can change this to your email provider
    auth: {
        user: 'taken9241@gmail.com', // Your email address
        pass: 'rmqytpembzbsefdj' // Your email password or app password
    }
});

// Function to send email notifications
const sendEmail = (to, subject, text) => {
    const mailOptions = {
        from: 'taken9241@gmail.com', // Sender's email
        to, // Recipient's email
        subject, // Subject line
        text // Plain text body
    };

    return transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
