"use server";

import { db } from "@/lib/db";

export async function getCategories() {
  try {
    const categories = await db.category.findMany();
    return categories;
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return [];
  }
}
export async function getServiceCategories(serviceId: string) {
  try {
    const categories = await db.category.findMany({
      where: {
        OR: [
          {serviceId},
          {serviceId: null},
        ]
      }
    });
    return categories;
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return [];
  }
}
export async function getSupplierCategories(supplierId: string) {
  try {
    const categories = await db.category.findMany({
      where: {
        OR: [
          {supplierId},
          {type: "SUPPLIER"},
        ]
      }
    });
    return categories;
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return [];
  }
}

export async function createNewSupplierCategory({newCategory, supplierId, }:{newCategory: string; supplierId: string}) {
  
  const existing = await db.category.findFirst({
    where: {
      name: newCategory,
      OR: [
        {supplierId},
        {supplierId: null},
      ]
    }
  })

  if (!existing) {
    await db.category.create({
      data: {
        name: newCategory,
        supplierId,
        type: "SUPPLIER"
      }
    })
  }
}