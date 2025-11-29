import OrdersAndSales from "@/components/OrdersAndSales";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { OrderWithStockItems } from "@/types/types";
import { redirect } from "next/navigation";

export default async function OrdersPage() {
  const session = await auth();

  if (!session?.user) redirect("/login");
  if (!session?.user.supplierId) redirect("/register/supplier");

  const orders = await db.order.findMany({
    where: { supplierId: session.user.supplierId },
    include: {
      orderItems: true,
      delivery: true,
      Service: true,
    },
    orderBy: {
      timestamp: "desc",
    },
  });

  const supplierSales = await db.sale.findMany({
    where: { supplierId: session.user.supplierId },
    include: {
      SaleItem: {
        include: {
          stockItem: true,
        },
      },
    },
    orderBy: {
      timestamp: "desc",
    },
  });

  return (
    <div className="products-list flex flex-col gap-5 w-full">
      <div className="list-header flex items-center justify-between w-full">
        <div className="flex flex-col">
          <h2 className="text-2xl font-medium">Recent Orders and Sales</h2>
          <p className="text-sm font-extralight">
            Manage customer orders, deliveries and view sales
          </p>
        </div>
      </div>
      <OrdersAndSales
        sales={supplierSales}
        orders={orders as OrderWithStockItems[]}
      />
    </div>
  );
}
