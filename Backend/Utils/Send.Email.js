const nodemailer = require("nodemailer");

const SendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: "smpt.gmail.com",
    port: 456,
    service: "gmail",
    auth: {
      user: "khanzaidaboy@gmail.com",
      pass: "ryyzkoskmmhxoqdq",
    },
  });
  const mailOptions = {
    from: "khanzaidaboy@gmail.com",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  await transporter.sendMail(mailOptions);
};
module.exports = SendEmail;
