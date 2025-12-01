import { z } from "zod";

export const supplierSchema = z.object({
    id: z.string().optional(),
    businessName: z.string().min(2, "Name is required").max(100, "Name too long"),
    phoneNumber: z.string().regex(/^\+?\d{7,15}$/, "Phone number must be valid"),
    description: z.string().max(500).optional(),
    specialization: z.string().max(500).optional(),
    email: z.string().email("Invalid email address").optional(),
    address: z.string().min(5, "Address required"),
    website: z.string().url("Invalid website url").optional(),
    establishedYear: z.string().regex(/^\d{4}$/, "Year must be 4 digits").optional(),
})

export const serviceSchema = z.object({
    id: z.string().optional(),
    phoneNumber: z.string().regex(/^\+?\d{7,15}$/, "Phone number must be valid"),
    businessName: z.string().min(2, "Business Name is required").max(100, "Name too long"),
    description: z.string().max(500).optional(),
    location: z.string().min(2, "Location is required"),
    businessType: z.enum(["RESTAURANT", "SHOP", "STORE", "SUPERMARKET", "RETAIL", "RESELLER"], {
    errorMap: () => ({ message: "Invalid business type" }),
  }),
    website: z.string().url("Invalid website url").optional(),
    operationHours: z.string().regex(
      /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]\s*-\s*([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
      "Hours must be in format HH:MM - HH:MM"
    ).optional(),
})


