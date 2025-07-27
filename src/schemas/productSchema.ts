import z from "zod";

export const productSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().min(5, "Description is required"),
    price: z.coerce.number().positive("Price must be positive"),
    stock: z.coerce.number().int().nonnegative("Stock must be 0 or more"),
    category: z.string().min(3, "Category is required"),
    userId: z.string().min(3, "User Id is required"),
})