import brevo from "../config/brevo.js";
import {
  RESET_PASSWORD_SUBJECT,
  resetPasswordBody,
} from "../messages/reset.password.message.js";

export const generateOTP = () => {
  const OTP =
    Math.floor(Math.random() * 10) * 10000 +
    Math.floor(Math.random() * 10) * 1000 +
    Math.floor(Math.random() * 10) * 100 +
    Math.floor(Math.random() * 10) * 10 +
    Math.floor(Math.random() * 10);
  return OTP;
};
export const sendPasswordResetEmail = async (
  email: string,
  name: string,
  minutes: number,
  OTP: number,
) => {
  try {
    await brevo.transactionalEmails.sendTransacEmail({
      sender: {
        email: process.env.BREVO_SENDER_EMAIL!,
        name: process.env.BREVO_SENDER_NAME,
      },
      to: [{ email }],
      subject: RESET_PASSWORD_SUBJECT,
      textContent: resetPasswordBody(OTP, name, minutes),
    });
    console.log("Password reset mail sent successfully");
    return true;
  } catch (error) {
    console.error("Email sending failed : ", error);
    return false;
  }
};
