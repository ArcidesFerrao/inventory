import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { getTranslations } from "next-intl/server";
import { NextResponse } from "next/server";



export async function POST(request: Request) {
    const session = await auth();

    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized"}, { status: 401 });
    }

    const { stockItemId, changeType, quantity, notes } = await request.json();
    
    const rt = await getTranslations("Responses");


    try {
        const stockItem = await db.stockItem.findUnique({
            where: {
                id: stockItemId
            }
        });

        if (!stockItem) {
            return NextResponse.json({ error: rt("notFoundItem")}, { status: 404})
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
        console.error(rt("recordMovementError"),error);
        return NextResponse.json(
            {error: rt("recordMovementFail")}, 
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
    const rt = await getTranslations("Responses");


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
        console.error(rt("fetchMovementError"), error )
        return NextResponse.json(
            {error: rt("recordMovementfail")},
            { status: 500 }
        )
    }
}