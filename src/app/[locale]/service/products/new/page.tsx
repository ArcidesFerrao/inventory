import {
  CatalogItemForm,
  // ItemForm
} from "@/components/ItemForm";
// import { ProductForm } from "@/components/ProductForm";
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
  const t = await getTranslations("Common");

  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  if (!session.user.serviceId) {
    redirect("/register/service");
  }
  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex items-center justify-between w-full">
        <div className="flex flex-col gap-2">
          <h1 className="text-xl font-semibold">{t("addNewItem")}</h1>
        </div>
        <Link href={`/${locale}/service/products`}>
          <span className="ep--back"></span>
        </Link>
      </div>
      {/* <ItemForm serviceId={session?.user.serviceId} /> */}
      <CatalogItemForm serviceId={session?.user.serviceId} />
    </div>
  );
}
