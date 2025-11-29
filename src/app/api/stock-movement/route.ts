import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";



export async function POST(request: Request) {
    const session = await auth();

    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized"}, { status: 401 });
    }

    const { stockItemId, changeType, quantity, notes } = await request.json();

    try {
        const stockItem = await db.stockItem.findUnique({
            where: {
                id: stockItemId
            }
        });

        if (!stockItem) {
            return NextResponse.json({ error: "Stock Item not found"}, { status: 404})
        };

        const currentStock = stockItem.stock ?? 0;

        const stockOperation = {
            PURCHASE: currentStock + quantity,
            ADJUSTMENT: currentStock +quantity,
            SALE: currentStock - quantity,
            WASTE: currentStock - quantity,
            RECONCILIATION: quantity,
        }

        const newStock = stockOperation[changeType as keyof typeof stockOperation]

        const [updatedStockItem, movement] = await db.$transaction([
            db.stockItem.update({
                where: {
                    id: stockItemId
                },
                data: { stock: newStock},
            }),
            db.stockMovement.create({
                data: {
                    stockItemId,
                    changeType,
                    quantity,
                    notes
                }
            })
        ]);

        return NextResponse.json({ stockItem: updatedStockItem, movement})
        

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

    const stockItemId = searchParams.get("stockItemId");

    if (!stockItemId) {
        return NextResponse.json({error: "Missing stockItemId"}, { status: 400});
    }

    try {
        const movements = await db.stockMovement.findMany({
            where: {stockItemId},
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