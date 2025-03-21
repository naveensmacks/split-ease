import { getVerificationTokenByEmail } from "./server-utils";
import { SignJWT, jwtVerify, errors } from "jose";
import prisma from "@/lib/db";
import { TokenPurpose } from "@prisma/client";

export const generateVerificationToken = async (
  email: string,
  purpose: TokenPurpose
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
  const existingToken = await getVerificationTokenByEmail(email, purpose);

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
      //add 1h to the current time
      expires: new Date(new Date().getTime() + 1000 * 60 * 60 * 1),
      purpose: purpose,
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

export const generateVerificationTokenForEmailChange = async (
  email: string,
  updatedEmail: string,
  purpose: TokenPurpose
) => {
  // Generate a secure token using jose
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  const token = await new SignJWT({ email: email, updatedEmail: updatedEmail })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1h") // Expires in 1 hour
    .sign(secret);

  // Check if a token already exists for the user
  const existingToken = await getVerificationTokenByEmail(email, purpose);

  console.log("existingToken: ", existingToken);

  if (existingToken) {
    console.log("existingToken.expires: ", existingToken.expires);
    if (existingToken.expires > new Date()) {
      return {
        isSuccess: false,
        token: "",
        message:
          "An email change request has already been sent. Please wait for 1 hour until it expires.",
      };
    } else {
      await prisma.verificationToken.delete({
        where: {
          id: existingToken.id,
        },
      });
    }
  }

  const expires = new Date().getTime() + 1000 * 60 * 60 * 1; // 1 hour
  // Create a new verification token
  const verificationToken = await prisma.verificationToken.create({
    data: {
      email,
      token,
      expires: new Date(expires),
      purpose: purpose,
    },
  });

  return {
    isSuccess: true,
    token: verificationToken.token,
    message: "",
  };
};

export async function verifyTokenForEmailChange(token: string): Promise<{
  isJwtVerified: boolean;
  email?: string;
  updatedEmail?: string;
  message?: string;
  isExpired?: boolean;
}> {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    console.log("payload :", payload);
    const { email, updatedEmail } = payload;
    return {
      isJwtVerified: true,
      email: email as string,
      updatedEmail: updatedEmail as string,
    };
  } catch (error) {
    console.error("Invalid or expired token:", error);
    if (error instanceof errors.JWTExpired) {
      return {
        isJwtVerified: false,
        isExpired: true,
        email: error.payload.sub,
        message:
          "Your verification link has expired. Request for a new verification link.",
      };
    } else if (error instanceof errors.JWTInvalid) {
      return {
        isJwtVerified: false,
        message: "Invalid token. Request for a new verification link.",
      };
    } else {
      return { isJwtVerified: false, message: "Unknown error occurred." };
    }
  }
}
