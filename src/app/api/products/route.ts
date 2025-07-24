import { db } from "@/lib/db";
import { verifyToken } from "@/lib/verifyToken";
import { NextRequest, NextResponse } from "next/server";



export async function GET(req: NextRequest) {
    console.log("✅ GET /products triggered");
    verifyToken(req)
    try {
        const {searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "20");
        const category = searchParams.get("category");

        const where = category ? { category } : {};

        const [data, total] = await Promise.all([
            db.product.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
            }),
            db.product.count({where})
        ]);

        return NextResponse.json({
            data,
            pagination: { page, limit, total },
        });
    } catch (err) {
        return NextResponse.json({ error: `Error fetching products: ${err}`}, { status: 500})
    }
}

export async function POST(req: NextRequest) {
    try {
        verifyToken(req);
        const body = await req.json();
        const product = await db.product.create({
            data: {
                name: body.name,
                description: body.description,
                price: body.price,
                stock: body.stock,
                category: body.category,
                userId: "some-user"
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