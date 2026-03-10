"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MenuButton } from "./MenuButton";
import { NotificationBell } from "./Bell";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

export const Header = () => {
  const { data: session, status } = useSession();

  const pathname = usePathname();
  const locale = pathname.split("/")[1] || "pt";
  const t = useTranslations("Common");

  const [count, setCount] = useState(0);

  useEffect(() => {
    async function fetchCount() {
      const res = await fetch("/api/notifications/unread-count");
      const data = await res.json();
      setCount(data.unread);
    }

    fetchCount();
  }, []);
  const showMenu =
    pathname?.startsWith(`/${locale}/supply`) ||
    pathname?.startsWith(`/${locale}/service`);

  return (
    <header className="flex justify-between p-4 items-center">
      <Link href={`/${locale}`}>
        <div className="innovante flex gap-2 items-center ">
          <Image
            src="/evolure-box-w.png"
            width={22}
            height={22}
            alt="Innovante"
          />
          <h1 className="font-bold text-2xl uppercase ">CONTELA</h1>
        </div>
      </Link>
      <div className="header-greetings flex items-center gap-4">
        {session?.user && <NotificationBell locale={locale} count={count} />}
        {status === "loading" ? (
          <span className="eos-icons--three-dots-loading"></span>
        ) : !session?.user ? (
          ""
        ) : (
          <p className="header-welcome">
            {t("greeting")},{" "}
            <Link href={`/${locale}/user/${session?.user.id}`}>
              {session?.user.name}
            </Link>
          </p>
        )}
      </div>
      {showMenu && (
        <MenuButton
          count={count}
          userId={session?.user.id}
          userName={session?.user.name}
        />
      )}
    </header>
  );
};
