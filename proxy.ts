import { auth, clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/site(.*)",
  "/api/uploadthing(.*)",
]);

export default clerkMiddleware(async (_auth, req) => {
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

  const host = req.headers.get("host") || "";

  const customSubDomain = host
    .split(`${process.env.NEXT_PUBLIC_DOMAIN}`)
    .filter(Boolean)[0];

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
    (url.pathname === "/site" && host === process.env.NEXT_PUBLIC_DOMAIN)
  ) {
    return NextResponse.rewrite(new URL("/site", req.url));
  }

  if (
    url.pathname.startsWith("/agency") ||
    url.pathname.startsWith("/subaccount")
  ) {
    return NextResponse.rewrite(
      new URL(pathWithSearchParams, req.url)
    );
  }
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};


















// import { clerkMiddleware } from '@clerk/nextjs/server';

// export default clerkMiddleware({
//   publicRoutes:[
//     '/site' ,'/api/uploadthing'
//   ]
// });

// export const config = {
//   matcher: [
//     // Skip Next.js internals and all static files, unless found in search params
//     '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
//     // Always run for API routes
//     '/(api|trpc)(.*)',
//   ],
// };