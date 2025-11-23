import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { NextResponse } from "next/server"



export async function PATCH(request: Request, { params}: {params: Promise<{ id: string}>}) {
    const session = await auth() 

    if (!session?.user) {
        return NextResponse.json({error: "Unauthorized"}, { status: 401})
    }

    const { id } = await params
    const { status  } = await request.json();

    try {
        const product = await db.supplierProduct.update({
            where: { id },
            data: { status },
        })

        return NextResponse.json(product);

    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: "Failed to update product status"},
            {status: 500 }
        )
    }
}