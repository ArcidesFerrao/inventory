import { db } from "@/lib/db";
import { verifyToken } from "@/lib/verifyToken";
import { NextRequest, NextResponse } from "next/server";



export async function GET(req: NextRequest) {
    try {
        const {searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "20");
        const category = searchParams.get("category");
        
        const where = category ? { category } : {};
        // console.log("🔍 Running db.product.findMany with:", { where, skip: (page - 1) * limit, take: limit });

        const [data, total] = await Promise.all([
            db.product.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
            }),
            db.product.count({where})
        ]);
        
        // console.log("✅ GET /products got promise complete");
        return NextResponse.json({
            data,
            pagination: { page, limit, total },
        });
    } catch (err) {
        console.error('❌ Error in GET /api/products:', err);
        return NextResponse.json({ error: `Error fetching products: ${err}`}, { status: 500})
    }
}

export async function POST(req: NextRequest) {
    try {
        verifyToken(req);
        const body = await req.json();
        const { name, description, price, stock, category, userId } = body;
        const product = await db.product.create({
            data: {
                name,
                description,
                price,
                stock,
                category,
                userId,
                status: 'ACTIVE',
            }
        })
        return NextResponse.json({
            message: "Product created successfully.",
            productId: product.id,
        })
    } catch (err) {
        return NextResponse.json({ error: `Failed to create product: ${err}` }, { status: 500 })
    }
}