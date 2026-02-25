import { db } from "@/lib/db";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

type Params = Promise<{ id: string; locale: string }>;

export default async function SalePage(props: { params: Params }) {
  const { id } = await props.params;
  const { locale } = await props.params;
  const t = await getTranslations("Common");

  const sale = await db.sale.findUnique({
    where: {
      id,
    },
    include: {
      SaleItem: {
        include: {
          stockItem: true,
          item: true,
        },
      },
      Service: true,
      Supplier: true,
    },
  });

  return (
    <div className=" bg-gray-950 p-4 rounded-md flex flex-col gap-5 items-start w-full">
      <div className="order-header flex justify-between w-full">
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold">
            {t("sale")} #{sale?.id.slice(0, 5)}...
          </h2>
          <p className="text-xs font-extralight">
            {t("created")} {sale?.timestamp.toDateString()}
          </p>
        </div>
        <Link href={`/${locale}/admin/sales`}>
          <span className="ep--back"></span>
        </Link>
      </div>
      <div className="order-details flex justify-between gap-4 w-full p-4">
        <div className="info-details flex justify-between w-full gap-4">
          <div className="flex gap-2">
            <span className="p-1">
              <span className="formkit--date"></span>
            </span>
            <div>
              <p className="text-md font-extralight">{t("timestamp")}</p>
              <h4 className="text-md py-1 whitespace-nowrap font-semibold">
                {sale?.timestamp.toDateString()}
              </h4>
            </div>
          </div>
          <div className="flex gap-2">
            <span className="p-1">
              <span className="fluent-mdl2--table-total-row"></span>
            </span>
            <div>
              <p className="text-md font-extralight">{t("totalAmount")}</p>
              <h4 className="text-md py-1 whitespace-nowrap font-semibold">
                MZN {sale?.total.toFixed(2)}
              </h4>
            </div>
          </div>
        </div>
      </div>
      <div className="order-items flex flex-col gap-2 w-full">
        <h2 className="text-xl font-semibold">
          {t("soldItemsBy")} {sale?.Service?.businessName}
        </h2>

        <table>
          <thead>
            <tr>
              <th>{t("items")}</th>
              <th>{t("sold")}</th>
              <th>{t("price")} (MZN)</th>
              <th>{t("total")} (MZN)</th>
            </tr>
          </thead>
          <tbody>
            {sale?.SaleItem.map((i) => (
              <tr key={i.id}>
                <td>{i.stockItem?.name ?? i.item?.name ?? ""}</td>
                <td>{i.quantity}</td>

                <td>{i.price.toFixed(2)}</td>
                <td>{(i.price * i.quantity).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
