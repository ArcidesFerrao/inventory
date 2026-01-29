"use server";

import { db } from "@/lib/db";


export async function getUnits() {
  try {
    const units = await db.unit.findMany();
    return units;
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    
    return [];
  }
}