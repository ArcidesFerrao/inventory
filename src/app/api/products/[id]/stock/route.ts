import { db } from "@/lib/db";
import { verifyToken } from "@/lib/verifyToken";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    verifyToken(req);
    
    const body = await req.json();
    const operation = body.operation;
    const quantity = body.quantity;

    const { id } = params
    const product = await db.product.findUnique({ where: { id } });
    if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const newStock = operation === "decrement"
      ? (product.stock ?? 0)- quantity
      : product.stock + quantity;

    const updated = await db.product.update({
      where: { id: params.id },
      data: { stock: newStock },
    });

    return NextResponse.json({ message: "Stock updated.", newStock: updated.stock });
  } catch {
    return NextResponse.json({ error: "Stock update failed" }, { status: 500 });
  }
}
