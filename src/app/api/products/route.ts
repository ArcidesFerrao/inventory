import { db } from "@/lib/db";
import { verifyToken } from "@/lib/verifyToken";
import { NextRequest, NextResponse } from "next/server";



export async function GET(req: NextRequest) {
    try {
        const {searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "20");
        const category = searchParams.get("category");
        
        const where = category ? { categoryId: category } : {};
        // console.log("🔍 Running db.product.findMany with:", { where, skip: (page - 1) * limit, take: limit });

        const [data, total] = await Promise.all([
            db.item.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
            }),
            db.item.count({where})
        ]);
        
        // console.log("✅ GET /products got promise complete");
        return NextResponse.json({
            data,
            pagination: { page, limit, total },
        });
    } catch (err) {
        console.error('❌ Error in GET /api/items:', err);
        return NextResponse.json({ error: `Error fetching items: ${err}`}, { status: 500})
    }
}

export async function POST(req: NextRequest) {
    try {
        verifyToken(req);
        const body = await req.json();
        const { name, description, price, stock, categoryId, unitId, unitQty, serviceId } = body;
        const item = await db.item.create({
            data: {
                name,
                description,
                price,
                stock,
                categoryId,
                unitId,
                unitQty,
                serviceId,
                status: 'ACTIVE',
            }
        })
        return NextResponse.json({
            message: "Item created successfully.",
            itemId: item.id,
        })
    } catch (err) {
        return NextResponse.json({ error: `Failed to create item: ${err}` }, { status: 500 })
    }
}