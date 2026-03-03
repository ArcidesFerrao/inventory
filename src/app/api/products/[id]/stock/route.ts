import { db } from "@/lib/db";
import { verifyToken } from "@/lib/verifyToken";
import { getTranslations } from "next-intl/server";
import { NextRequest, NextResponse } from "next/server";


type Params = Promise<{id: string}>


export async function PATCH(req: NextRequest, props:{ params: Params}) {
  const rt = await getTranslations("Responses");
  
  try {
    verifyToken(req);
    
    const body = await req.json();
    const operation = body.operation;
    const quantity = body.quantity;

    const { id } = await props.params

    const item = await db.item.findUnique({ where: { id } });
    if (!item) return NextResponse.json({ error: rt("notFoundItem") }, { status: 404 });

    const newStock = operation === "decrement"
      ? (item.stock ?? 0)- quantity
      : item.stock + quantity;

    const updated = await db.item.update({
      where: { id },
      data: { stock: newStock },
    });

    return NextResponse.json({ message: rt("updateStockSuccessful"), newStock: updated.stock });
  } catch {
    return NextResponse.json({ error: rt("updateStockFailed") }, { status: 500 });
  }
}
