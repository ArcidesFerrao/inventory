import { SupplierProductForm } from "@/components/ProductForm";
import { auth } from "@/lib/auth";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function NewProductPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const it = await getTranslations("Items");

  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  if (!session.user.supplierId) {
    redirect("/register/supplier");
  }
  return (
    <div className="flex flex-col gap-2 items-center w-full">
      <div className="form-header flex items-center justify-between w-full">
        <h1 className="text-xl font-semibold">{it("addNewItem")}</h1>
        <Link href={`/${locale}/supply/products`}>
          <span className="ep--back"></span>
        </Link>
      </div>
      <SupplierProductForm supplierId={session.user.supplierId} />
    </div>
  );
}
