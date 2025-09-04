
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
export function middleware(req: NextRequest) {
  const isAuthed = !!req.cookies.get("files_session")?.value;
  const url = req.nextUrl;
  if (url.pathname.startsWith("/dashboard") && !isAuthed) return NextResponse.redirect(new URL("/sign-in", req.url));
    return NextResponse.next();
}
export const config = { matcher: ["/", "/sign-in", "/dashboard/:path*"] };
