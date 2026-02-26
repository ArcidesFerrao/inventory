import ExpenseForm from "@/components/ExpenseForm";
import { auth } from "@/lib/auth";
import { getTranslations } from "next-intl/server";

import Link from "next/link";
import { redirect } from "next/navigation";

export default async function NewExpense({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("Common");
  const et = await getTranslations("Expenses");

  const session = await auth();

  if (!session?.user.serviceId) redirect("/login");

  return (
    <div className="sales-section flex flex-col gap-5 w-full">
      <div className="list-header flex items-center justify-between w-full">
        <h2 className="text-2xl font-bold">{et("expenseItem")}</h2>
        <Link
          href={`/${locale}/service/sales`}
          className="add-product flex gap-1"
        >
          <span className="text-md px-2">{t("cancel")}</span>
        </Link>
      </div>
      <div className="sales-content flex justify-between gap-4">
        <ExpenseForm
          serviceId={session.user.serviceId}
          userId={session.user.id}
        />
      </div>
    </div>
  );
}
