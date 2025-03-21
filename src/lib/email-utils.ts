import { User } from "@prisma/client";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
export async function sendVerificationEmail(user: User, token: string) {
  const confirmationLink = `${process.env.NEXTAUTH_URL_INTERNAL}/verify-email?token=${token}`;

  try {
    await resend.emails.send({
      //from: "onboarding@resend.dev", // default this if you dont own a doamin yet(just for development/testiing), but the limitation is you can send email to only one email(the one which we login in resend.com)
      from: process.env.EMAIL_FROM!, // Ensure your domain is verified in Resend
      to: user.email!,
      subject: "Splitease - Verify your email",
      html: `
        <p>Hello ${user.firstName} ${user.lastName},</p>
        <p>Click the link below to verify your email:</p>
        <a href="${confirmationLink}">${confirmationLink}</a>
        <p>If you did not request this, please ignore this email.</p>
      `,
    });

    console.log("Verification email sent to:", user.email);
  } catch (error) {
    console.error("Failed to send verification email:", error);
    throw new Error("Error sending verification email");
  }
}

export async function sendVerificationEmailForEmailChange(
  user: User,
  email: string,
  token: string
) {
  const confirmationLink = `${process.env.NEXTAUTH_URL_INTERNAL}/change-email?token=${token}`;

  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: email,
      subject: "Splitease - Change your email",
      html: `
        <p>Hello ${user.firstName} ${user.lastName},</p>
        <p>Click the link below to change your email:</p>
        <a href="${confirmationLink}">${confirmationLink}</a>
        <p>If you did not request this, please ignore this email.</p>
      `,
    });

    console.log("Email change email sent to:", email);
  } catch (error) {
    console.error("Failed to send email change email:", error);
    throw new Error("Error sending email change email");
  }
}

export async function sendPasswordResetEmail(user: User, token: string) {
  const resetLink = `${process.env.NEXTAUTH_URL_INTERNAL}/reset-password?token=${token}`;

  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: user.email!,
      subject: "Splitease - Reset your password",
      html: `
        <p>Hello ${user.firstName} ${user.lastName},</p>
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>If you did not request this, please ignore this email.</p>
      `,
    });

    console.log("Password reset email sent to:", user.email);
  } catch (error) {
    console.error("Failed to send password reset email:", error);
    throw new Error("Error sending password reset email");
  }
}
