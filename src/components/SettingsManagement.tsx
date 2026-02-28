"use client";

import { useState } from "react";
import { ToggleSwitch } from "./ToggleSwitch";
import {
  saveSettingsAction,
  saveSupplierSettingsAction,
} from "@/lib/actions/settings";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export function SettingsManagement({
  serviceId,
  serviceSettings,
}: {
  serviceId: string;
  serviceSettings?: {
    allowNegativeStock: boolean;
    lowStockThreshold: number;
  } | null;
}) {
  const router = useRouter();
  const t = useTranslations("Common");
  const st = useTranslations("Settings");
  const sert = useTranslations("Service");
  const [settings, setSettings] = useState({
    allowNegativeStock: serviceSettings?.allowNegativeStock || false,
    lowStockThreshold: serviceSettings?.lowStockThreshold || 5,
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleToggle = (field: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleChange = ({
    field,
    value,
  }: {
    field: keyof typeof settings;
    value: number;
  }) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      const result = await saveSettingsAction({ serviceId, settings });
      if (result.success) {
        toast.success("Settings saved successfully");
      }
      console.log("Settings saved", settings);
      router.refresh();
    } catch (error) {
      console.error("Error saving settings:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="settings-section flex flex-col gap-2 p-4">
      <div className="flex justify-between">
        <h3 className="text-lg font-normal">{sert("inventoryManagement")}</h3>
        <button type="button" onClick={handleSaveSettings}>
          {isSaving ? t("saving") : st("saveSettings")}
        </button>
      </div>
      <div className="flex justify-between">
        <div>
          <p>{st("negativeStock")}</p>
          <p className="font-thin text-sm">{st("negativeStockDetail")}</p>
        </div>
        <ToggleSwitch
          enabled={settings.allowNegativeStock}
          onChange={() => handleToggle("allowNegativeStock")}
        />
      </div>
      <div className="flex justify-between">
        <div>
          <p>{st("lowStock")}</p>
          <p className="font-thin text-sm">{st("lowStockDetail")}</p>
        </div>
        <input
          type="number"
          name="lowStock"
          id="lowStock"
          value={settings.lowStockThreshold}
          onChange={(e) =>
            handleChange({
              field: "lowStockThreshold",
              value: parseInt(e.target.value),
            })
          }
          className="max-w-25"
        />
      </div>
    </div>
  );
}

export function SupplierSettingsManagement({
  supplierId,
  minimumOrderValue,
}: {
  supplierId: string;
  minimumOrderValue: number | null;
}) {
  const router = useRouter();
  const [settings, setSettings] = useState({
    // allowNegativeStock: supplierSettings?.allowNegativeStock || false,
    minimumOrderValue: minimumOrderValue || 500,
  });
  const [isSaving, setIsSaving] = useState(false);
  const t = useTranslations("Common");
  const st = useTranslations("Settings");
  const sert = useTranslations("Service");

  const handleChange = ({
    field,
    value,
  }: {
    field: keyof typeof settings;
    value: number;
  }) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      const result = await saveSupplierSettingsAction({ supplierId, settings });
      if (result.success) {
        toast.success("Settings saved successfully");
      }
      console.log("Settings saved", settings);
      router.refresh();
    } catch (error) {
      console.error("Error saving settings:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="settings-section flex flex-col gap-2 p-4">
      <div className="flex justify-between">
        <h3 className="text-lg font-normal">{sert("inventoryManagement")}</h3>
        <button type="button" onClick={handleSaveSettings}>
          {isSaving ? t("saving") : st("saveSettings")}
        </button>
      </div>
      {/* <div className="flex justify-between">
        <div>
          <p>Allow Negative Stock</p>
          <p className="font-thin text-sm">
            Permit sales even when stock quantity goes below zero
          </p>
        </div>
        <ToggleSwitch
          enabled={settings.allowNegativeStock}
          onChange={() => handleToggle("allowNegativeStock")}
        />
      </div> */}
      <div className="flex justify-between">
        <div>
          <p>{st("negativeStock")}</p>
          <p className="font-thin text-sm">{st("negativeStockDetail")}</p>
        </div>
        <input
          type="number"
          name="lowStock"
          id="lowStock"
          value={settings.minimumOrderValue}
          onChange={(e) =>
            handleChange({
              field: "minimumOrderValue",
              value: parseInt(e.target.value),
            })
          }
          className="max-w-25"
        />
      </div>
    </div>
  );
}
