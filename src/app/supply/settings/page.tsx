import { SupplierExportSelection } from "@/components/ExportPdf";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export default async function SettingsPage() {
  const session = await auth();
  const supplierId = session?.user.supplierId;

  if (!supplierId) return <p>Access Denied</p>;

  const sales = await db.sale.findMany({
    where: {
      supplierId,
    },
    include: {
      SaleItem: {
        include: {
          stockItem: true,
        },
      },
    },
    orderBy: {
      timestamp: "desc",
    },
  });

  const stockProducts = await db.stockItem.findMany({
    where: {
      supplierId,
    },
  });

  const logs = await db.activityLog.findMany({
    where: {
      supplierId,
    },
    orderBy: {
      timestamp: "desc",
    },
  });

  return (
    <section className="settings-page flex flex-col gap-4">
      <h2 className="text-2xl font-bold">Settings</h2>
      <div className="flex flex-col gap-4">
        <div className="flex gap-2">
          <h4 className="font-medium">Username: </h4>
          <p>{session.user.name}</p>
        </div>
        <div className="flex gap-2">
          <h4 className="font-medium">Email: </h4>
          <p>{session.user.email}</p>
        </div>
        <div className="flex gap-2">
          <h4 className="font-medium">Phone Number: </h4>
          <p>{session.user.phoneNumber}</p>
        </div>
        <SupplierExportSelection
          stockItem={stockProducts}
          sales={sales}
          logs={logs}
        />
      </div>
    </section>
  );
}
