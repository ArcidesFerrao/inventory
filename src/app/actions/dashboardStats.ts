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

    const totalPurchases = await db.purchase.aggregate({
        where: {userId},
        _sum: {
            total: true
        }
    })

    const sales = await db.saleItem.findMany({
        where: {
            sale: {
                userId
            }
        },
        include: {
            product: {
                include: {
                    MenuItems: {
                        include:{
                            stock: true,
                        }
                    }
                }
            }
        }
    })

    let totalCogs = 0

    for (const item of sales) {
        let cogsForItem = 0
        for (const recipe of item.product.MenuItems) {
            cogsForItem += recipe.quantity * (recipe.stock.price || 0);
        }
        cogsForItem *= item.quantity;
        totalCogs += cogsForItem;
    }

    const earnings = totalEarnings._sum.total || 0;
    const purchases = totalPurchases._sum.total || 0;
    const profit = (totalEarnings._sum.total || 0) - totalCogs;
    const balance = earnings - purchases;
    
    return { productCount, salesCount, balance , earnings, profit};
}