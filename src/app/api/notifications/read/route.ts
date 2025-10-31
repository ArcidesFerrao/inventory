import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session?.user.id) return NextResponse.json({ error: "Unauthorized"}, { status: 400 })

    const { notificationId } = await req.json();

    await db.notification.update({
        where: {
            id: notificationId,
            userId: session.user.id,
        },
        data: {
            read: true
        }
    })

    return NextResponse.json({ success: true });
}