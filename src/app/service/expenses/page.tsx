import { ExpenseListItem } from "@/components/List";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function ExpensesPage() {
  const session = await auth();

  if (!session?.user) redirect("/login");

  if (!session.user.serviceId) redirect("/register/service");

  const expenses = await db.expense.findMany({
    where: { serviceId: session.user.serviceId },
    orderBy: { timestamp: "desc" },
  });

  return (
    <div className="products-list flex flex-col gap-4 w-full">
      <div className="list-header flex items-center justify-between w-full">
        <div className="sales-title">
          <h2 className="text-2xl font-medium">Recent Expenses</h2>
          <p className="text-md font-extralight">
            Track and manage your expenses
          </p>
        </div>
        <Link href="/service/expenses/new" className="add-product flex gap-1">
          <span className="text-md px-2">New Expense</span>
        </Link>
      </div>
      <div className="flex justify-between">
        <div className="total-sales-title flex flex-col gap-2">
          <p>Total Expenses</p>
          <h2 className="text-xl font-bold">{expenses.length}</h2>
        </div>
        <div className="flex flex-col gap-2">
          <p>Revenue</p>
          <h2 className="text-xl font-bold">
            MZN {expenses.reduce((acc, sale) => acc + sale.amount, 0)}.00
          </h2>
        </div>
      </div>
      {expenses.length === 0 ? (
        <p>No expenses found...</p>
      ) : (
        <ul className="w-full flex flex-col gap-2">
          {expenses.map((expense) => (
            <ExpenseListItem key={expense.id} expense={expense} />
          ))}
        </ul>
      )}
    </div>
  );
}
