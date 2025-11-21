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
        if (item.product) {

            if (item.product?.MenuItems || item.product.MenuItems.length > 0) {
                for (const recipe of item.product.MenuItems) {
                    cogsForItem += recipe.quantity * (recipe.stock.price || 0);
                }
            } else {
                cogsForItem += item.product.price || 0;
            }
        } else {
            console.warn(`SaleItem ${item.id} has no menu items`)
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
        if (!item.productId) return

        const product = await db.product.findUnique({
            where: { id: item.productId }
        })
        return {
            ...product,
            quantity: item._sum.quantity
        }
    }))
    

    return { service: service?.businessName, productCount, salesCount, balance , earnings, profit, inventoryValue, purchases, grossMargin, averageSaleValue, inventoryPercentage, topProducts };
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
            name: true,
        },
    });
    

    if (!supplier?.id) return null
    const supplierId = supplier.id;

    const productCount = await db.supplierProduct.count({
        where: { supplierId }
    })

    const customerCount = await db.supplierCustomer.count({
        where: { supplierId }
    })

    const orderCount = await db.supplierOrder.count({
        where: { supplierId }
    })

    const totalRevenue = await db.order.aggregate({
        where: {
            supplierOrders: {
                some: {
                    supplierId 
                }
            }
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

    const mostOrderedProducts = await db.orderItem.groupBy({
        by: ['supplierProductId'],
        where: {
            supplierOrder: {
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

    const topProducts = await Promise.all(mostOrderedProducts.map(async (item) => {
        const product = await db.supplierProduct.findUnique({
            where: {
                id: item.supplierProductId!
            },
            select: {
                id: true,
                price: true,
                name: true,
            }
        });

        return {
            ...product,
            quantity: item._sum.orderedQty
        }
    }))

    return { 
        supplier: supplier.name,
        productCount, 
        customerCount, 
        orderCount, 
        revenue: earnings, 
        profit, 
        averageOrderValue, 
        grossMargin, 
        topProducts 
    };
}


export async function getAdminStats() {
    const session = await auth()

    if (!session?.user.isAdmin) return null 

    const [
        totalUsers,
        totalOrders,
        totalProducts,
        totalServices,
        totalSuppliers,
        totalSales
    ] = await Promise.all([
        db.user.count(),
        db.order.count(),
        db.product.count(),
        db.service.count(),
        db.supplier.count(),
        db.sale.count()
    ])

    const topSuppliers = await db.supplierOrder.groupBy({
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
                select: { id: true, name: true}
            });
            return {
                id: supplier?.id,
                name: supplier?.name || "Unknown",
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
            totalProducts,
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
    const [ordersData, delivered, confirmed, cancelled,         totalOrders] = await Promise.all([
        db.order.findMany({
            include: {
                Service: true,
                supplierCustomer: {
                    include: {
                        supplier: true
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
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

export async function getAdminProductsStats() {
    
    const [productsData, activeProducts, inactiveProducts, supplierProductsData ] = await Promise.all([
        db.product.findMany({
            include: {
                Unit: true,
                Category: true,
            }
        }),
        db.product.count({
            where: { status: "ACTIVE"}
        }),
        db.product.count({ where: {
            status: "DRAFT"
        }}),
        db.supplierProduct.findMany({
            include: {
                Unit: true,
                Category: true
            }
        })
    ])
    
    
   return {products: {
        productsData,
        activeProducts,
        inactiveProducts,
        supplierProductsData
    }}
}