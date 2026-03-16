import {
  CatalogItemForm,
  //  ItemForm
} from "@/components/ItemForm";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getTranslations } from "next-intl/server";

type Params = Promise<{ id: string }>;

export default async function EditProductPage(props: { params: Params }) {
  const session = await auth();

  if (!session?.user) redirect("/login");
  if (!session.user.serviceId) redirect("/register/service");

  const { id } = await props.params;
  const t = await getTranslations("Common");

  const item = await db.item.findUnique({
    where: {
      id,
    },
    include: {
      category: true,
      unit: true,
      CatalogItems: {
        include: {
          serviceStockItem: {
            include: {
              stockItem: {
                include: {
                  unit: true,
                },
              },
            },
          },
        },
      },
    },
  });
  if (!item) return <div>{t("notFoundItem")}</div>;

  return (
    <div className="flex flex-col gap-2 items-center w-full">
      <h1 className="text-xl font-semibold">
        {t("editItem")}: {item.name}
      </h1>
      <CatalogItemForm
        serviceId={item.serviceId}
        item={{
          ...item,
          Category: item.category,
          Unit: item.unit
            ? {
                name: item.unit.name,
                id: item.unit.id,
                description: item.unit.description,
              }
            : null,
        }}
      />
    </div>
  );
}
