import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { sendVerificationEmail } from "@/lib/email";
import { createEmailVerificationToken } from "@/lib/verification";


export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, name, password, phonenumber, role } = body;

        if (!email || !name || !password || !phonenumber) {
            return NextResponse.json({ message:"Missing fields"}, { status: 400 });
        }

        // Validate input
        if (!password || password.length < 8) {
            return NextResponse.json(
                { error: "Password must be at least 8 characters" },
                { status: 400 }
            );
        }

        if (!email && !phonenumber) {
            return NextResponse.json(
                { error: "Either email or phone number is required" },
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
                    { error: "Email already registered" },
                    { status: 400 }
                );
            }
            if (existingUser.phoneNumber === phonenumber) {
                return NextResponse.json(
                    { error: "Phone number already registered" },
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
            message: "User registered successfully. Please verify your email.",
            user
        });
    } catch (error) {
        console.error("Registration error: ", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}