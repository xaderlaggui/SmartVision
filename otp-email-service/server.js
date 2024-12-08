const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Configure your SMTP settings
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com', // Replace with your SMTP server
  port: 587, // Replace with your SMTP port
  secure: false, // true for 465, false for other ports
  auth: {
    user: 'xader.jarabelo.laggui@gmail.com', // Replace with your email
    pass:  'mrzp ogzw upuq gurd', // Replace with your email password
  },
});

  app.post('/send-otp', (req, res) => {
    const { email, otp} = req.body;
  
    const mailOptions = {
      from: '"Smart Vision Company" <xader.jarabelo.laggui@gmail.com>',
      to: email,
      subject: 'Your OTP Code',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Your OTP Code</title>
        </head>
        <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #d7e0ee;">
          <table align="center" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 10px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);">
            <tr>
              <td style="background-color: #0471ff; padding: 20px; text-align: center; color: #ffffff; border-top-left-radius: 10px; border-top-right-radius: 10px;">
                <h2 style="margin: 0; font-size: 24px;">Your OTP Code</h2>
              </td>
            </tr>
            <tr>
              <td style="padding: 30px; text-align: center;">
                <p style="font-size: 16px; color: #000000; margin-bottom: 10px;">Hello, ${email}</p>
                <p style="font-size: 36px; font-weight: bold; color: #f1c40f; margin: 20px 0;">${otp}</p>
                <p style="font-size: 16px; color: #000000; margin-bottom: 20px;">This code is valid for a limited time. Please use it to complete your verification.</p>
                <p style="font-size: 14px; color: #555555;">Once you enter the OTP, your account will be successfully verified, and you will be granted access to your requested services.</p>
                <p style="font-size: 14px; color: #B8001F; margin-top: 30px;">If you did not request this OTP, please ignore this email or contact support if you have concerns.</p>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    };
    

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error); // Log the error
      return res.status(500).send(error.toString());
    }
    res.status(200).send('OTP sent: ' + info.response);
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
