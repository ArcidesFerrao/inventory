"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";

export const LogOutButton = () => {
  return (
    <div className="logout-button flex flex-col gap-2">
      <button onClick={() => signOut()}>Sign Out</button>
      <p className="text-xs font-extralight">
        Back to <Link href="/">Dashboad Menu</Link>
      </p>
    </div>
  );
};
