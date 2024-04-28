import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { i18nRouter } from "next-i18n-router";
import i18nConfig from "./src/i18n/i18nConfig";

const protectedUrls = ["/patients", "/users", "/examinations"];

export async function middleware(request: NextRequest) {
  const { isAuthenticated } = getKindeServerSession();
  const isLoggedIn = await isAuthenticated();
  const isProtectedUrl = protectedUrls.some((prefix) =>
    request.nextUrl.pathname.includes(prefix)
  );
  const resolvedRequest = i18nRouter(request, i18nConfig);
  const locale = resolvedRequest.headers.get("x-next-i18n-router-locale");

  if (isLoggedIn && !isProtectedUrl) {
    return NextResponse.redirect(new URL(`/${locale}/patients`, request.url));
  }

  if (!isLoggedIn && isProtectedUrl) {
    return NextResponse.redirect(new URL(`/`, request.url));
  }

  if (request.nextUrl.pathname === "/") {
    return NextResponse.next();
  }

  return resolvedRequest;
}

export const config = {
  matcher: ["/", "/((?!api|static|.*\\..*|_next).*)"]
};
