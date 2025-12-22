import { StockItemDeleteButton } from "@/components/DeleteButton";
import StatusToggle from "@/components/StatusToggle";
import StockHistory from "@/components/StockHistory";
import StockManagementButton from "@/components/StockManagementButton";
import { db } from "@/lib/db";
import Link from "next/link";
type Params = Promise<{ id: string }>;

export default async function ProductPage(props: { params: Params }) {
  const { id } = await props.params;
  const item = await db.stockItem.findUnique({
    where: {
      id,
    },
    include: {
      unit: true,
      category: true,
    },
  });
  return (
    <div className="flex flex-col gap-5 items-start w-full">
      <div className="stock-item-header flex justify-between w-full">
        <div className="item-header-title flex gap-5 items-center">
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-semibold">{item?.name}</h2>
            <p className="text-xs font-thin">Id: {item?.id}</p>
          </div>
          <StatusToggle itemId={id} initialStatus={item?.status ?? "ACTIVE"} />
        </div>
        <div className="flex gap-2 items-center">
          <StockItemDeleteButton stockItemId={id} />
          <Link
            className="edit-button px-2 py-2 flex items-center "
            href={`/supply/products/${id}/edit`}
          >
            <span className="mdi--edit"></span>
          </Link>
        </div>
      </div>
      <div className="stock-item-info flex justify-between w-full">
        <div className="flex flex-col gap-4">
          <div className="flex gap-5">
            <div className="flex flex-col gap-2">
              <p>Quantity</p>
              <h2 className="font-bold text-xl">{item?.unitQty}</h2>
            </div>
            <div className="flex flex-col gap-2">
              <p>Unit</p>
              <h2 className="font-bold text-xl">{item?.unit?.name}</h2>
            </div>
            <div className="flex flex-col gap-2">
              <p>Stock</p>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-xl">{item?.stock}</h2>
                <StockManagementButton
                  stockItemId={id}
                  currentStock={item?.stock ?? 0}
                />
              </div>
            </div>
          </div>
          {item?.category && (
            <div className="flex flex-col gap-2">
              <p>Category</p>
              <h2 className="font-bold text-xl">{item?.category?.name}</h2>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-2">
            <p>Cost</p>
            <h2 className="font-bold text-xl">{item?.cost?.toFixed(2)} MZN</h2>
          </div>
          <div className="flex flex-col gap-2">
            <p>Price</p>
            <h2 className="font-bold text-xl">{item?.price?.toFixed(2)} MZN</h2>
          </div>
        </div>
      </div>
      <div className="stock-item-desc flex justify-between gap-4 w-full">
        <div className="flex flex-col gap-2">
          <h2 className="font-semibold">Description </h2>
          <span className="product-detail-desc p-2 text-md font-light">
            <p>{item?.description}</p>
          </span>
        </div>

        <div className="flex flex-col gap-2 justify-end">
          <p className="text-xs font-thin">
            Created At: {item?.createdAt.toLocaleDateString()}
          </p>
          <p className="text-xs font-thin">
            Updated At: {item?.updatedAt.toLocaleDateString()}
          </p>
        </div>
      </div>
      <StockHistory stockItemId={id} />
    </div>
  );
}
