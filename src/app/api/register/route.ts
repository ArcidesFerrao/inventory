import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { sendVerificationEmail } from "@/lib/email";
import { createEmailVerificationToken } from "@/lib/verification";
import { getTranslations } from "next-intl/server";


export async function POST(req: Request) {
    const rt = await getTranslations("Responses");

    try {
        const body = await req.json();
        const { email, name, password, phonenumber, role } = body;

        if (!email || !name || !password || !phonenumber) {
            return NextResponse.json({ message: rt("missingFields")}, { status: 400 });
        }

        // Validate input
        if (!password || password.length < 8) {
            return NextResponse.json(
                { error: rt("passwordRule") },
                { status: 400 }
            );
        }

        if (!email && !phonenumber) {
            return NextResponse.json(
                { error: rt("eitherRequired") },
                { status: 400 }
            );
        }

        // Check if user already exists
        const existingUser = await db.user.findFirst({
            where: {
                OR: [
                    email ? { email } : {},
                    phonenumber ? { phonenumber } : {},
                ].filter(obj => Object.keys(obj).length > 0)
            }
        });

        if (existingUser) {
            if (existingUser.email === email) {
                return NextResponse.json(
                    { error: rt("registeredEmailError") },
                    { status: 400 }
                );
            }
            if (existingUser.phoneNumber === phonenumber) {
                return NextResponse.json(
                    { error: rt("registeredNumberError") },
                    { status: 400 }
                );
            }
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        
        const user = await db.user.create({
            data: {
                email,
                name,
                phoneNumber: phonenumber,
                hashedPassword,
                role
            },
        });

        // Send verification
        if (email) {
            const verificationToken = await createEmailVerificationToken(email, user.id);
            await sendVerificationEmail(email, verificationToken.token);
        }

        return NextResponse.json({
            success: true,
            message: rt("registerUserSuccess"),
            user
        });
    } catch (error) {
        console.error(rt("registerError"), error);
        return new NextResponse(rt("serverError"), { status: 500 });
    }
}