import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";

export async function getServiceDashBoardStats() {
    const session = await getServerSession(authOptions);

    if (!session?.user) return null;

    const userId = session.user.id

    const productCount = await db.product.count({
        where: {userId, type: "STOCK"}
    })

    const salesCount = await db.sale.count({
        where: { userId }
    })

    const totalEarnings = await db.sale.aggregate({
        where: { userId },
        _sum: { total: true}
    })

    const totalBalance = await db.purchase.aggregate({
        where: {userId},
        _sum: {
            total: true
        }
    })

    return { productCount, salesCount, totalBalance: totalBalance._sum.total || 0 , totalEarnings: totalEarnings._sum.total || 0}
}