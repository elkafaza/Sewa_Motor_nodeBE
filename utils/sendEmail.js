import nodemailer from 'nodemailer'

const sendEmail = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  })

  const mailOptions = {
    from: `"Your App Name" <${process.env.EMAIL_USERNAME}>`,
    to,
    subject,
    html
  }

  await transporter.sendMail(mailOptions)
}

export default sendEmail
