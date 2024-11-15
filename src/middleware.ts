import { auth } from "./lib/auth";

export default auth;

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - icon.svg (icon.svg file)
     */
    "/((?!api|_next/static|_next/image|icon.svg).*)",
  ],
};
