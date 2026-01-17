'use server'

import { db } from "@/lib/db";

export async function saveSettingsAction({ serviceId, settings }: { serviceId: string; settings: { allowNegativeStock: boolean; lowStockThreshold: number } }) {


    try {
        await db.serviceSettings.upsert({
            where: { serviceId },
            update: {
                allowNegativeStock: settings.allowNegativeStock,
                lowStockThreshold: settings.lowStockThreshold
            },
            create: {
                serviceId,
                allowNegativeStock: settings.allowNegativeStock,
                lowStockThreshold: settings.lowStockThreshold
            }
        });
        return { success: true };
    } catch (error) {
        console.error("Error saving settings:", error);
        return { success: false , error };
    }
}