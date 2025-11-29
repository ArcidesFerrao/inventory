import { SupplierProductForm } from "@/components/ProductForm";
import { db } from "@/lib/db";
import Link from "next/link";

type Params = Promise<{ id: string }>;

export default async function EditSupplierProductPage(props: {
  params: Params;
}) {
  const { id } = await props.params;
  const stockItem = await db.stockItem.findUnique({
    where: {
      id,
    },
    include: {
      unit: true,
      category: true,
    },
  });
  if (!stockItem) return <div>Item not found</div>;

  return (
    <div className="flex flex-col gap-5  w-full">
      <div className="edit-product-header flex justify-between gap-5">
        <div className="flex flex-col">
          <h1 className="text-xl font-semibold">Edit Item</h1>
          <p className="text-xs font-extralight">Id: {id}</p>
        </div>
        <Link href="/supply/products">
          <span className="ep--back"></span>
        </Link>
      </div>
      <SupplierProductForm
        stockItem={{
          ...stockItem,
          quantity: stockItem.unitQty,
          type: "SUPPLY",
          Unit: stockItem.unit
            ? {
                id: stockItem.unit.id,
                name: stockItem.unit.name,
                description: stockItem.unit.description,
              }
            : null,

          Category: {
            id: stockItem.category?.id || "",
            name: stockItem.category?.name || "",
          },
        }}
        supplierId={stockItem.supplierId}
      />
    </div>
  );
}
