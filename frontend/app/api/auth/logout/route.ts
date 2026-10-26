import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE } from "@/lib/session";

export async function POST(req: Request) {
  cookies().set(SESSION_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
  return NextResponse.redirect(new URL("/login", req.url), { status: 303 });
}
