import { db } from "@/lib/db";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

type Params = Promise<{ id: string }>;

export default async function ExpensePage(props: { params: Params }) {
  const session = await auth();

  if (!session?.user) redirect("/login");
  if (!session.user.serviceId) redirect("/register/service");

  const { id } = await props.params;
  const t = await getTranslations("Common");

  const item = await db.expense.findUnique({
    where: {
      id,
    },
  });
  return (
    <div className="flex flex-col gap-5 items-start w-full">
      <div className="flex justify-between w-full">
        <div>
          <p className="text-xs font-thin">Id: {item?.id}</p>
        </div>
      </div>
      <div className="flex flex-col gap-2 w-fit">
        <div className="flex flex-col gap-2">
          <p>{t("amount")}</p>
          <h4 className="font-bold text-xl">{item?.amount.toFixed(2)} MZN</h4>
        </div>
      </div>
      <div className="flex justify-between gap-4 w-full">
        <div className="flex flex-col gap-2">
          <h2 className="font-semibold">{t("description")}</h2>
          <span className="product-detail-desc p-2 text-md font-light">
            <p>{item?.description}</p>
          </span>
        </div>

        <div className="flex flex-col self-end gap-2 w-fit">
          <p className="text-xs font-thin">
            {t("createdAt")}: {item?.createdAt.toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}
