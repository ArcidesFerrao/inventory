// app/api/auth/reset-password/route.ts
import { NextRequest, NextResponse } from "next/server";
import { resetPassword, verifyPasswordResetToken } from "@/lib/verification";
import { getTranslations } from "next-intl/server";

export async function POST(req: NextRequest) {
    const rt = await getTranslations("Responses");
    try {
        const body = await req.json();
        const { token, password } = body;

        if (!token || !password) {
            return NextResponse.json(
                { error: rt("tokenPassRequired") },
                { status: 400 }
            );
        }

        if (password.length < 8) {
            return NextResponse.json(
                { error: rt("passwordRule") },
                { status: 400 }
            );
        }

        await resetPassword(token, password);

        return NextResponse.json({
            success: true,
            message: rt("resetSuccess") 
        });

    } catch (error) {
        console.error(rt("resetError"), error);
        return NextResponse.json(
            { error: error || rt("resetFail") },
            { status: 400 }
        );
    }
}

// Verify token validity (optional - for checking if token is still valid)
export async function GET(req: NextRequest) {
    const rt = await getTranslations("Responses");

    try {
        const token = req.nextUrl.searchParams.get("token");

        if (!token) {
            return NextResponse.json(
                { error: rt("tokenRequired")  },
                { status: 400 }
            );
        }

        await verifyPasswordResetToken(token);

        return NextResponse.json({
            success: true,
            message: rt("validToken")
        });

    } catch (err) {
        return NextResponse.json(
            { error: err || rt("invalidToken") },
            { status: 400 }
        );
    }
}