import nodemailer from "nodemailer"
import dotenv from "dotenv/config"

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAILER_EMAIL,
    pass: process.env.MAILER_PASSWORD,
  },
})

export const sendMail = async (toAddress, subject, htmlBody) => {
  const mailOptions = {
    from: {
      name: process.env.SITE_TITLE,
      address: process.env.MAILER_EMAIL,
    }, // sender address
    to: toAddress, // list of receivers
    subject: subject, // Subject line
    html: htmlBody, // html body
  }
  try {
    transporter.sendMail(mailOptions)
    console.log("Email sent successfully")
  } catch (error) {
    console.log(error)
  }
}
