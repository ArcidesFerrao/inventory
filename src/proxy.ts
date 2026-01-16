// import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "./lib/auth";



export async function proxy(req: NextRequest) {
    // const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET});

    const session = await auth();


    
    if (!session?.user) {
        return NextResponse.redirect(new URL("/login", req.url));
    }
  
    return NextResponse.next();
}

export const config = {
    matcher: [
        "/user/:path*", 
        "/service/:path*",
        "/supply/:path*", 
    ],
}