// import { notFound } from "next/navigation"
import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

// export const locales = ['pt', 'en'] as const
// export const defaultLocale = 'pt'

export default getRequestConfig(async ({ requestLocale }) => {
    // if (!locales.includes(locale as (typeof locales)[number])) {
    //     notFound()
    // }

    const requested = await requestLocale;
    const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;
    const messages = (await import(`../../messages/${locale}.json`)).default


    return {
        locale,
        messages
    }
} )