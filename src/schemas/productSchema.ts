import z from "zod";

export const productSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
    price: z.coerce.number().min(0).optional(),
    cost: z.coerce.number().min(0).optional(),
    quantity: z.number().positive("Quanitity must be greater than 0"),
    stock: z.coerce.number().int().optional(),
    unitId: z.string().optional(),
    categoryId: z.string().optional(),
    type: z.enum(["STOCK", "SERVICE"]).default("STOCK"),
    recipe: z.array(
        z.object({
            stockId: z.string().min(1, "Stock item is required"),
            quantity: z.coerce.number(),
        })
    ).optional(),
})


// userId: z.string().nonempty("User Id is required"),

export const supplierProductSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
    unit: z.string(),
    unitQty: z.coerce.number().min(0),
    stock: z.coerce.number().int().optional(),
    price: z.coerce.number().min(0),
    cost: z.coerce.number().min(0).optional(),
    unitId: z.string().optional(),
    
})