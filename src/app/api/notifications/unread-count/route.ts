import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
    const session = await getServerSession(authOptions);

    if(!session?.user.id) return NextResponse.json({ unread: 0 });

    const unread = await db.notification.count({
        where: {
            userId: session.user.id
        }
    })

    return NextResponse.json({ unread })

}