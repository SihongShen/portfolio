import { notFound } from "next/navigation";

// No posts exist yet — every slug is a real 404 until content lands in
// /src/content/blog and this route gets its mdx integration.
export default async function BlogDetailPage() {
  notFound();
}
