
// import { NextRequest, NextResponse } from "next/server";
// import { auth } from "./lib/auth";
// import { defaultLocale, locales } from "./i18n";
// import createMiddleware from "next-intl/middleware"

// const intlMiddleware = createMiddleware({
//   locales,
//   defaultLocale
// })
// export async function proxy(req: NextRequest) {
//     if (req.nextUrl.pathname === "/") {
//         return NextResponse.redirect(new URL(`/${defaultLocale}`, req.url))
//     }
//     const intlResponse = intlMiddleware(req);

//     if (intlResponse) return intlResponse

//     if (req.nextUrl.pathname.includes('/login')) {
//         return NextResponse.next()
//     }

//     const session = await auth();
    
//     if (!session?.user) {
//         const locale = req.nextUrl.pathname.split('/')[1] || defaultLocale
//         return NextResponse.redirect(new URL(`/${locale}/login`, req.url));
//     }
  
//     return NextResponse.next();
// }

// src/middleware.ts
import { NextRequest } from "next/server";
// import { defaultLocale } from "./i18n/request";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

export async function proxy(req: NextRequest) {
    // Handle root redirect
    // if (req.nextUrl.pathname === "/") {
    //     return NextResponse.redirect(new URL(`/${defaultLocale}`, req.url));
    // }
    
    // Just run intl middleware for now
    return intlMiddleware(req);
}



export const config = {
   matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
    // matcher: [
    //     '/',
    //     '/(pt|en)/:path*'
    // ],
    // matcher: [
    //     "/(pt|en)/:path*",
    //     "/(pt|en)/user/:path*", 
    //     "/(pt|en)/service/:path*",
    //     "/(pt|en)/supply/:path*", 
    //     "/(pt|en)/admin/:path*", 
    // ],
}