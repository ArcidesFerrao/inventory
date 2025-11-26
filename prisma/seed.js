// import { BusinessType, PrismaClient, UserRole } from "@/prisma/client";
import users from "./data/users.json";
import services from "./data/service.json";
import suppliers from "./data/supplier.json";
import units from "./data/unit.json";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma";

const connectionString = process.env.DATABASE_URL || "";

if (!connectionString) {
  throw new Error("DATABASE_URL is not set in environment variables");
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const db = new PrismaClient({
  adapter,
  log: ["query", "info", "warn", "error"],
});

async function main() {
  console.log("Seeding database...");

  for (const user of users) {
    await db.user.create({
      data: {
        ...user,
        role: user.role,
      },
    });
  }
  for (const service of services) {
    await db.service.create({
      data: {
        ...service,
        businessType: service.businessType,
      },
    });
  }
  for (const supplier of suppliers) {
    await db.supplier.create({
      data: {
        ...supplier,
        establishedYear: Number(supplier.establishedYear),
      },
    });
  }
  for (const unit of units) {
    await db.unit.create({
      data: {
        ...unit,
      },
    });
  }

  console.log("Seeding complete");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
