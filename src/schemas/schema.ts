// ============================================
// VALIDATION 1: Sale must have owner
// ============================================

import z from "zod";

export const saleSchema = z.object({
  date: z.date().optional(),
  total: z.number().nonnegative(),
  cogs: z.number().nonnegative().default(0),
  paymentType: z.string(),
  supplierId: z.string().optional(),
  serviceId: z.string().optional(),
}).refine(
  (data) => data.supplierId || data.serviceId,
  {
    message: "Sale must belong to either a supplier or a service",
    path: ["supplierId"], // or use a general path
  }
);

// Usage in your API route:
// const validatedData = saleSchema.parse(formData);

// ============================================
// VALIDATION 2: SaleItem/PurchaseItem exclusivity
// ============================================

export const saleItemSchema = z.object({
  saleId: z.string(),
  itemId: z.string().optional(),
  stockItemId: z.string().optional(),
  quantity: z.number().int().positive(),
  price: z.number().nonnegative(),
}).refine(
  (data) => {
    const hasItem = !!data.itemId;
    const hasStockItem = !!data.stockItemId;
    // Exactly one must be true (XOR)
    return hasItem !== hasStockItem;
  },
  {
    message: "Exactly one of itemId or stockItemId must be provided",
    path: ["itemId"],
  }
);

export const purchaseItemSchema = z.object({
  purchaseId: z.string(),
  itemId: z.string().optional(),
  stockItemId: z.string().optional(),
  stock: z.number().int().nonnegative(),
  price: z.number().nonnegative(),
  quantity: z.number().int().positive().default(1),
  unitCost: z.number().nonnegative().default(0),
  totalCost: z.number().nonnegative().default(0),
}).refine(
  (data) => {
    const hasItem = !!data.itemId;
    const hasStockItem = !!data.stockItemId;
    return hasItem !== hasStockItem;
  },
  {
    message: "Exactly one of itemId or stockItemId must be provided",
    path: ["itemId"],
  }
);