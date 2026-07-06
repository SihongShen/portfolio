export const locales = ["en", "zh"] as const;

export type AppLocale = (typeof locales)[number];

export const defaultLocale: AppLocale = "en";

export function isValidLocale(locale: string): locale is AppLocale {
  return locales.includes(locale as AppLocale);
}

export function localeToLabel(locale: AppLocale): string {
  return locale === "zh" ? "中文" : "EN";
}

// Persist the choice for the next-intl middleware, which reads NEXT_LOCALE
// when negotiating the locale for unprefixed paths like /.
export function rememberLocale(locale: AppLocale): void {
  if (typeof document !== "undefined") {
    document.cookie = `NEXT_LOCALE=${locale};path=/;max-age=31536000;samesite=lax`;
  }
}
