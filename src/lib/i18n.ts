export const locales = ["en", "zh"] as const;

export type AppLocale = (typeof locales)[number];

export const defaultLocale: AppLocale = "en";

export function isValidLocale(locale: string): locale is AppLocale {
  return locales.includes(locale as AppLocale);
}

export function localeToLabel(locale: AppLocale): string {
  return locale === "zh" ? "中文" : "EN";
}
