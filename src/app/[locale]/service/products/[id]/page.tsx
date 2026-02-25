import { DeleteButton } from "@/components/DeleteButton";
import { db } from "@/lib/db";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

type Params = Promise<{ id: string }>;

export default async function ItemPage(props: { params: Params }) {
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
    },
  });
  return (
    <div className="flex flex-col gap-5 items-start w-full">
      <div className="flex justify-between w-full">
        <div>
          <h2 className="text-2xl font-semibold">{item?.name}</h2>
          <p className="text-xs font-thin">Id: {item?.id.slice(0, 5)}...</p>
        </div>
        <div className="flex gap-2 items-center">
          <DeleteButton itemId={id} />
          <Link
            className="edit-button px-2 py-2 flex items-center "
            href={`/service/products/${id}/edit`}
          >
            <span className="mdi--edit"></span>
          </Link>
        </div>
      </div>
      <div className="item-info flex  justify-between w-full  my-5">
        <div className="flex flex-col gap-5">
          {item?.type === "STOCK" && (
            <div className="flex gap-5 justify-between">
              <div className="flex flex-col gap-2">
                <p>{t("unitQuantity")}</p>
                <h2 className="font-bold text-xl">{item?.unitQty}</h2>
              </div>
              <div className="flex flex-col gap-2">
                <p>{t("unit")}</p>
                <h2 className="font-bold text-xl">{item?.unit?.name}</h2>
              </div>
              <div className="flex flex-col gap-2">
                <p>{t("stock")}</p>
                <h2 className="font-bold text-xl">{item?.stock}</h2>
              </div>
            </div>
          )}

          <div className="flex gap-5 justify-between">
            {item?.category && (
              <div className="flex flex-col gap-2">
                <p>{t("category")}</p>
                <h2 className="font-bold text-xl">{item.category.name}</h2>
              </div>
            )}

            <div className="flex flex-col gap-2">
              <p>{t("status")}</p>
              <h2
                className={`font-bold text-xl ${
                  item?.status === "ACTIVE" && "text-green-400"
                }`}
              >
                {item?.status}
              </h2>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 w-fit">
          <div className="flex flex-col gap-2">
            <p>{t("type")}</p>
            <h4 className="font-bold text-xl">{item?.type}</h4>
          </div>

          <div className="flex flex-col gap-2">
            <p>{t("price")}</p>
            <h4 className="font-bold text-xl">{item?.price?.toFixed(2)} MZN</h4>
          </div>
        </div>
      </div>
      <div className="item-description flex justify-between gap-4 w-full">
        <div className="flex flex-col gap-2">
          <h2 className="font-semibold">{t("description")}</h2>
          <span className="product-detail-desc p-2 text-md font-light">
            <p>{item?.description}</p>
          </span>
          {item?.type === "SERVICE" && (
            <ul className="flex flex-col recipe-items-list p-2">
              <h2 className="font-semibold underline">{t("recipeItems")}</h2>
              {item.CatalogItems.filter((i) => i.quantity > 0).map((i) => (
                <li className="flex justify-between py-1" key={i.id}>
                  <p className="font-light">{i.stockItem?.name}</p>
                  <p>{i.quantity}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex flex-col self-end gap-2 w-fit">
          <p className="text-xs font-thin">
            {t("createdAt")}: {item?.createdAt.toLocaleDateString()}
          </p>
          <p className="text-xs font-thin">
            {t("updatedAt")}: {item?.updatedAt.toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}
