import NextAuth, { NextAuthConfig } from "next-auth";
import bcrypt from "bcryptjs";
import Credentials from "next-auth/providers/credentials";
import { NextResponse } from "next/server";
import { getUserByEmail } from "./server-utils";
import { logInSchema } from "./validation";
import GoogleProvider from "next-auth/providers/google";
import prisma from "@/lib/db";

export const config = {
  pages: {
    //signIn - is where it redirects if authorized function in "callBacks:" returns false
    signIn: "/login",
  },
  providers: [
    Credentials({
      //By return null next-auth will throw error which can be caught at actions function which calls sign in
      //all the errors thrown from this function will be of error type "CredentialsSignin"
      /**
       * Order of Execution: 1
       * When it Runs:
       *  When a user submits login form
       *
       * What It Does:
       *  Validates credentials
       *
       * Possible Outcomes:
       *  ✅ Returns user if valid, ❌ Returns null if invalid
       *
       */
      async authorize(credentials) {
        console.log("authorize: ", credentials);
        //runs on login

        //validation
        const validatedFormDataObject = logInSchema.safeParse(credentials);
        if (!validatedFormDataObject.success) {
          // return {
          //   message: "Invalid form Data.",
          // };
          //cant return a message, only return a type of Promise<User | null>
          //typescript error so return null
          return null;
        }

        //extract data
        const { email, password } = validatedFormDataObject.data;
        const user = await getUserByEmail(email);
        //console.log("user: ", user);

        if (!user) {
          console.log("No User Found");
          return null;
        }

        if (user.hashedPassword) {
          const passwordsMatch = await bcrypt.compare(
            password as string,
            user.hashedPassword
          );
          if (!passwordsMatch) {
            console.log("Invalid credentials");
            return null;
          }
        } else {
          //highly unlikely, will never happen(only on DB data issues)
          console.log("Password empty in DB");
          return null;
        }

        return { ...user, id: user.userId };
      },
    }),
    //Google Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    /**
     * Order of Execution: 2
     * When it Runs:
     *  After successful authentication(1)
     *
     * What It Does:
     *  Extra validation (e.g., check email verification)
     *
     * Possible Outcomes:
     *  ✅ Returns true (continue), ❌ Returns false (deny login)
     *
     */
    async signIn({ user, account }) {
      console.log("signIn: user ", user);
      console.log("signIn: account ", account);
      if (account?.provider !== "credentials") {
        if (account?.provider === "google") {
          console.log("Google User Signing In: ", user);

          // Check if the user already exists
          let existingUser = await getUserByEmail(user.email as string);

          if (!existingUser) {
            // ✅ If new Google user, create an account with no password
            existingUser = await prisma.user.create({
              data: {
                firstName: user.name?.split(" ")[0] || "Google",
                lastName: user.name?.split(" ")[1] || "User",
                email: user.email!.toLowerCase(),
                hashedPassword: null, // ✅ No password needed for Google users
                emailVerified: new Date(),
              },
            });
          } else {
            // ✅ If user exists, update emailVerified if null
            if (!existingUser.emailVerified) {
              await prisma.user.update({
                where: { userId: existingUser.userId },
                data: { emailVerified: new Date() },
              });
            }
          }

          // ✅ Ensure `user.id` is correctly pointing to DB userId for JWT callback
          user.id = existingUser.userId;

          return true;
        }
      }

      console.log("user in signIn: ", user);
      const existingUser = await getUserByEmail(user.email as string);

      if (!existingUser?.emailVerified) {
        //AuthorizedCallbackError will be thrown and handled by switch default in login method in action.ts
        return false;
      }

      return true;
    },

    /**
     * Order of Execution: 5
     * When it Runs:
     *  On every request to a protected route
     *
     * What It Does:
     *  Grants or denies access. Or rerirects to callBackUrl or homepage(app/groups)
     *
     * Possible Outcomes:
     * ✅ Allows access, ❌ Redirects
     *
     */
    authorized: ({ auth, request }) => {
      //runs on every request with middleware
      const isLoggedIn = Boolean(auth?.user);
      const isTryingToAccessApp = request.nextUrl.pathname.includes("app");

      console.log(
        "pathname : ",
        request.nextUrl.pathname,
        " isLoggedIn: ",
        isLoggedIn,
        " isTryingToAccessApp: ",
        isTryingToAccessApp
      );

      if (isLoggedIn) {
        if (
          isTryingToAccessApp ||
          request.nextUrl.pathname.includes("change-email")
        ) {
          // const pathname = request.nextUrl.pathname;
          // if (request.nextUrl.pathname.includes("change-email")) {
          //   return NextResponse.redirect(
          //     new URL("app/".concat(pathname), request.url)
          //   );
          // }
          return true;
        } else {
          const redirectUrl =
            request.nextUrl.searchParams.get("callbackUrl") || "/app/groups";
          //Note: NExtJs redirect() will throw as an error and handled by NExtJs itself - to redirect the page
          //so if it is caught somewhere by our code, then it needs to be rethrowed so that NExtJs can handle it
          return NextResponse.redirect(new URL(redirectUrl, request.url));
        }
      } else {
        if (isTryingToAccessApp) {
          return false;
        } else {
          return true;
        }
      }
    },

    //by default token contains only email. So we are adding id to it
    /**
     * Order of Execution: 3
     * When it Runs:
     *  After signIn(2) and during session updates
     *
     * What It Does:
     *  Adds userId to JWT token
     *
     * Possible Outcomes:
     *  ✅ Stores token with user details
     *
     */
    jwt: async ({ token, user, trigger, account }) => {
      console.log("jwt1: user ", user);
      console.log("jwt1: account ", account);
      //jwt callback will be called on update() from useSession hook
      if (trigger === "update") {
        const userFromDB = await getUserByEmail(token.email);
        if (userFromDB) {
          user = {
            ...userFromDB,
            id: userFromDB.userId,
          };
        }
      }
      if (user) {
        //once user is logged in
        //by default token contains only name,email,picture and sub. So we are adding userId manaully to it
        //check DefaultJWT interface. And its overridden in next-auth.d.ts.
        token.userId = user.id;
        token.email = user.email!;
      }
      console.log("jwt2: token ", token);
      return token;
    },

    //by default session contains only email. So we are adding id to it fetching token we set in jwt
    /**
     * Order of Execution: 4
     * When it Runs:
     *  When useSession() is called
     *
     * What It Does:
     *  Adds userId to session object
     *
     * Possible Outcomes:
     *  ✅ Session object created
     *
     */
    session: ({ session, token }) => {
      if (session.user) {
        session.user.id = token.userId;
      }
      console.log("session: ", session);
      return session;
    },
  },
} satisfies NextAuthConfig;
export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
} = NextAuth(config);
