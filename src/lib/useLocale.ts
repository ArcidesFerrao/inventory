import { usePathname } from "next/navigation";

export function useLocale() {
    const pathname = usePathname();
    return pathname.split("/")[1] || "pt"
}
