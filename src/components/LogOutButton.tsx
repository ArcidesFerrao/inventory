"use client";

import { useLocale } from "@/lib/useLocale";
import { signOut } from "next-auth/react";
import Link from "next/link";

export const LogOutButton = () => {
  const locale = useLocale();

  return (
    <div className="logout-button flex flex-col gap-2">
      <button onClick={() => signOut()}>Sign Out</button>
      <p className="text-xs font-extralight">
        Back to <Link href={`/${locale}`}>Dashboad Menu</Link>
      </p>
    </div>
  );
};
