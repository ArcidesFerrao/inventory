import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = [
    "/dashboard", 
    "/products", 
    "/orders", 
    "/stock", 
    "/service", 
    "/supply", 
    "/[id]"
];

export async function proxy(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET});

    const { pathname } = req.nextUrl;
    
    const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));

    if (isProtected && !token) {
        return NextResponse.redirect(new URL("/login", req.url));
    }
    
    // if (token) {
    //     const userId = token.sub;

    //     if (pathname.startsWith("/supply")) {
    //         const supplier = await db.supplier.findUnique({ where: { userId }});

    //         if (!supplier && pathname !== "/supply/register") {
    //             return NextResponse.redirect(new URL("/supply/register", req.url))
    //         }
    //     }

    //     if (pathname.startsWith("/service")) {
    //         const service = await db.service.findUnique({ where: { userId }})

    //         if (!service && pathname !== "/service/register") {
    //             return NextResponse.redirect(new URL("/service/register", req.url))
    //         }
    //     }
    // }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/dashboard/:path*", 
        "/products/:path*", 
        "/orders/:path*",
        "/stock/:path*",
        "/service/:path*",
        "/supply/:path*", 
        "/:id/:path*", 
    ],
}