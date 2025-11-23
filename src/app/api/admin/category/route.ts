import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";


export async function POST(request: Request) {
    const session = await auth();

    if (!session?.user.isAdmin) {
        return NextResponse.json({error: "Unauthorized"}, { status: 401})
    }

    const { name, description } = await request.json();

      const category = await db.category.create({
        data :{
            name,
            description,
            type: "SUPPLIER",
        }
      });
    
      return NextResponse.json(category);
}