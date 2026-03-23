export interface ProjectItem {
  id: string;
  name: { en: string; zh: string };
  date: string; // 时间通常无需双语，如 "2026-02"
  techStack: string[]; // 技术栈如 "Next.js" 通常通用
  tags: string[]; // tag可以作为 key 进行通用，也可以配双语，这里简单起见可以是通用的标识符，UI上映射或者直接用纯英文短语
  description: { en: string; zh: string };
  documentationVideo?: string; // 视频链接可选并且通常通用
  featuredImage?: string; // 可选图片字段
  hasContent?: boolean; // 标志是否需要从 MDX 读取长内容
}

export const projects: ProjectItem[] = [
  {
    id: "self-woven-shackles",
    name: { en: "Self-Woven Shackles", zh: "自织枷锁" },
    date: "2024-05",
    techStack: ["剪映"],
    tags: ["video", "stories", "experimental", "stange core"],
    description: { 
      en: "A nightmarish journey into the essence of existence, reimaging the struggele for self-meaning through the philosophical lens of 'dying to live'.", 
      zh: "以一场超现实的噩梦，讨论个体从虚无主义到向死而生的自我思想挣扎。"
    },
    documentationVideo: "https://example.com/memo-space-video",
    hasContent: true
  }
];
