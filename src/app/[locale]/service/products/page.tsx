import MenuAndStock from "@/components/MenuAndStock";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { getTranslations } from "next-intl/server";

import { redirect } from "next/navigation";

export default async function ItemsPage() {
  const session = await auth();
  const t = await getTranslations("Common");

  if (!session?.user.serviceId) redirect("/login");

  const items = await db.item.findMany({
    where: {
      serviceId: session.user.serviceId,
    },
    include: {
      category: true,
    },
  });
  const serviceStockItems = await db.serviceStockItem.findMany({
    where: {
      serviceId: session.user.serviceId,
    },
    include: {
      stockItem: {
        include: {
          unit: true,
        },
      },
    },
  });

  return (
    <div className="products-list flex flex-col gap-4 w-full">
      <div className="list-header flex items-center justify-between w-full">
        <div className="list-title">
          <h2 className="text-2xl font-medium">
            {session.user.businessType === "SHOP"
              ? t("services")
              : session.user.businessType === "STORE"
                ? t("items")
                : t("menu")}{" "}
            & {t("stockProducts")}
          </h2>
          <p className="text-md font-extralight">
            Manage your{" "}
            {session.user.businessType === "SHOP"
              ? t("services")
              : session.user.businessType === "STORE"
                ? t("items")
                : t("menu")}{" "}
            {t("and")} {t("stock")} {t("inventory")}
          </p>
        </div>
      </div>
      <MenuAndStock
        businessType={session.user.businessType ?? ""}
        items={items}
        stockItems={serviceStockItems}
      />
    </div>
  );
}
