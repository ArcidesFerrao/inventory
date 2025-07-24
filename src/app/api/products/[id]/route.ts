import { db } from "@/lib/db";
import { verifyToken } from "@/lib/verifyToken";
import { NextRequest, NextResponse } from "next/server";

type Params = Promise<{id: string}>

export async function GET(req: NextRequest, props:{ params: Params}) {
  try {
    verifyToken(req);
    const {id} = await props.params;
    const product = await db.product.findUnique({ where: { id } });
    if (!product) NextResponse.json({ error: "Product not found" }, { status: 404})
      return NextResponse.json(product)

  } catch (error) {
    return NextResponse.json(
      {error: (error as Error).message}, { status: 401}
    );
  }
}

export async function PUT(req: NextRequest,  props:{ params: Params}) {
  try {
    verifyToken(req);

    const { id } = await props.params;
    const body = await req.json();

    await db.product.update({
      where: { id },
      data: body,
    });
    return NextResponse.json({ message: "Product updated successfully." });
  } catch (error) {
    return NextResponse.json({ error: `Update failed: ${error}` }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest,  props:{ params: Params}) {
  try {
    verifyToken(req);
    const { id } = await props.params;

    await db.product.delete({ where: { id} });
    return NextResponse.json({ message: "Product deleted successfully." });
  } catch {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
