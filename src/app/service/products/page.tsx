import MenuAndStock from "@/components/MenuAndStock";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

import { redirect } from "next/navigation";

export default async function ItemsPage() {
  const session = await auth();

  if (!session?.user.serviceId) redirect("/login");

  const items = await db.item.findMany({
    where: {
      serviceId: session.user.serviceId,
    },
    include: {
      category: true,
    },
  });

  return (
    <div className="products-list flex flex-col gap-4 w-full">
      <div className="list-header flex items-center justify-between w-full">
        <div className="list-title">
          <h2 className="text-2xl font-medium">Menu & Stock Products</h2>
          <p className="text-md font-extralight">
            Manage your menu items and stock inventory
          </p>
        </div>
      </div>
      <MenuAndStock items={items} />
    </div>
  );
}
