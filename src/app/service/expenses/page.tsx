import { ExpenseFilters } from "@/components/ExpenseFilters";
import { ExpenseListItem } from "@/components/List";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import Link from "next/link";
import { redirect } from "next/navigation";

type SearchParams = {
  search?: string;
  category: string;
  period?: "daily" | "weekly" | "monthly";
};

const PERIOD_DAYS = {
  daily: 1,
  weekly: 7,
  monthly: 30,
  all: 0,
} as const;

export default async function ExpensesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const session = await auth();

  if (!session?.user) redirect("/login");

  if (!session.user.serviceId) redirect("/register/service");

  const params = await searchParams;
  const searchQuery = params.search?.toLowerCase() || "";
  const categoryFilter = params.category || "all";
  const period = params.period || "all";

  const dateFilter =
    PERIOD_DAYS[period] > 0
      ? {
          gte: new Date(Date.now() - PERIOD_DAYS[period] * 24 * 60 * 60 * 1000),
        }
      : undefined;

  const expenses = await db.expense.findMany({
    where: {
      serviceId: session.user.serviceId,
      ...(dateFilter && { timestamp: dateFilter }),
    },
    include: {
      category: true,
    },
    orderBy: { timestamp: "desc" },
  });

  const categories = await db.expenseCategory.findMany({
    where: {
      serviceId: session.user.serviceId,
    },
    orderBy: {
      name: "asc",
    },
  });

  const filteredExpenses = expenses.filter((expense) => {
    const matchesSearch =
      !searchQuery ||
      expense.description?.toLowerCase().includes(searchQuery) ||
      expense.category?.name?.toLowerCase().includes(searchQuery);

    const matchesCategory =
      categoryFilter === "all" || expense.categoryId === categoryFilter;

    return matchesCategory && matchesSearch;
  });

  const totalAmount = filteredExpenses.reduce(
    (acc, exp) => acc + exp.amount,
    0,
  );
  const averageExpense =
    filteredExpenses.length > 0 ? totalAmount / filteredExpenses.length : 0;

  return (
    <div className="products-list flex flex-col gap-4 w-full">
      <div className="list-header expense-list-header flex items-center justify-between w-full">
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

      <div className="total-expense-info flex justify-between py-2">
        <div className="total-expense-title flex flex-col gap-2">
          <p>Expenses</p>
          <h4 className="text-xl font-bold">{filteredExpenses.length}</h4>
        </div>
        <div className="total-expense-title flex flex-col gap-2">
          <p>Total Spent</p>
          <h4 className="text-xl font-bold">MZN {totalAmount.toFixed(2)}</h4>
        </div>
        <div className="total-expense-title flex flex-col gap-2">
          <p>Average Expense</p>
          <h4 className="text-xl font-bold">MZN {averageExpense.toFixed(2)}</h4>
        </div>
      </div>
      <ExpenseFilters
        currentSearch={searchQuery}
        currentCategory={categoryFilter}
        currentPeriod={period}
        categories={categories}
      />
      {filteredExpenses.length === 0 ? (
        <p>No expenses found...</p>
      ) : (
        <ul className="w-full flex flex-col gap-4">
          {filteredExpenses.map((expense) => (
            <ExpenseListItem key={expense.id} expense={expense} />
          ))}
        </ul>
      )}
    </div>
  );
}
