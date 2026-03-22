export default function BlogListPage() {
  return (
    <div className="w-full min-h-screen text-[var(--terminal-primary)] flex flex-col">
      <header className="h-[72px] w-full shrink-0" />
      <main className="flex-1 w-full max-w-5xl mx-auto px-6 pb-16">
        <h1 className="mb-4 text-3xl">Blog</h1>
        <p>MDX blog list placeholder. Future posts will be loaded from /src/content/blog.</p>
      </main>
    </div>
  );
}
