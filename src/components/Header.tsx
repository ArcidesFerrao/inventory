"use client";

import { useSession } from "next-auth/react";
import React from "react";

export const Header = () => {
  const { data: session } = useSession();
  return (
    <header className="flex justify-between p-4 items-center">
      <h1>Inventory</h1>
      <span>
        <p>Welcome, {session?.user.name}</p>
      </span>
    </header>
  );
};
