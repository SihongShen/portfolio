import type { AppLocale } from "@/lib/i18n";
import type { Command } from "@/types/terminal";

interface BuildCommandsOptions {
  locale: AppLocale;
  // With successMessage, navigation is delayed briefly and the message is
  // printed at the moment the route actually changes.
  navigate: (path: string, successMessage?: string) => void;
  switchLocale: (locale: AppLocale) => void;
  projectTags: string[];
}

export function buildCommands({ locale, navigate, switchLocale, projectTags }: BuildCommandsOptions): Command[] {
  const commands: Command[] = [];

  commands.push({
    name: "help",
    description: locale === "zh" ? "列出所有可用命令" : "List all available commands",
    execute: () => commands.map((command) => `${command.name} — ${command.description}`).join("\n")
  });

  commands.push({
    name: "home",
    description: locale === "zh" ? "回到终端主页" : "Back to the terminal home",
    execute: () => {
      navigate(`/${locale}`, locale === "zh" ? "> 成功返回" : "> Welcome back");
      return locale === "zh" ? "正在返回主页…" : "Heading home...";
    }
  });

  commands.push({
    name: "about",
    description: locale === "zh" ? "了解关于我的信息" : "Go to about page",
    execute: () => {
      navigate(`/${locale}/about`, locale === "zh" ? "> 成功打开" : "> Successfully opened");
      return locale === "zh" ? "正在打开 关于我 页面…" : "Opening About Me page...";
    }
  });

  commands.push({
    name: "projects",
    description: locale === "zh" ? "查看我的项目: projects [tag]" : "Check out my projects: projects [tag]",
    execute: (args: string[]) => {
      if (args.length > 0) {
        const query = args.join(" ").toLowerCase();
        const matched =
          projectTags.find((tag) => tag.toLowerCase() === query) ??
          projectTags.find((tag) => tag.toLowerCase().startsWith(query));

        if (!matched) {
          return locale === "zh"
            ? `未找到 tag: ${args.join(" ")}\n> 可用 tags: ${projectTags.join(", ")}`
            : `Unknown tag: ${args.join(" ")}\nAvailable tags: ${projectTags.join(", ")}`;
        }

        navigate(
          `/${locale}/projects?tag=${encodeURIComponent(matched)}`,
          locale === "zh" ? "> 成功打开" : "> Successfully opened"
        );
        return locale === "zh" ? `正在打开 #${matched} 的筛选结果…` : `Opening projects filtered by #${matched}...`;
      }

      navigate(`/${locale}/projects`, locale === "zh" ? "> 成功打开" : "> Successfully opened");
      return locale === "zh" ? "正在打开 我的项目 页面…" : "Opening Projects page...";
    }
  });

  commands.push({
    name: "contact",
    description: locale === "zh" ? "查看我的联系方式" : "Show contact details",
    execute: () => {
      return `  e-mail | Github | Linkedin | 小红书
> ${locale === "zh" ? "请输入以上任意平台名称获取详情 (如: Github),输入 cancel 退出" : "Please enter any platform name above to get details (e.g. Github), or type 'cancel' to exit"}`;
    }
  });

  commands.push({
    name: "clear",
    description: locale === "zh" ? "清空终端历史" : "Clear terminal history",
    execute: () => "__CLEAR__"
  });

  commands.push({
    name: "lang",
    description: locale === "zh" ? "切换语言: lang en|zh" : "Switch language: lang en|zh",
    execute: (args: string[]): string => {
      const value = args[0]?.toLowerCase();
      if (!value) {
        return locale === "zh" ? "用法: lang en|zh" : "Usage: lang en|zh";
      }

      if (value !== "en" && value !== "zh") {
        return locale === "zh" ? "仅支持 en 或 zh" : "Only en or zh is supported";
      }

      const nextLocale = value as AppLocale;
      // switchLocale implementations persist the choice (NEXT_LOCALE cookie).
      switchLocale(nextLocale);
      return locale === "zh" ? `语言已切换为 ${nextLocale}` : `Language switched to ${nextLocale}`;
    }
  });

  commands.push({
    name: "echo",
    description: locale === "zh" ? "回显文本: echo [text]" : "Echo text: echo [text]",
    execute: (args: string[]) => args.join(" ") || (locale === "zh" ? "请输入要回显的文本" : "Please enter text to echo")
  });

  return commands;
}
