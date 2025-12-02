import { auth} from "@/lib/auth";
import { db } from "@/lib/db";

export async function getServiceDashBoardStats() {
    const session = await auth()

    if (!session?.user) return null;

    const service = await db.service.findUnique({
        where: {
            userId: session.user.id
        }
    })

    const totalExpenses = await db.expense.aggregate({
        where: { serviceId: service?.id },
        _sum: {
            amount: true
        }
    })

    const itemCount = await db.item.count({
        where: {serviceId: service?.id, type: "SERVICE"}
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
            item: {
                include: {
                CatalogItems: {
                        include:{
                            stockItem: true
                        }
                    }
                }
            }
        }
    })

    let totalCogs = 0
    // calculate cogs
    for (const saleItem of sales) {
        let cogsForItem = 0
        if (saleItem.item) {

            if (saleItem.item?.CatalogItems || saleItem.item.CatalogItems.length > 0) {
                for (const recipe of saleItem.item.CatalogItems) {
                    cogsForItem += recipe.quantity * (recipe.stockItem?.price || 0);
                }
            } else {
                cogsForItem += saleItem.item.price || 0;
            }
        } else {
            console.warn(`SaleItem ${saleItem.id} has no menu items`)
        }
        cogsForItem *= saleItem.quantity;
        totalCogs += cogsForItem;
    }
    const earnings = totalEarnings._sum.total || 0;
    const purchases = totalPurchases._sum.total || 0;
    const expenses = totalExpenses._sum.amount || 0
        // Core financial metrics
    const profit = earnings - totalCogs;
    const netProfit = profit - expenses;
    const balance = earnings - purchases - expenses;
    const inventoryValue = purchases - totalCogs;
    
    // extra metrics
    const averageSaleValue = salesCount > 0 ? earnings / salesCount : 0;
    const grossMargin = earnings > 0 ? (profit / earnings) * 100 : 0;
    const inventoryPercentage = purchases > 0 ? (inventoryValue / purchases) * 100 : 0;
    
    const mostPaidItems = await db.saleItem.groupBy({
        by: ['itemId'],
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

    const topItems = await Promise.all(mostPaidItems.map(async (i) => {
        if (!i.itemId) return

        const item = await db.item.findUnique({
            where: { id: i.itemId }
        })
        return {
            ...item,
            quantity: i._sum.quantity
        }
    }))
    
    

    return { service: service?.businessName, itemCount, salesCount, balance , earnings, profit, netProfit, expenses, inventoryValue, purchases, grossMargin, averageSaleValue, inventoryPercentage, topItems };
}


export async function getSupplierDashBoardStats() {
    const session = await auth()

    if (!session?.user) return null 
    
    const supplier = await db.supplier.findUnique({
        where: {
            userId: session.user.id,
        },
        select: {
            id: true,
            businessName: true,
        },
    });
    

    if (!supplier?.id) return null
    const supplierId = supplier.id;

    const stockItemCount = await db.stockItem.count({
        where: { supplierId }
    })

    const customerCount = await db.supplierCustomer.count({
        where: { supplierId }
    })

    const orderCount = await db.order.count({
        where: { supplierId }
    })

    const totalRevenue = await db.order.aggregate({
        where: {
                supplierId 
        },
        _sum: {
            total: true,
        }
    })

    const revenue = totalRevenue._sum.total || 0;

    const earnings = revenue;

    const totalCogs = 0;

    const profit = earnings - totalCogs;
    const averageOrderValue = orderCount > 0 ? earnings / orderCount : 0;
    const grossMargin = earnings > 0 ? (profit / earnings) * 100 : 0;

    const mostOrderedItems = await db.orderItem.groupBy({
        by: ['stockItemId'],
        where: {
            order: {
                supplierId
            }
        },
        _sum: {
            orderedQty: true
        },
        orderBy: {
            _sum: {
                orderedQty: "desc"
            }
        },
        take: 3
    })

    const topItems = await Promise.all(mostOrderedItems.map(async (item) => {
        const stockItem = await db.stockItem.findUnique({
            where: {
                id: item.stockItemId!
            },
            select: {
                id: true,
                price: true,
                name: true,
            }
        });

        return {
            ...stockItem,
            quantity: item._sum?.orderedQty ?? 0
        }
    }))

    return { 
        supplier: supplier.businessName,
        stockItemCount, 
        customerCount, 
        orderCount, 
        revenue: earnings, 
        profit, 
        averageOrderValue, 
        grossMargin, 
        topItems 
    };
}


export async function getAdminStats() {
    const session = await auth()

    if (!session?.user.isAdmin) return null 

    const [
        totalUsers,
        totalOrders,
        totalItems,
        totalServices,
        totalSuppliers,
        totalSales
    ] = await Promise.all([
        db.user.count(),
        db.order.count(),
        db.item.count(),
        db.service.count(),
        db.supplier.count(),
        db.sale.count()
    ])

    const topSuppliers = await db.order.groupBy({
        by: ["supplierId"],
        _count: { id: true},
        orderBy: { _count: {
            id: "desc"
        }},
        take: 5
    })

    const supplierDetails = await Promise.all(
        topSuppliers.map(async (s) => {
            const supplier = await db.supplier.findUnique({
                where: { id: s.supplierId},
                select: { id: true, businessName: true}
            });
            return {
                id: supplier?.id,
                name: supplier?.businessName || "Unknown",
                totalOrders: s._count.id
            }
        })
    )

    const topServices = await db.order.groupBy({
        by: ["serviceId"],
        _count: { id: true},
        orderBy: { _count: {
            id: "desc"
        }},
        take: 5
    })

    const serviceDetails = await Promise.all(
        topServices.map(async (s) => {
            const service = await db.service.findUnique({
                where: { id: s.serviceId ?? undefined},
                select: { id: true, businessName: true}
            });
            return {
                id: service?.id,
                name: service?.businessName || "Unknown",
                totalOrders: s._count.id
            }
        })
    )
    
    return {
        totals: {
            totalUsers,
            totalOrders,
            totalItems,
            totalServices,
            totalSuppliers,
            totalSales
        },
        topSuppliers: supplierDetails,
        topServices: serviceDetails,
    }
}


export async function getAdminUsersStats() {


    const [usersData, activeUsers, suspendedUsers, pendingUsers] = await Promise.all([
        db.user.findMany({
            where: {
                role: {
                    not: "ADMIN"
                }
            },
            orderBy: {
                createdAt: "desc"
            },
            take: 5
        }),
        db.user.count({where: {profileStatus: "ACTIVE"}}),
        db.user.count({where: {profileStatus: "SUSPENDED"}}),
        db.user.count({where: {profileStatus: "PENDING"}}),
    ])

    return {users: {
            usersData,
            totalUsers: usersData.length,
            activeUsers,
            suspendedUsers,
            pendingUsers
        },}
}
    export async function getAdminOrdersStats() {
    const [ordersData, delivered, confirmed, cancelled, totalOrders] = await Promise.all([
        db.order.findMany({
            include: {
                Service: true,
                supplier: true
            },
            orderBy: {
                timestamp: "desc"
            },
            take: 20
        }),
        db.order.count({where: {
            status: "DELIVERED"
        }}),
        db.order.count({where: {
            status: "CONFIRMED"
        }}),
        db.order.count({where: {
            status: "CANCELLED"
        }}),
                db.order.count(),
    ])

    return {orders: {
            ordersData,
            delivered,
            confirmed,
            cancelled,
            totalOrders
        },}
}

export async function getAdminItemsStats() {
    
    const [itemsData, activeItems, inactiveItems,activeStockItems, inactiveStockItems, stockItemsData ] = await Promise.all([
        db.item.findMany({
            include: {
                unit: true,
                category: true,
                service: {
                    select: {
                        businessName: true,
                    }
                }
            }
        }),
        db.item.count({
            where: { status: "ACTIVE"}
        }),
        db.item.count({ where: {
            status: "INACTIVE"
        }}),
        db.stockItem.count({
            where: { status: "ACTIVE"}
        }),
        db.stockItem.count({ where: {
            status: "INACTIVE"
        }}),
        db.stockItem.findMany({
            include: {
                unit: true,
                category: true,
                supplier: {
                    select: {
                        businessName: true
                    }
                }
            }
        })
    ])
    
    
   return {items: {
        itemsData,
        activeItems,
        inactiveItems,
        activeStockItems, 
        inactiveStockItems,
        stockItemsData
    }}
}

export async function getAdminSalesStats() {
    const [salesData, totalSales] = await Promise.all([
        db.sale.findMany({
            include: {
                Service: true,
                Supplier: true,
                SaleItem: true
            },
            orderBy: {
                timestamp: "desc"
            },
            take: 20
        }),
        
        db.sale.count({}),
    ])

    return {sales: {
            salesData, totalSales
        },}
}
