import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/site(.*)",
  "/api/uploadthing(.*)",
  "/pricing(.*)",
  "/features(.*)",
  "/documentation(.*)",
  "/agency/sign-in(.*)",
  "/agency/sign-up(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.redirect(new URL("/agency/sign-in", req.url));
    }
  }

  const url = req.nextUrl;
  const searchParams = url.searchParams.toString();
  const pathWithSearchParams = `${url.pathname}${
    searchParams ? `?${searchParams}` : ""
  }`;

  const host = req.headers.get("host") ?? "";
  const domain = process.env.NEXT_PUBLIC_DOMAIN;

  let customSubDomain: string | undefined;

  if (domain && host.endsWith(domain)) {
    const subdomain = host.replace(`.${domain}`, "");
    if (subdomain !== host && subdomain !== "www") {
      customSubDomain = subdomain;
    }
  }

  if (customSubDomain) {
    return NextResponse.rewrite(
      new URL(`/${customSubDomain}${pathWithSearchParams}`, req.url)
    );
  }

  if (url.pathname === "/sign-in" || url.pathname === "/sign-up") {
    return NextResponse.redirect(new URL("/agency/sign-in", req.url));
  }

  if (
    url.pathname === "/" ||
    (url.pathname === "/site" && host === domain)
  ) {
    return NextResponse.rewrite(new URL("/site", req.url));
  }

  if (
    url.pathname.startsWith("/agency") ||
    url.pathname.startsWith("/subaccount")
  ) {
    return NextResponse.rewrite(new URL(pathWithSearchParams, req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
