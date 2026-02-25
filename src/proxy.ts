// src/middleware.ts
import { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware({
  ...routing,
  localeDetection: true
});

export async function proxy(req: NextRequest) {
    
    return intlMiddleware(req);
}

export const config = {
   matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
}