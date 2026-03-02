import { NextRequest, NextResponse } from "next/server";
import { createPasswordResetToken } from "@/lib/verification";
import { sendPasswordResetEmail } from "@/lib/email";
import { getTranslations } from "next-intl/server";

export async function POST(req: NextRequest) {

    const rt = await getTranslations("Responses")

    try {
        const body = await req.json();
        const { email } = body;

        if (!email) {
            return NextResponse.json(
                { error: rt("emailRequired") },
                { status: 400 }
            );
        }

        const resetToken = await createPasswordResetToken(email);
        
        // Send reset email with link
        const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken.token}`;
        await sendPasswordResetEmail(email, resetUrl);

        return NextResponse.json({
            success: true,
            message: rt("passwordResetSent")
        });

    } catch (error) {
        console.error(rt("resetError"), error);
        // Don't reveal if email exists or not for security
        return NextResponse.json({
            success: true,
            message: rt("willSendResetLink")
        });
    }
}

