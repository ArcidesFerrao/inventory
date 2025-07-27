"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import React from "react";

export const Header = () => {
  const { data: session } = useSession();
  return (
    <header className="flex justify-between p-4 items-center">
      <div className="px-4 innovante flex gap-2 items-center ">
        <Image src="/logo.png" width={22} height={22} alt="Innovante" />
        <h1 className="font-bold text-2xl uppercase ">Inventory</h1>
      </div>
      <span>
        <p>Welcome, {session?.user.name}</p>
      </span>
    </header>
  );
};
