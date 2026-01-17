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
export async function saveSupplierSettingsAction({ supplierId, settings }: { supplierId: string; settings: { minimumOrderValue: number } }) {


    try {
        await db.supplierSettings.upsert({
            where: { supplierId },
            update: {
                minimumOrderValue: settings.minimumOrderValue
            },
            create: {
                supplierId,
                minimumOrderValue: settings.minimumOrderValue
            }
        });
        return { success: true };
    } catch (error) {
        console.error("Error saving settings:", error);
        return { success: false , error };
    }
}