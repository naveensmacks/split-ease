// app/api/auth/session/route.ts
import { auth } from "@/lib/auth"; // Import your auth function
import { NextResponse } from "next/server";

export async function GET() {
  // Get the session using the auth function
  const session = await auth();

  const response = NextResponse.json(session || { user: null });

  // Add CORS headers
  response.headers.set("Access-Control-Allow-Credentials", "true");
  response.headers.set(
    "Access-Control-Allow-Origin",
    process.env.NEXT_PUBLIC_LANDING_PAGE_URL!
  );
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

  return response;
}

export async function OPTIONS() {
  const response = new NextResponse(null, { status: 200 });

  response.headers.set("Access-Control-Allow-Credentials", "true");
  response.headers.set(
    "Access-Control-Allow-Origin",
    process.env.NEXT_PUBLIC_LANDING_PAGE_URL!
  );
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

  return response;
}
