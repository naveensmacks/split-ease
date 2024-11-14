import NextAuth, { NextAuthConfig } from "next-auth";
import bcrypt from "bcryptjs";
import Credentials from "next-auth/providers/credentials";
import { NextResponse } from "next/server";
import { getUserByEmail } from "./server-utils";
import { logInSchema } from "./validation";

export const config = {
  pages: {
    //signIn - is where it redirects if authorized function in "callBacks:" returns false
    signIn: "/login",
  },
  providers: [
    Credentials({
      //By return null next-auth will throw error which can be caught at actions function which calls sign in
      //all the errors thrown from this function will be of error type "CredentialsSignin"
      async authorize(credentials) {
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
  ],
  callbacks: {
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
        if (isTryingToAccessApp) {
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
    jwt: async ({ token, user, trigger }) => {
      //jwt callback will be called on update() from useSession hook
      if (trigger === "update") {
        //get User from DB
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
      return token;
    },

    //by default session contains only email. So we are adding id to it fetching token we set in jwt
    session: ({ session, token }) => {
      if (session.user) {
        session.user.id = token.userId;
      }
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
