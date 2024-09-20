import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const MAIL_USER = process.env.CONTACT_MAIL_USER;
const MAIL_PASS = process.env.CONTACT_MAIL_PASSWORD;

export async function POST(request: Request) {
  try {
    const { username, message } = await request.json();

    const transporter = nodemailer.createTransport({
      service: "hotmail",
      auth: {
        user: MAIL_USER, 
        pass: MAIL_PASS, 
      },
    });

    const mailOptions = {
      from: MAIL_USER, 
      to: "dorufloare2005@gmail.com", 
      subject: "New Contact Form Submission",
      text: `Message from ${username}: ${message}`,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: "Email sent successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
