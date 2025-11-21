import { SupplierProductForm } from "@/components/ProductForm";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function NewProductPage() {
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
        <h1 className="text-xl font-semibold">Add New Product</h1>
        <Link href="/supply/products">
          <span className="ep--back"></span>
        </Link>
      </div>
      <SupplierProductForm supplierId={session.user.supplierId} />
    </div>
  );
}
