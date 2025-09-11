import { db } from "../lib/db";

async function clearData() {
  // Delete child tables first to avoid FK errors
  await db.saleItem.deleteMany({});
  await db.sale.deleteMany({});

  await db.purchaseItem.deleteMany({});
  await db.purchase.deleteMany({});

  console.log("All purchases and sales cleared.");
}

clearData()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });