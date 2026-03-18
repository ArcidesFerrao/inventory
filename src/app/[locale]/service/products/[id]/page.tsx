import { DeleteButton } from "@/components/DeleteButton";
import { db } from "@/lib/db";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

type Params = Promise<{ id: string }>;

export default async function ItemPage(props: { params: Params }) {
  const session = await auth();

  if (!session?.user) redirect("/login");
  if (!session.user.serviceId) redirect("/register/service");

  const t = await getTranslations("Common");
  const { id } = await props.params;
  const item = await db.item.findUnique({
    where: {
      id,
    },
    include: {
      category: true,
      unit: true,
      CatalogItems: {
        include: {
          stockItem: {
            select: {
              name: true,
            },
          },
        },
      },
      priceHistories: {
        orderBy: {
          timestamp: "desc",
        },
        take: 1,
      },
    },
  });

  const recipeItems = item?.CatalogItems.filter((i) => i.quantity > 0) ?? [];

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex justify-between w-full">
        <div>
          <h2 className="text-2xl font-semibold">{item?.name}</h2>
          <p className="text-xs font-thin opacity-50">
            Id: {item?.id.slice(0, 5)}...
          </p>
        </div>
        <div className="flex  gap-2">
          <DeleteButton itemId={id} />
          <Link
            className="edit-button gap-2 px-2 py-2 flex items-center "
            href={`/service/products/${id}/edit`}
          >
            <span className="mdi--edit"></span>
            Editar
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 w-full">
        <div className="listing-stock-item p-4 rounded-lg flex flex-col gap-1">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            {t("status")}
          </p>
          <span
            className={`inline-flex items-center gap-1.5 text-sm font-medium ${
              item?.status === "ACTIVE"
                ? "text-emerald-500"
                : "text-muted-foreground"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                item?.status === "ACTIVE"
                  ? "bg-emerald-500"
                  : "bg-muted-foreground"
              }`}
            />
            {item?.status === "ACTIVE" ? t("active") : t("inactive")}
          </span>
        </div>

        <div className="listing-stock-item p-4 rounded-lg flex flex-col gap-1">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            {t("category")}
          </p>
          <p className="text-sm font-medium">
            {item?.category?.name ?? (
              <span className="text-muted-foreground">—</span>
            )}
          </p>
        </div>

        <div className="listing-stock-item p-4 rounded-lg flex flex-col gap-1">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            {t("type")}
          </p>
          <span className="inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full w-fit bg-primary/10 text-primary border border-primary/20">
            {item?.type === "SERVICE" ? t("service") : t("stock")}
          </span>
        </div>
      </div>

      {/* Price + stock info */}
      <div className="grid grid-cols-2 gap-3 w-full">
        <div className="listing-stock-item p-4 rounded-lg flex flex-col gap-1">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            {t("price")}
          </p>
          <p className="text-xl font-semibold">{item?.price?.toFixed(2)} MZN</p>
          <Link
            href={`/service/products/${id}/price-history`}
            className="text-xs text-primary hover:underline mt-1"
          >
            {t("viewPriceHistory")} ›
          </Link>
        </div>
      </div>
      <div className="listing-stock-item p-4 rounded-lg flex flex-col gap-1">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">
          {t("recipeItems")}
        </p>
        <p className="text-xl font-semibold">{recipeItems.length}</p>
        <p className="text-xs text-muted-foreground">{t("ingredients")}</p>
      </div>
      {/* Recipe items table */}
      {item?.type === "SERVICE" && recipeItems.length > 0 && (
        <div className="listing-stock-item p-4 rounded-lg w-full">
          <h3 className="text-xs uppercase tracking-wider text-muted-foreground mb-3">
            {t("recipeItems")}
          </h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-wider text-muted-foreground">
                <th className="text-left pb-2 font-normal">
                  {t("ingredient")}
                </th>
                <th className="text-right pb-2 font-normal">{t("quantity")}</th>
              </tr>
            </thead>
            <tbody>
              {recipeItems.map((i) => (
                <tr key={i.id} className="border-t border-border/30">
                  <td className="py-2">{i.stockItem?.name}</td>
                  <td className="py-2 text-right font-medium text-primary">
                    {i.quantity}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Description + dates */}
      {item?.description && (
        <div className="flex flex-col gap-2 flex-1">
          <h3 className="text-xs uppercase tracking-wider text-muted-foreground">
            {t("description")}
          </h3>
          <div className="listing-stock-item p-3 rounded-lg text-sm text-muted-foreground">
            {item.description}
          </div>
        </div>
      )}
      <div className="flex flex-col self-end gap-2 w-fit">
        <p className="text-xs font-thin">
          {t("createdAt")}: {item?.createdAt.toLocaleDateString()}
        </p>
        <p className="text-xs font-thin">
          {t("updatedAt")}: {item?.updatedAt.toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
