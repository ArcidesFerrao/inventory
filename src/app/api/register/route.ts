import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";


export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, name, password, phonenumber } = body;

        if (!email || !name || !password || !phonenumber) {
            return NextResponse.json({ message:"Missing fields"}, { status: 400 });
        }

        const existingEmailUser = await db.user.findUnique({
            where: { email },
        });

        if (existingEmailUser) {
            return new NextResponse("Email already in use", { status: 400 });
        }
        const existingPhoneNumberUser = await db.user.findUnique({
            where: { email },
        });

        if (existingPhoneNumberUser) {
            return new NextResponse("Phone number already in use", { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        
        const user = await db.user.create({
            data: {
                email,
                name,
                phoneNumber: phonenumber,
                hashedPassword,
            },
        });

        return NextResponse.json(user);
    } catch (error) {
        console.error("Register error: ", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}