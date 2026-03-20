interface BlogDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;

  return (
    <main className="min-h-screen bg-black px-6 py-24 text-[var(--terminal-primary)]">
      <h1 className="mb-4 text-3xl">{slug}</h1>
      <p>MDX detail placeholder. This route is reserved for next-mdx-remote integration.</p>
    </main>
  );
}
