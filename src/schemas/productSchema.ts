import z from "zod";

export const productSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
    price: z.coerce.number().positive("Price must be positive"),
    quantity: z.number().positive("Quanitity must be greater than 0"),
    stock: z.coerce.number().int().optional(),
    unitId: z.string().optional(),
    categoryId: z.string().optional(),
    type: z.enum(["STOCK", "SERVICE"]).default("STOCK"),
    recipe: z.array(
        z.object({
            stockId: z.string().min(1, "Stock item is required"),
            quantity: z.coerce.number().positive("Quantity must be greater than 0"),
        })
    ).optional(),
})


// userId: z.string().nonempty("User Id is required"),