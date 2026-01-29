import { usePathname } from "next/navigation";

export function useLocale() {
    const pathname = usePathname();
    return pathname.split("/")[1] || "pt"
}

// export function withLocale(path: string, locale: string) {
//       const { locale } = useParams();
    
//     return `/${locale}${path.startsWith("/") ? "" : "/"}${path}`
// }