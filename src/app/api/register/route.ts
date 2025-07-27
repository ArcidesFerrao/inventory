import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";


export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, name, password } = body;

        if (!email || !name || !password ) {
            return NextResponse.json({ message:"Missing fields"}, { status: 400 });
        }

        const existingUser = await db.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return new NextResponse("Email already in use", { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        
        const user = await db.user.create({
            data: {
                email,
                name,
                hashedPassword,
            },
        });

        return NextResponse.json(user);
    } catch (error) {
        console.error("Register error: ", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}