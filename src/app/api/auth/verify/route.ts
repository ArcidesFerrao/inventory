import { NextRequest, NextResponse } from "next/server";
import { verifyEmailToken } from "@/lib/verification";
// import { verifyEmailToken, verifyPhoneToken } from "@/lib/verification";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { identifier, token, type } = body;

        if (!identifier || !token || !type) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        if (type === "email") {
            await verifyEmailToken(identifier, token);
            return NextResponse.json({
                success: true,
                message: "Email verified successfully!"
            });
        // } else if (type === "phone") {
        //     await verifyPhoneToken(identifier, token);
        //     return NextResponse.json({
        //         success: true,
        //         message: "Phone number verified successfully!"
        //     });
        } else {
            return NextResponse.json(
                { error: "Invalid verification type" },
                { status: 400 }
            );
        }

    } catch (error) {
        console.error("Verification error:", error);
        return NextResponse.json(
            { error: error || "Verification failed" },
            { status: 400 }
        );
    }
}