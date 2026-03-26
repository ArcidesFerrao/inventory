import { db } from "@/lib/db";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import Link from "next/link";

type Params = Promise<{ id: string; locale: string }>;

export default async function ExpensePage(props: { params: Params }) {
  const session = await auth();

  if (!session?.user) redirect("/login");
  if (!session.user.serviceId) redirect("/register/service");

  const { id, locale } = await props.params;
  const t = await getTranslations("Common");
  const et = await getTranslations("Expenses");

  const item = await db.expense.findUnique({
    where: { id },
    include: { category: true },
  });

  if (!item) return <p>{t("notFound")}</p>;

  const formatDate = (date: Date) =>
    date.toLocaleDateString(undefined, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Header */}
      <div className="flex justify-between items-start w-full">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold">
            {item.description ?? et("unnamedExpense")}
          </h1>
          <div className="flex items-center gap-2">
            {item.category && (
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-400/10 text-blue-400">
                {item.category.name}
              </span>
            )}
            {item.isRecurring && (
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-purple-400/10 text-purple-400">
                {t("recurring")}
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/${locale}/service/expenses`}
            className="text-sm text-base-content/50 hover:text-base-content flex items-center gap-1 w-fit"
          >
            ←
          </Link>
          {/* <Link
            href={`/${locale}/service/expenses/${id}/edit`}
            className="w-9 h-9 flex items-center justify-center rounded-lg border border-base-content/20 text-base-content/50 hover:bg-base-content/5 hover:text-base-content transition-colors text-sm"
          >
            <span className="mdi--edit" />
          </Link> */}
        </div>
      </div>

      {/* Amount card */}
      <div className="stats p-5 flex justify-between items-center">
        <div>
          <p className="label-text text-xs uppercase tracking-wide mb-1">
            {t("expenseAmount")}
          </p>
          <p className="text-3xl font-medium text-red-400">
            − MZN {item.amount.toFixed(2)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-base-content/50 mt-1">
            {t("createdAt")}: {formatDate(item.createdAt)}
          </p>
          <p className="text-xs font-medium">
            {item.timestamp.toLocaleTimeString()}
          </p>
        </div>
      </div>

      {/* Details + receipt */}
      <div className="grid grid-cols-2 gap-3">
        <div className="stats p-4 flex flex-col gap-3">
          <p className="label-text text-xs uppercase tracking-wide">
            {t("details")}
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <p className="text-xs text-base-content/50">{t("category")}</p>
              <p className="text-sm font-medium">
                {item.category?.name ?? (
                  <span className="text-base-content/40 font-normal italic">
                    {t("uncategorized")}
                  </span>
                )}
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-xs text-base-content/50">
                {t("paymentMethod")}
              </p>
              <p className="text-sm font-medium">
                {item.paymentMethod ?? (
                  <span className="text-base-content/40 font-normal italic">
                    —
                  </span>
                )}
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-xs text-base-content/50">{t("recurring")}</p>
              <p
                className={`text-sm font-medium ${item.isRecurring ? "text-purple-400" : "text-base-content/50"}`}
              >
                {item.isRecurring ? t("yes") : t("no")}
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-xs text-base-content/50">{t("date")}</p>
              <p className="text-sm font-medium">
                {formatDate(item.timestamp)}
              </p>
            </div>
          </div>
        </div>

        <div className="stats p-4 flex flex-col gap-3">
          <p className="label-text text-xs uppercase tracking-wide">
            {et("receipt")}
          </p>
          {item.receiptUrl ? (
            <a
              href={item.receiptUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-blue-400 hover:underline"
            >
              <span
                className="mdi--file-document-outline"
                style={{ fontSize: 16 }}
              />
              {et("viewReceipt")}
            </a>
          ) : (
            <>
              <p className="text-sm text-base-content/40 italic">
                {et("noReceipt")}
              </p>
              <Link
                href={`/${locale}/service/expenses/${id}/edit`}
                className="flex items-center gap-1.5 text-xs text-blue-400 border border-blue-400/30 rounded-lg px-3 py-1.5 w-fit hover:bg-blue-400/10 transition-colors"
              >
                + {et("attachReceipt")}
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Description + notes */}
      {(item.description || item.notes) && (
        <div className="stats p-4 flex flex-col gap-3">
          <p className="label-text text-xs uppercase tracking-wide">
            {t("descriptionAndNotes")}
          </p>
          <div className="grid grid-cols-2 gap-4">
            {item.description && (
              <div className="flex flex-col gap-1">
                <p className="text-xs text-base-content/50">
                  {t("description")}
                </p>
                <p className="text-sm text-base-content/70 leading-relaxed">
                  {item.description}
                </p>
              </div>
            )}
            {item.notes && (
              <div className="flex flex-col gap-1">
                <p className="text-xs text-base-content/50">{t("notes")}</p>
                <p className="text-sm text-base-content/70 leading-relaxed">
                  {item.notes}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
