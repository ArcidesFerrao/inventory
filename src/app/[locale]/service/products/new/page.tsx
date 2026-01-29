import { ItemForm } from "@/components/ItemForm";
// import { ProductForm } from "@/components/ProductForm";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function NewProductPage({
  params,
}: {
  params: { locale: string };
}) {
  const locale = await params.locale;

  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  if (!session.user.serviceId) {
    redirect("/register/service");
  }
  return (
    <div className="flex flex-col gap-5 items-center w-full">
      <div className="flex items-center justify-between w-full">
        <h1 className="text-xl font-semibold">Add New Item</h1>
        <Link href={`/${locale}/service/products`}>
          <span className="ep--back"></span>
        </Link>
      </div>
      <ItemForm serviceId={session?.user.serviceId} />
    </div>
  );
}
