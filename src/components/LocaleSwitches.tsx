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

  return <button onClick={switchLocale}>{nextLocale.toUpperCase()}</button>;
}
