import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/dashboard", "/products", "/orders"]

export async function middleware(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET});

    const { pathname } = req.nextUrl;
    
    const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));

    if (isProtected && !token) {
        console.log("User testing mode")
        return NextResponse.redirect(new URL("/login", req.url));
    }
    
    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/products/:path*", "/orders/:path*"]
}