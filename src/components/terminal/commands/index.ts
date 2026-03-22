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
    description: locale === "zh" ? "了解关于我的信息" : "Go to about page",
    execute: () => {
      navigate(`/${locale}/about`);
      return locale === "zh"
        ? "正在打开 关于我 页面…\n 成功打开"
        : "Opening About Me page...\nSuccessfully opened";
    }
  });

  commands.push({
    name: "projects",
    description: locale === "zh" ? "查看我的项目" : "Check out my projects",
    execute: () => {
      navigate(`/${locale}/projects`);
      const tagsStr = projectTags.length > 0 ? projectTags.join(", ") : "None";
      return locale === "zh" 
        ? `正在打开 我的项目 页面…\n> 成功打开\n> 可用的搜索tag: ${tagsStr}` 
        : `Opening Projects page...\nSuccessfully opened\nAvailable tags for searching: ${tagsStr}`;
    }
  });

  commands.push({
    name: "contact",
    description: locale === "zh" ? "查看我的联系方式" : "Show contact details",
    execute: () => {
      return `  e-mail | Github | Linkedin | 小红书
> ${locale === "zh" ? "请输入以上任意平台名称获取详情 (如: Github)" : "Please enter any platform name above to get details (e.g. Github)"}`;
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
