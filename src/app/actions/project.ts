"use server";

import fs from "fs";
import path from "path";
import { serialize } from "next-mdx-remote/serialize";

export async function getProjectMdxSerialized(projectId: string, locale: string) {
  try {
    const filePath = path.join(process.cwd(), "src/content/projects", locale, `${projectId}.mdx`);
    if (!fs.existsSync(filePath)) {
      // Fallback to en
      const fallbackPath = path.join(process.cwd(), "src/content/projects", "en", `${projectId}.mdx`);
      if (!fs.existsSync(fallbackPath)) {
        return { success: false };
      }
      const source = fs.readFileSync(fallbackPath, "utf-8");
      const compiled = await serialize(source);
      return { success: true, compiled };
    }
    const source = fs.readFileSync(filePath, "utf-8");
    const compiled = await serialize(source);
    return { success: true, compiled };
  } catch (err) {
    console.error("MDX Serialize Error:", err);
    return { success: false };
  }
}
