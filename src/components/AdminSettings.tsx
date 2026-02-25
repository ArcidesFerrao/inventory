"use client";

import { Category, Unit } from "@/generated/prisma/client";
import { useState } from "react";
import EntityForm from "./EntityForm";
import { Modal } from "./Modal";
import { useTranslations } from "next-intl";

export default function AdminSettings({
  units,
  categories,
}: {
  units: Unit[];
  categories: Category[];
}) {
  const t = useTranslations("Common");
  // const [view, setView] = useState<"Configuration" | "Settings">(    "Configuration",  );
  const [unitModalOpen, setUnitModalOpen] = useState(false);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);

  return (
    <>
      <section className="manage flex flex-wrap gap-5">
        <div className="border p-2 rounded-sm flex flex-col gap-2 ">
          <div className="flex justify-between ">
            <h3>{t("unit")}</h3>
            <button onClick={() => setUnitModalOpen(true)} className="px-2">
              +
            </button>
          </div>
          <div>
            {units.length !== 0 ? (
              <ul>
                {units.map((u) => (
                  <li
                    key={u.id}
                    className="flex justify-between  gap-8 hover:underline"
                  >
                    <p>{u.name}</p>
                    <p className="text-sm font-thin">{u.description}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm font-thin">no units created</p>
            )}
          </div>
        </div>
        <div className="border p-2 rounded-sm flex flex-col gap-2 ">
          <div className="flex justify-between">
            <h3>{t("category")}</h3>
            <button onClick={() => setCategoryModalOpen(true)} className="px-2">
              +
            </button>
          </div>
          <div>
            {categories.length !== 0 ? (
              <ul>
                {categories.map((c) => (
                  <li key={c.id}>{c.name}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm font-thin">no categories created</p>
            )}
          </div>
        </div>
      </section>

      <Modal
        isOpen={unitModalOpen}
        onClose={() => setUnitModalOpen(false)}
        title="Create New Unit"
      >
        <EntityForm type={"unit"} onClose={() => setUnitModalOpen(false)} />
      </Modal>
      <Modal
        isOpen={categoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
        title="Create New Category"
      >
        <EntityForm
          type={"category"}
          onClose={() => setCategoryModalOpen(false)}
        />
      </Modal>
    </>
  );
}
