import { NextRequest, NextResponse } from "next/server";
import { createPasswordResetToken } from "@/lib/verification";
import { sendPasswordResetEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { email } = body;

        if (!email) {
            return NextResponse.json(
                { error: "Email is required" },
                { status: 400 }
            );
        }

        const resetToken = await createPasswordResetToken(email);
        
        // Send reset email with link
        const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken.token}`;
        await sendPasswordResetEmail(email, resetUrl);

        return NextResponse.json({
            success: true,
            message: "Password reset link sent to your email"
        });

    } catch (error) {
        console.error("Password reset request error:", error);
        // Don't reveal if email exists or not for security
        return NextResponse.json({
            success: true,
            message: "If an account exists with this email, a reset link has been sent"
        });
    }
}

