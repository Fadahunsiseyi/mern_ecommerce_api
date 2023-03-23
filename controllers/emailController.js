const nodemailer = require("nodemailer");
const asyncHandler = require("express-async-handler");

const sendEmail = asyncHandler(async (data) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: 'enter your enail',
      pass: 'enter your generated password',
    },
  });
  console.log(transporter,'THE TRANSPORTER IS SUCCESSFUL')

  let info = await transporter.sendMail({
    from: '"Fred Foo 👻" <foo@example.com>',
    to: data.to,
    subject: data.subject,
    text: data.text,
    html: data.html,
  });
  console.log(info)

  console.log("Message sent: %s", info.messageId);

  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
});

module.exports = sendEmail;