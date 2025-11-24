import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";



export async function POST(request: Request) {
    const session = await auth();

    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized"}, { status: 401 });
    }

    const { supplierProductId, changeType, quantity, notes } = await request.json();

    try {
        const product = await db.supplierProduct.findUnique({
            where: {
                id: supplierProductId
            }
        });

        if (!product) {
            return NextResponse.json({ error: "Product not found"}, { status: 404})
        };

        const currentStock = product.stock ?? 0;

        const stockOperation = {
            PURCHASE: currentStock + quantity,
            ADJUSTMENT: currentStock +quantity,
            SALE: currentStock - quantity,
            WASTE: currentStock - quantity,
            RECONCILIATION: quantity,
        }

        const newStock = stockOperation[changeType as keyof typeof stockOperation]

        const [updatedProduct, movement] = await db.$transaction([
            db.supplierProduct.update({
                where: {
                    id: supplierProductId
                },
                data: { stock: newStock},
            }),
            db.stockMovement.create({
                data: {
                    supplierProductId,
                    changeType,
                    quantity,
                    notes
                }
            })
        ]);

        return NextResponse.json({ product: updatedProduct, movement})
        

    } catch (error) {
        console.error("Error recording stock movement",error);
        return NextResponse.json(
            {error: "Failed to record stock movement"}, 
            { status: 500 })
    }
}

export async function GET(request: Request) {
    const session = await auth();

    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized"}, { status: 401 });
    }

    const { searchParams } = new URL(request.url);

    const supplierProductId = searchParams.get("supplierProductId");

    if (!supplierProductId) {
        return NextResponse.json({error: "Missing productId"}, { status: 400});
    }

    try {
        const movements = await db.stockMovement.findMany({
            where: {supplierProductId},
            orderBy: { timestamp: "desc"},
            take: 50,
        })

        return NextResponse.json(movements)
    } catch (error) {
        console.error("Error fetching stock movements:", error )
        return NextResponse.json(
            {error: "Failed fetching stock movements"},
            { status: 500 }
        )
    }
}