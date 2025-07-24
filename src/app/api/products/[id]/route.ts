import { db } from "@/lib/db";
import { verifyToken } from "@/lib/verifyToken";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const product = await db.product.findUnique({ where: { id: params.id } });
  return product
    ? NextResponse.json(product)
    : NextResponse.json({ error: "Not found" }, { status: 404 });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    verifyToken(req);
    const body = await req.json();
    await db.product.update({
      where: { id: params.id },
      data: body,
    });
    return NextResponse.json({ message: "Product updated successfully." });
  } catch {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    verifyToken(req);
    await db.product.delete({ where: { id: params.id } });
    return NextResponse.json({ message: "Product deleted successfully." });
  } catch {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
