import { response } from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const otpMail = async(email: any, otp: any) => {
       try {
        const transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 587,
          secure: false,
          requireTLS: true,
          auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
          },
        });
    
        const mailOptions = {
          from: "app.testplatform123@gmail.com",
          to: email,
          subject: "For email verifcation",
          html: "<html>"
                    + "<body style=\"font-family: Arial, sans-serif;\">"
                    + "<div style=\"background-color: #f5f5f5; padding: 20px;\">"
                    + "<h2 style=\"color: #333;\">Welcome to our app!</h2>"
                    + "<p style=\"font-size: 16px;\">Please enter the verification code below to continue:</p>"
                    + "<div style=\"background-color: #fff; padding: 20px; border-radius: 5px; box-shadow: 0 0 10px rgba(0,0,0,0.1);\">"
                    + "<h3 style=\"color: #333;\">Verification Code:</h3>"
                    + "<p style=\"font-size: 18px; font-weight: bold; color: #007bff;\">" + otp + "</p>"
                    + "</div>"
                    + "</div>"
                    + "</body>"
                    + "</html>",
        };
        transporter.sendMail(mailOptions, function (error:any, info:any) {
          if (error) {
            console.log("error", error);
          } else {
            console.log("Mail has been sent", info.response);
          }
        });
      } catch (error) {
        return response.json(error);
      }
}