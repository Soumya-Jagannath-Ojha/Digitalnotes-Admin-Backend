import nodemailer from "nodemailer";
import environment from "../SecureCode.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: environment.email.user,
    pass: environment.email.pass,
  },
});

export const sendPasswordResetEmail = async (verificationCode) => {
  const mailOptions = {
    from: environment.email.user,
    to: "devin63roy@gmail.com",
    subject: "Password Reset Verification Code 🔐",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h1 style="color: #333;">Password Reset Request</h1>
                    <p style="color: #666; font-size: 16px;">
                        You have requested to reset your password. Here is your verification code:
                    </p>
                    <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0; text-align: center;">
                        <h2 style="color: #444; font-size: 32px; letter-spacing: 5px;">${verificationCode}</h2>
                    </div>
                    <p style="color: #666;">
                        This code will expire in 15 minutes. If you didn't request this, please ignore this email.
                    </p>
                    <div style="margin-top: 30px; color: #888; font-size: 14px;">
                        Best regards,<br>
                        Your Team
                    </div>
                </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Email sending failed:", error);
  }
};

// Example usage
// const sendEmail = async () => {
//   const result = await sendWelcomeEmail( "John Doe" );
//   console.log(result);
// };

// sendEmail();
