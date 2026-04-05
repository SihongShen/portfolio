export interface ProjectItem {
  id: string;
  name: { en: string; zh: string };
  date: string; // 时间通常无需双语，如 "2026-02"
  techStack: string[]; // 技术栈如 "Next.js"
  tags: string[]; // tag可以作为 key 进行通用，也可以配双语，这里简单起见可以是通用的标识符，UI上映射或者直接用纯英文短语
  description: { en: string; zh: string };
  documentationVideo?: string; // 视频链接可选
  repoLink?: string; // GitHub 或其他仓库链接可选
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
    hasContent: true
  },
  {
    id: "music-party",
    name: { en: "Music Party", zh: "音乐派对" },
    date: "2025-09",
    techStack: ["p5.js", "ml5.js", "Tone.js", "Web Audio API"],
    tags: ["machine learning", "music", "web installation"],
    description: { 
      en: "An interactive web installation that uses machile learning to trigger and manipulate music based on user positions and movements, creating a collaborative and interesting musical experience.", 
      zh: "一个互动式网络装置，利用机器学习根据用户的位置和动作触发和操控音乐，创造一个协作且有趣的音乐体验。"
    },
    documentationVideo: "https://editor.p5js.org/SihongShen/sketches/ny8Iz_9Py",
    hasContent: true
  },
  {
    id: "before-the-trial",
    name: { en: "Before the Trial", zh: "审判降临前" },
    date: "2025-05",
    techStack: ["p5.js", "webGL", "P5Live", "P5Speech", "Hydra", "Strudel"],
    tags: ["live coding", "interactive storytelling", "game", "live performance"],
    description: { 
      en: "An audiovisual performance guided by audiences’ choices, directed and performed by me.", 
      zh: "一个由观众选择引导的视听表演，由我导演和表演。"
    },
    documentationVideo:"https://drive.google.com/file/d/1jZPHAahmByYjxsLKQ_rVETLd82V4HNeg/view?usp=drive_link",
    repoLink: "https://github.com/SihongShen/Live_Coding/tree/main/Before_the_trial",
    hasContent: true
  },
  {
    id: "muryo-memo",
    name: { en: "Muryo Memo", zh: "無料MEMO" },
    date: "2025-11",
    techStack: ["React", "css", "JavaScript", "matter.js", "node.js", "express", "MongoDB", "CORS", "eslint", "DigitalOcean"],
    tags: ["Fullstack development", "product engineering", "web app", "product design"],
    description: { 
      en: "A web app designed for comic lovers to document and share their own fanart products.", 
      zh: "一个为二次元爱好者设计的 web 应用，帮助他们记录和分享自己的同人制品。"
    },
    documentationVideo: "https://drive.google.com/file/d/1RoU8PzViw_pFcurafTWorlggl7zeY6QF/view?usp=drive_link",
    repoLink: "https://github.com/SihongShen/Muryo",
    hasContent: true
  },
  {
    id: "monomyth-exe",
    name: { en: "MONOMYTH.exe", zh: "MONOMYTH.exe" },
    date: "2025-12",
    techStack: ["React", "JavaScript", "Tailwind CSS", "node.js", "Vite", "Gemini API", "MediaPipe", "Vercel", "eslint", "html2pdf"],
    tags: ["Interactive storytelling", "game", "Frontend development", "web app", "interactive design"],
    description: { 
      en: "An interactive web game that uses Gemini API and Mediapipe hand model to generate a personalized “hero’s journey” myth based on a single word provided by the user.", 
      zh: "一个互动式网页游戏，使用 Gemini API 和 Mediapipe 手部模型，根据用户提供的单词生成个性化的“英雄之旅”神话故事。"
    },
    documentationVideo: "https://monomyth.vercel.app",
    repoLink: "https://github.com/SihongShen/MONOMYTH.exe",
    hasContent: true
  },
  {
    id: "thyself",
    name: { en: "Thyself", zh: "Thyself" },
    date: "2026-2",
    techStack: ["React", "JavaScript", "Tailwind CSS", "next.js", "Vite", "ECharts", "FAST API", "Vercel"],
    tags: ["Frontend development", "web app", "data visualization", "interactive design"],
    description: { 
      en: "A website that recommends high-quality articles tailored to each user's interests.", 
      zh: "一个根据每个用户兴趣推荐优质文章的网站。"
    },
    documentationVideo: "https://thyself-rose.vercel.app",
    hasContent: true
  },
];
