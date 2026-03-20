import type { AppLocale } from "@/lib/i18n";
import type { Command } from "@/types/terminal";

interface BuildCommandsOptions {
  locale: AppLocale;
  navigate: (path: string) => void;
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
    name: "about",
    description: locale === "zh" ? "跳转 about 页面" : "Go to about page",
    execute: () => {
      navigate(`/${locale}/about`);
      return locale === "zh"
        ? "正在打开 About 页面… 终端将保持内容。"
        : "Opening About page... terminal history is preserved.";
    }
  });

  commands.push({
    name: "projects",
    description: locale === "zh" ? "跳转项目页并显示标签" : "Go to projects page with tags",
    execute: () => {
      navigate(`/${locale}/projects`);
      const prefix = locale === "zh" ? "正在打开 Projects 页面。可用标签: " : "Opening Projects page. Available tags: ";
      return `${prefix}${projectTags.join(", ")}`;
    }
  });

  commands.push({
    name: "contact",
    description: locale === "zh" ? "显示联系方式并进入交互" : "Show contact details and start interactive mode",
    execute: () =>
      [
        "Let’s get in touch.",
        "email: iris@example.com",
        "github: github.com/iris",
        "linkedin: linkedin.com/in/iris",
        "小红书: @iris-portfolio",
        "Interactive contact flow started..."
      ].join("\n")
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
      switchLocale(nextLocale);
      localStorage.setItem("preferred-locale", nextLocale);
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
