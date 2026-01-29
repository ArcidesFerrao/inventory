// import { SupplierExportSelection } from "@/components/ExportPdf";
import { ExportSupplierData } from "@/components/ExportData";
import { SupplierSettingsManagement } from "@/components/SettingsManagement";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export default async function SettingsPage() {
  const session = await auth();
  const supplierId = session?.user.supplierId;

  if (!supplierId) return <p>Access Denied</p>;

  const supplierSettings = await db.supplierSettings.findUnique({
    where: { supplierId },
    select: {
      minimumOrderValue: true,
    },
  });

  return (
    <section className="settings-page flex flex-col gap-4">
      <div className="flex justify-between">
        <div>
          <h2 className="text-2xl font-bold">Settings</h2>
          <p className="font-thin">Configure your preferences here.</p>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="settings-section flex flex-col gap-2 p-4">
          <h3 className="text-lg font-normal">Service Info</h3>
          <div className="flex flex-col gap=2">
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
          </div>
        </div>
      </div>
      <SupplierSettingsManagement
        supplierId={supplierId}
        minimumOrderValue={supplierSettings?.minimumOrderValue || null}
      />
      <ExportSupplierData supplierId={supplierId} />
      <div className="settings-note p-3 border">
        <p className="text-sm">
          Note: Changes to these settings will affect all future transactions.
          Existing records will remain unchanged.
        </p>
      </div>
      {/* <h2 className="text-2xl font-bold">Settings</h2>
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
      </div> */}
    </section>
  );
}
