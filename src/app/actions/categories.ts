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
          {type: "SERVICE"},
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

export async function createNewSupplierCategory({newCategoryName, supplierId, }:{newCategoryName: string; supplierId: string}) {
  console.log("creating category", newCategoryName)
  try{

    const existing = await db.category.findFirst({
      where: {
      name: newCategoryName,
      OR: [
        {supplierId},
        {supplierId: null},
      ]
    }
  })
  
  if (!existing) {
    const category = await db.category.create({
      data: {
        name: newCategoryName,
        supplierId,
        type: "SUPPLIER"
      }
    })
    
    return {success: true, category}
  }
} catch (error) {
  console.error("Error creating category")
  return {success: false, error}
}
}
export async function createNewCategory({newCategoryName, serviceId, }:{newCategoryName: string; serviceId: string}) {
  console.log("creating category", newCategoryName)
  try{

    const existing = await db.category.findFirst({
      where: {
      name: newCategoryName,
      OR: [
        {serviceId},
        {serviceId: null},
      ]
    }
  })
  
  if (!existing) {
    const category = await db.category.create({
      data: {
        name: newCategoryName,
        serviceId,
        type: "SUPPLIER"
      }
    })
    
    return {success: true, category}
  }
} catch (error) {
  console.error("Error creating category")
  return {success: false, error}
}
}