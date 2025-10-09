import MenuAndStock from "@/components/MenuAndStock";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function ProductsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user.serviceId) redirect("/login");

  const products = await db.product.findMany({
    where: {
      serviceId: session.user.serviceId,
    },
    include: {
      Category: true,
    },
  });

  return (
    <div className="products-list flex flex-col gap-4 w-full">
      <MenuAndStock {...products} />
    </div>
  );
}
