import { db } from "@/lib/db";
import { verifyToken } from "@/lib/verifyToken";
import { NextRequest, NextResponse } from "next/server";
type Params = Promise<{id: string}>
export async function PATCH(req: NextRequest, props:{ params: Params}) {
  try {
    verifyToken(req);
    
    const body = await req.json();
    const operation = body.operation;
    const quantity = body.quantity;

    const { id } = await props.params

    const product = await db.product.findUnique({ where: { id } });
    if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const newStock = operation === "decrement"
      ? (product.stock ?? 0)- quantity
      : product.stock + quantity;

    const updated = await db.product.update({
      where: { id },
      data: { stock: newStock },
    });

    return NextResponse.json({ message: "Stock updated.", newStock: updated.stock });
  } catch {
    return NextResponse.json({ error: "Stock update failed" }, { status: 500 });
  }
}


// import { db } from "@/lib/db";
// import { verifyToken } from "@/lib/verifyToken";
// import { NextRequest, NextResponse } from "next/server";

// export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
//   try {
//     verifyToken(req);
    
//     const body = await req.json();
//     const operation = body.operation;
//     const quantity = body.quantity;

//     const { id } = await params;
//     const { status } = await req.json()

//     if (!["ACTIVE", "DRAFT", "OUT_OF_STOCK"].includes(status)) {
//       return NextResponse.json(
//         {error: "Invalid status value"},
//         { status: 400 }
//       )
//     }

//     try {

//       const product = await db.product.update({ where: { id }, data: {
//         status
//       } });
//       return NextResponse.json({ error: "Not found" }, { status: 404 });
//     } catch (error) {
//       return NextResponse.json({
//         error: "Failed to update product status"
//       },
//     { status: 500 })
//     }

//     const newStock = operation === "decrement"
//       ? (product.stock ?? 0)- quantity
//       : product.stock + quantity;

//     const updated = await db.product.update({
//       where: { id: params.id },
//       data: { stock: newStock },
//     });

//     return NextResponse.json({ message: "Stock updated.", newStock: updated.stock });
//   } catch {
//     return NextResponse.json({ error: "Stock update failed" }, { status: 500 });
//   }
// }
