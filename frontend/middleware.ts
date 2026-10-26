import { NextResponse, type NextRequest } from "next/server";

const PUBLIC = ["/login", "/tentang", "/api/auth", "/__/auth", "/icon.svg", "/manifest.webmanifest"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (PUBLIC.some((p) => pathname.startsWith(p))) return NextResponse.next();
  // Cek cepat: ada cookie sesi atau tidak. Verifikasi penuh dilakukan di server (requireSession).
  const has = req.cookies.get("neo_session")?.value;
  if (!has) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.search = "";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon.svg|.*\\.(?:png|jpg|svg|webp|ico)).*)"],
};
