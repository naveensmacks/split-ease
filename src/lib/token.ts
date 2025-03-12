import { getVerificationTokenByEmail } from "./server-utils";
import { SignJWT, jwtVerify, errors } from "jose";
import prisma from "@/lib/db";

export const generateVerificationToken = async (
  email: string,
  isForRegistration: boolean
) => {
  // Generate a secure token using jose
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  const token = await new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(email)
    .setIssuedAt()
    .setExpirationTime("1h") // Expires in 1 hour
    .sign(secret);
  const expires = new Date().getTime() + 1000 * 60 * 60 * 1; // 1 hours

  // Check if a token already exists for the user
  const existingToken = await getVerificationTokenByEmail(
    email,
    isForRegistration
  );

  if (existingToken) {
    await prisma.verificationToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  // Create a new verification token
  const verificationToken = await prisma.verificationToken.create({
    data: {
      email,
      token,
      expires: new Date(expires),
      isForRegistration: isForRegistration,
    },
  });

  return verificationToken;
};

export async function verifyToken(token: string): Promise<{
  isJwtVerified: boolean;
  email?: string;
  message?: string;
  isExpired?: boolean;
}> {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    console.log("payload sub :", payload.sub);
    return { isJwtVerified: true, email: payload.sub }; // `sub` contains the email
  } catch (error) {
    console.error("Invalid or expired token:", error);
    if (error instanceof errors.JWTExpired) {
      return {
        isJwtVerified: false,
        isExpired: true,
        email: error.payload.sub,
        message:
          "Your verification link has expired. We’ve sent a new one to your email.",
      };
    } else if (error instanceof errors.JWTInvalid) {
      return { isJwtVerified: false, message: "Invalid token" };
    } else {
      return { isJwtVerified: false, message: "Unknown error occurred." };
    }
  }
}
