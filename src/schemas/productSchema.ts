import z from "zod";

export const productSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
    price: z.coerce.number().positive("Price must be positive"),
    stock: z.coerce.number().int().nonnegative("Stock must be 0 or more"),
    unit: z.string().optional(),
    categoryId: z.string().nonempty("Category is required"),
})


// userId: z.string().nonempty("User Id is required"),