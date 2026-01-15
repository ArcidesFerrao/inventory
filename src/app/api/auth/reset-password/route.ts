// app/api/auth/reset-password/route.ts
import { NextRequest, NextResponse } from "next/server";
import { resetPassword, verifyPasswordResetToken } from "@/lib/verification";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { token, password } = body;

        if (!token || !password) {
            return NextResponse.json(
                { error: "Token and password are required" },
                { status: 400 }
            );
        }

        if (password.length < 8) {
            return NextResponse.json(
                { error: "Password must be at least 8 characters" },
                { status: 400 }
            );
        }

        await resetPassword(token, password);

        return NextResponse.json({
            success: true,
            message: "Password reset successfully"
        });

    } catch (error) {
        console.error("Password reset error:", error);
        return NextResponse.json(
            { error: error || "Password reset failed" },
            { status: 400 }
        );
    }
}

// Verify token validity (optional - for checking if token is still valid)
export async function GET(req: NextRequest) {
    try {
        const token = req.nextUrl.searchParams.get("token");

        if (!token) {
            return NextResponse.json(
                { error: "Token is required" },
                { status: 400 }
            );
        }

        await verifyPasswordResetToken(token);

        return NextResponse.json({
            success: true,
            message: "Token is valid"
        });

    } catch (err) {
        return NextResponse.json(
            { error: err || "Invalid or expired token" },
            { status: 400 }
        );
    }
}