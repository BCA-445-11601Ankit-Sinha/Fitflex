import nodemailer from "nodemailer";
import { signUpTemplate } from "../mailTemplates/signUpTemplate";
import { loginTemplate } from "../mailTemplates/loginTemplate";
import { forgotPasswordOtpTemplate } from "../mailTemplates/forgotPasswordOtpTemplate";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  throw new Error("Email credentials are not set in environment variables.");
}

const transporter = nodemailer.createTransport({
  service: "gmail", 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmail = async (to: string, subject: string, name: string, type:"signUp" | "logIn") => {
    console.log('user',process.env.EMAIL_USER);
    console.log('user',process.env.EMAIL_PASS);

  let html :string;
    if(type === "signUp"){
        html = signUpTemplate(name);
    } else if(type === "logIn"){
        html = loginTemplate(name);
    } else {
        throw new Error("Invalid email template type");
    }
  await transporter.sendMail({
    from: `${process.env.COMPANY_NAME} <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};

export const sendPasswordResetOtpEmail = async (to: string, name: string, otp: string) => {
  const company = process.env.COMPANY_NAME ?? "FitFlex";
  const html = forgotPasswordOtpTemplate(name, otp);
  await transporter.sendMail({
    from: `${company} <${process.env.EMAIL_USER}>`,
    to,
    subject: `${company} — Your password reset code`,
    html,
  });
};