"use client";

import { useTranslations } from "next-intl";
import { redirect } from "next/navigation";

export default function DashMenu({
  isAdmin,
  role,
}: {
  isAdmin: boolean;
  role: string | null | undefined;
}) {
  const t = useTranslations("Common");

  return (
    <section className="dash-menu flex gap-5 py-5">
      {/* <button className="p-4" onClick={() => redirect("/stock")}>
        <span className="carbon--dashboard"></span>
        <p>{t("dashboardMenu0")}</p>
      </button> */}
      {(role === "USER" || role === "SERVICE" || role === "ADMIN") && (
        <button
          onClick={() => redirect("/service")}
          className="p-4 flex items-center gap-12 rounded-md"
        >
          <div className="flex items-center gap-4">
            <span className="p-2 pill-active h-fit rounded-lg">
              <svg
                width="32"
                // height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#05df72"
                stroke-width="1.5"
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
            </span>
            <div className="flex flex-col gap-1">
              <div>
                <div className="flex gap-2 items-center">
                  <p>{t("dashboardMenu1")}</p>
                  <span className=" status-pill pill-active ">Activo</span>
                </div>
                <p className="text-xs font-light ">
                  QTakeAway · Vendas, stock e compras
                </p>
              </div>
              <div className="text-xs font-thin flex text-left flex-col gap-1 feature-row">
                <span className="flex gap-2 opacity-85 items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                  Painel com receita e lucro
                </span>
                <span className="flex gap-2 opacity-85 items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                  Gestão de itens e receitas
                </span>
                <span className="flex gap-2 opacity-85 items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                  Pedidos a fornecedores
                </span>
              </div>
            </div>
          </div>
          <span className=" dash-arrow">→</span>
        </button>
      )}
      {(role === "USER" || role === "SUPPLIER" || role === "ADMIN") && (
        <button
          onClick={() => redirect("/supply")}
          className="p-4 flex items-center gap-12 rounded-md"
        >
          <div className="flex gap-4">
            <span className="p-2 pill-active h-fit rounded-lg">
              <svg
                width="32"
                // height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#378ADD"
                stroke-width="1.5"
              >
                <rect x="1" y="3" width="15" height="13" rx="1"></rect>
                <path d="M16 8h4l3 3v5h-7V8z"></path>
                <circle cx="5.5" cy="18.5" r="2.5"></circle>
                <circle cx="18.5" cy="18.5" r="2.5"></circle>
              </svg>
            </span>
            <div className="flex flex-col gap-1">
              <div className="flex gap-2 items-center">
                <p>{t("dashboardMenu2")}</p>
                <span className="status-pill pill-new">Não registado</span>
              </div>
              <p className="text-sm font-light ">
                Cria um perfil de fornecedor para começar
              </p>
              <div className="text-xs font-thin flex text-left flex-col gap-1 feature-row">
                <span className="feature">
                  <span className="feat-dot dot-blue"></span>Recebe pedidos de
                  clientes
                </span>
                <span className="feature">
                  <span className="feat-dot dot-blue"></span>Gestão de catálogo
                  e entregas
                </span>
                <span className="feature">
                  <span className="feat-dot dot-blue"></span>Painel de receita
                  por período
                </span>
              </div>
            </div>
          </div>
          <span className="dash-arrow">→</span>
        </button>
      )}
      {isAdmin === true && (
        <button className="p-4" onClick={() => redirect("/admin")}>
          <span className="eos-icons--admin-outlined"></span>
          <p>{t("dashboardMenu3")}</p>
        </button>
      )}
    </section>
  );
}
