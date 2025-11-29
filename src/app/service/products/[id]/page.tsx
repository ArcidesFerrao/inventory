import { DeleteButton } from "@/components/DeleteButton";
import { db } from "@/lib/db";
import Link from "next/link";

type Params = Promise<{ id: string }>;

export default async function ItemPage(props: { params: Params }) {
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
          <p className="text-xs font-thin">Id: {item?.id}</p>
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
      <div className="flex  justify-between w-full  my-5">
        <div className="flex flex-col gap-5">
          {item?.type === "STOCK" && (
            <div className="flex gap-5 justify-between">
              <div className="flex flex-col gap-2">
                <p>Unit Quantity</p>
                <h2 className="font-bold text-xl">{item?.unitQty}</h2>
              </div>
              <div className="flex flex-col gap-2">
                <p>Unit</p>
                <h2 className="font-bold text-xl">{item?.unit?.name}</h2>
              </div>
              <div className="flex flex-col gap-2">
                <p>Stock</p>
                <h2 className="font-bold text-xl">{item?.stock}</h2>
              </div>
            </div>
          )}

          <div className="flex gap-5 justify-between">
            {item?.type === "SERVICE" && (
              <div className="flex flex-col gap-2">
                <p>Category</p>
                <h2 className="font-bold text-xl">{item?.category?.name}</h2>
              </div>
            )}

            {item?.type === "STOCK" && (
              <div className="flex flex-col gap-2">
                <p>Status</p>
                <h2 className="font-bold text-xl">{item?.status}</h2>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2 w-fit">
          <div className="flex flex-col gap-2">
            <p>Type</p>
            <h2 className="font-bold text-xl">{item?.type}</h2>
          </div>
          {item?.type === "STOCK" && (
            <div className="flex flex-col gap-2">
              <p>Cost</p>
              <h2 className="font-bold text-xl">
                {item?.price?.toFixed(2)} MZN
              </h2>
            </div>
          )}
          {item?.type === "SERVICE" && (
            <div className="flex flex-col gap-2">
              <p>Price</p>
              <h2 className="font-bold text-xl">
                {item?.price?.toFixed(2)} MZN
              </h2>
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-between gap-4 w-full">
        <div className="flex flex-col gap-2">
          <h2 className="font-semibold">Description </h2>
          <span className="product-detail-desc p-2 text-md font-light">
            <p>{item?.description}</p>
          </span>
          {item?.type === "SERVICE" && (
            <ul className="flex flex-col recipe-items-list p-2">
              <h2 className="font-semibold underline">Recipe Items</h2>
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
            Created At: {item?.createdAt.toLocaleDateString()}
          </p>
          <p className="text-xs font-thin">
            Updated At: {item?.updatedAt.toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}
