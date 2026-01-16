import { auth } from "@/lib/auth";
// import { ExportSelection } from "@/components/ExportPdf";
// import { db } from "@/lib/db";
// import { useState } from "react";

// export default async function SettingsPage() {
//   const session = await auth();

//   const serviceId = session?.user.serviceId;
//   if (!serviceId) return <p>Access Denied</p>;

//   const sales = await db.sale.findMany({
//     where: {
//       serviceId,
//     },
//     include: {
//       SaleItem: {
//         include: {
//           item: true,
//         },
//       },
//     },
//     orderBy: {
//       timestamp: "desc",
//     },
//   });

//   const purchases = await db.purchase.findMany({
//     where: {
//       serviceId,
//     },
//     include: {
//       PurchaseItem: {
//         include: {
//           item: true,
//           stockItem: true,
//         },
//       },
//     },
//     orderBy: {
//       timestamp: "desc",
//     },
//   });

//   const stockItems = await db.serviceStockItem.findMany({
//     where: {
//       serviceId,
//       // type: "STOCK",
//     },
//     include: {
//       stockItem: true,
//     },
//   });

//   const logs = await db.activityLog.findMany({
//     where: {
//       serviceId,
//     },
//     orderBy: {
//       timestamp: "desc",
//     },
//   });

//   return (
//     <section className="settings-page flex flex-col gap-4">
//       <h2 className="text-2xl font-bold">Settings</h2>
//       <div className="flex flex-col gap-4">
//         <div className="flex gap-2">
//           <h4 className="font-medium">Username: </h4>
//           <p>{session.user.name}</p>
//         </div>
//         <div className="flex gap-2">
//           <h4 className="font-medium">Email: </h4>
//           <p>{session.user.email}</p>
//         </div>
//         <div className="flex gap-2">
//           <h4 className="font-medium">Phone Number: </h4>
//           <p>{session.user.phoneNumber}</p>
//         </div>
//         <ExportSelection
//           stockItems={stockItems}
//           sales={sales}
//           purchases={purchases}
//           logs={logs}
//         />
//       </div>
//     </section>
//   );
// }

export default async function SettingsPage() {
  const session = await auth();

  const serviceId = session?.user.serviceId;

  if (!serviceId) return <p>Access Denied</p>;
  return (
    <section className="settings-page flex flex-col gap-4">
      <div className="flex justify-between">
        <div>
          <h2 className="text-2xl font-bold">Settings</h2>
          <p>Configure your service preferences here.</p>
        </div>
        <button>Save Changes</button>
      </div>

      <div className="flex flex-col">
        <div>
          <h3>Service Info</h3>
          <div>
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

        <div>
          <h3>Inventory Management</h3>
          <div className="flex justify-between">
            <div>
              <p>Allow Negative Stock</p>
              <p>Permit sales even when stock quantity goes below zero</p>
            </div>
            <button className="toggle-switch">Toggle Switch</button>
          </div>
          <div className="flex justify-between">
            <div>
              <p>Low Stock Threshold</p>
              <p>Alert when inventory reaches this level</p>
            </div>
            <input
              type="number"
              name="lowStock"
              id="lowStock"
              defaultValue={5}
            />
          </div>
        </div>
        <div>
          <h3>Data Export</h3>
          <div className="flex justify-between">
            <p>Report Type</p>
            <select name="reportType" id="reportType">
              <option value="stock">Stock Report</option>
              <option value="sales">Sales Report</option>
              <option value="purchases">Purchases Report</option>
            </select>
          </div>
          <div>{/* Include Detailed Logs */}</div>
          <button>Export Data</button>
        </div>
      </div>
      <div>
        <p>
          Note: Changes to these settings will affect all future transactions.
          Existing records will remain unchanged.
        </p>
      </div>
    </section>
  );
}
