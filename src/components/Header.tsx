"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export const Header = () => {
  const { data: session, status } = useSession();

  const pathname = usePathname();

  const showMenu =
    pathname?.startsWith("/supply") || pathname?.startsWith("/service");

  return (
    <header className="flex justify-between p-4 items-center">
      <Link href="/">
        <div className="innovante flex gap-2 items-center ">
          <Image src="/logo.png" width={22} height={22} alt="Innovante" />
          <h1 className="font-bold text-2xl uppercase ">Inventory</h1>
        </div>
      </Link>
      <div className="header-greetings">
        {status === "loading" ? (
          <span className="eos-icons--three-dots-loading"></span>
        ) : !session?.user ? (
          ""
        ) : (
          <p className="header-welcome">
            Welcome,{" "}
            <Link href={`/${session?.user.id}`}>{session?.user.name}</Link>
          </p>
        )}
      </div>
      {showMenu && (
        <button className="header-menu flex items-center">
          <span className="line-md--menu"></span>
        </button>
      )}
    </header>
  );
};
