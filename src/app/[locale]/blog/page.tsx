import { getTranslations } from "next-intl/server";

export default async function BlogListPage() {
  const t = await getTranslations("blog");

  return (
    <div className="w-full min-h-screen text-[var(--terminal-primary)] flex flex-col">
      <header className="h-[72px] w-full shrink-0" />
      <main className="flex-1 w-full max-w-5xl mx-auto px-6 pb-16">
        <h1 className="mb-4 text-3xl">{t("title")}</h1>
        <p>{t("placeholder")}</p>
      </main>
    </div>
  );
}
