import { HttpException, HttpStatus } from '@nestjs/common';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const nodemailer = require('nodemailer');

const sendMailWithOrderDetails = async (
  orderNumber: any,
  userDetails: any,
  order: any,
) => {
  try {
    let total = 0;
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USERNAME,
        pass: process.env.GMAIL_PASSWORD,
      },
      secure: false,
    });
    const mailOptions = {
      from: 'Admin@GenericEcommerce.com',
      to: userDetails.emailId.toLowerCase(),
      subject: `Order Received #${orderNumber} | ${process.env.COMPANY_NAME}`,
      html: `Hi ${userDetails.firstName},<br><br>

      We have received your order. Thank you for choosing us. Please find below your order details<br><br>
      
      OrderNumber: ${orderNumber}<br>
      ${order.items.map((item: any, i: number) => {
        total += item.price * item.quantity;
        return `<p>Item${i + 1}<p>
           Name: ${item.name}<br>
           Price: ${item.price}<br>
           Quantity: ${item.quantity}<br>
           Total: ${item.quantity * item.price}<br>`;
      })}<br><br>
      
      Total Amount: ${total}`,
    };
    await transporter.sendMail(mailOptions);
  } catch (e) {
    console.log(e);
    throw new HttpException(
      {
        statusCode: 400,
        message: 'Mailer failed to deliver mail',
      },
      HttpStatus.BAD_REQUEST,
    );
  }
};

const sendMailWithOTPForResetPassword = async (
  userData: any,
  otp: any,
) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USERNAME,
        pass: process.env.GMAIL_PASSWORD,
      },
      secure: false,
    });
    const mailOptions = {
      from: 'Admin@GenericEcommerce.com',
      to: userData.email.toLowerCase(),
      subject: `OTP for password reset`,
      html: `<h1>Password reset OTP : ${otp}</a>`
    };
    await transporter.sendMail(mailOptions);
  } catch (e) {
    console.log(e);
    throw new HttpException(
      {
        statusCode: 400,
        message: 'Mailer failed to deliver mail',
      },
      HttpStatus.BAD_REQUEST,
    );
  }
};

export const MAILER = { sendMailWithOTPForResetPassword, sendMailWithOrderDetails}


