import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";

export async function getServiceDashBoardStats() {
    const session = await getServerSession(authOptions);

    if (!session?.user) return null;

    const service = await db.service.findUnique({
        where: {
            userId: session.user.id
        }
    })

    const productCount = await db.product.count({
        where: {serviceId: service?.id, type: "STOCK"}
    })

    const salesCount = await db.sale.count({
        where: { serviceId: service?.id }
    })

    const totalEarnings = await db.sale.aggregate({
        where: { serviceId: service?.id },
        _sum: { total: true}
    })

    const totalPurchases = await db.purchase.aggregate({
        where: {serviceId: service?.id},
        _sum: {
            total: true
        }
    })

    const sales = await db.saleItem.findMany({
        where: {
            sale: {
                serviceId: service?.id
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
    // calculate cogs
    for (const item of sales) {
        let cogsForItem = 0

        if (!item.product.MenuItems || item.product.MenuItems.length === 0) {
            for (const recipe of item.product.MenuItems) {
                cogsForItem += recipe.quantity * (recipe.stock.price || 0);
            }
        } else {
            cogsForItem += item.product.price || 0;
        }
        cogsForItem *= item.quantity;
        totalCogs += cogsForItem;
    }

    const earnings = totalEarnings._sum.total || 0;
    const purchases = totalPurchases._sum.total || 0;
    
    // Core financial metrics
    const profit = earnings - totalCogs;
    const balance = earnings - purchases;
    const inventoryValue = purchases - totalCogs;
    
    // extra metrics
    const averageSaleValue = salesCount > 0 ? earnings / salesCount : 0;
    const grossMargin = earnings > 0 ? (profit / earnings) * 100 : 0;
    const inventoryPercentage = purchases > 0 ? (inventoryValue / purchases) * 100 : 0;
    
    const mostBoughtProducts = await db.saleItem.groupBy({
        by: ['productId'],
        where: {
            sale: { serviceId: service?.id }
        },
        _sum: {
            quantity: true
        },
        orderBy: {
            _sum: {
                quantity: 'desc'
            }
        },
        take: 3
    })

    const topProducts = await Promise.all(mostBoughtProducts.map(async (item) => {
        const product = await db.product.findUnique({
            where: { id: item.productId }
        })
        return {
            ...product,
            quantity: item._sum.quantity
        }
    }))
    

    return { productCount, salesCount, balance , earnings, profit, inventoryValue, purchases, grossMargin, averageSaleValue, inventoryPercentage, topProducts };
}