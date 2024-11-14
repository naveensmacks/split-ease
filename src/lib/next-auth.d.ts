// .d in file names denotes declaration file
import { User } from "next-auth";
declare module "@auth/core/jwt" {
  interface JWT {
    userId: string;
    email: string;
    hasAccess: boolean;
  }
}

/**
TypeScript’s module augmentation feature. This feature allows you to extend or modify the types of an existing module without altering its source code.

What Does declare module Do?

	•	declare module: This keyword is used to tell TypeScript that you want to augment or extend the type declarations of a specific module.

Breaking down the code, what exactly it does?
Extending the JWT Interface:
	•	Inside the declare module block, you see an interface named JWT.
	•	This code is extending the JWT interface within the @auth/core/jwt module by adding a new property userId: string.
	•	This means that whenever you use the JWT type from @auth/core/jwt, it will now also include the userId property.

Why Is This Useful?

	•	Third-Party Modules: If you’re working with a third-party library and you need to add additional properties to their types, module augmentation allows you to do that without modifying the library’s source code.
**/

declare module "next-auth" {
  //Due to typescript narrowing only works in scope of a block or function,
  //session.user maybe undefined when called from other functions
  //so we are overriding session.user as mandatory(not optional)

  interface Session {
    user: User;
  }

  interface User {
    email: string;
  }
}
