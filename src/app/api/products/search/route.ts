

import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {

    const {searchParams} = new URL(req.url);
    const q = searchParams.get("q") || "";

    if (!q || q.length < 2) return NextResponse.json([]);
    
    const results = await db.product.findMany({
        where: {
            name: {
                contains: q,
                mode: "insensitive"
            },
            status: "ACTIVE",
        },
        select: { name: true },
        take: 10,
    })

    return NextResponse.json(results.map(((r) => r.name)))
}
