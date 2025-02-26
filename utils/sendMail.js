const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // True for 465, false for 587
      auth: {
        user: process.env.EMAIL, // Your Gmail address
        pass: process.env.EMAIL_PASSWORD, // Your Gmail App Password (Not your login password)
      },
    });

    const mailOptions = {
      from: `"Your Company" <${process.env.EMAIL}>`, // Sender name and email
      to: to, // Receiver email
      subject: subject, // Email subject
      text: text, // Email body (plain text)
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
    return info; // Return info for success tracking
  } catch (error) {
    console.error("Error sending email: ", error);
    throw new Error("Email sending failed"); // Handle error properly
  }
};

module.exports = sendEmail;
