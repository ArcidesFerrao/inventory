"use client";

import { usePathname, useRouter } from "next/navigation";

export function LocaleSwitcher() {
  const pathname = usePathname();
  const router = useRouter();

  const segments = pathname.split("/");
  const currentLocale = segments[1];

  const nextLocale = currentLocale === "pt" ? "en" : "pt";

  const switchLocale = () => {
    segments[1] = nextLocale;
    const newPath = segments.join("/");
    router.push(newPath);
  };

  return (
    <button
      className="font-thin text-xs px-2 py-1 border opacity-75 hover:opacity-95"
      onClick={switchLocale}
    >
      {nextLocale.toUpperCase()}
    </button>
  );
}
