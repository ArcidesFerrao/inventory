import { NextRequest, NextResponse } from "next/server";
import { verifyEmailToken } from "@/lib/verification";
import { getTranslations } from "next-intl/server";
// import { verifyEmailToken, verifyPhoneToken } from "@/lib/verification";

export async function POST(req: NextRequest) {
    const rt = await getTranslations("Responses");

    
    try {
        const body = await req.json();
        const { identifier, token, type } = body;

        if (!identifier || !token || !type) {
            return NextResponse.json(
                { error: rt("missingFields") },
                { status: 400 }
            );
        }

        if (type === "email") {
            await verifyEmailToken(identifier, token);
            return NextResponse.json({
                success: true,
                message: rt("emailVerified")
            });
        // } else if (type === "phone") {
        //     await verifyPhoneToken(identifier, token);
        //     return NextResponse.json({
        //         success: true,
        //         message: "Phone number verified successfully!"
        //     });
        } else {
            return NextResponse.json(
                { error: rt("invalidType") },
                { status: 400 }
            );
        }

    } catch (error) {
        console.error(rt("verificationError"), error);
        return NextResponse.json(
            { error: error || rt("verificationFail") },
            { status: 400 }
        );
    }
}