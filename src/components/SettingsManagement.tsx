"use client";

import { useState } from "react";
import { ToggleSwitch } from "./ToggleSwitch";
import { saveSettingsAction } from "@/app/actions/settings";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function SettingsManagement({
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
        <h3 className="text-lg font-normal">Inventory Management</h3>
        <button type="button" onClick={handleSaveSettings}>
          {isSaving ? "Saving..." : "Save Settings"}
        </button>
      </div>
      <div className="flex justify-between">
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
      </div>
      <div className="flex justify-between">
        <div>
          <p>Low Stock Threshold</p>
          <p className="font-thin text-sm">
            Alert when inventory reaches this level
          </p>
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
