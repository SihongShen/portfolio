"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useReducer, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { projects } from "@/data/projects";
import { type AppLocale } from "@/lib/i18n";
import { parseCommand } from "@/lib/commands";
import type { Command, ContactFlowState, TerminalLine, TerminalState } from "@/types/terminal";
import { buildCommands } from "./commands";
import TerminalBody from "./TerminalBody";
import TerminalHeader from "./TerminalHeader";
import TerminalInput from "./TerminalInput";

interface TerminalProps {
  locale: AppLocale;
  welcomeLines?: string[];
  floating?: boolean;
  onLocaleChange: (locale: AppLocale) => void;
  onClose?: () => void;
}

type FloatingTerminalState = "docked" | "expanded";
const TERMINAL_STORAGE_KEY = "portfolio-terminal-state-v1";
const TERMINAL_WELCOME_VERSION_KEY = "portfolio-terminal-welcome-version-v1";

type TerminalAction =
  | { type: "push"; line: Omit<TerminalLine, "id"> }
  | { type: "clear" }
  | { type: "history"; value: string }
  | { type: "historyIndex"; value: number }
  | { type: "hydrate"; value: TerminalState }
  | { type: "replaceWelcome"; welcomeLines: string[] };

const initialState: TerminalState = {
  lines: [],
  commandHistory: [],
  historyIndex: -1
};

function terminalReducer(state: TerminalState, action: TerminalAction): TerminalState {
  if (action.type === "hydrate") {
    // Never restore a mid-history cursor — ArrowUp should start from the latest command.
    return { ...action.value, historyIndex: -1 };
  }

  if (action.type === "replaceWelcome") {
    const firstNonSystemIndex = state.lines.findIndex((line) => line.type !== "system");
    const remainingLines = firstNonSystemIndex < 0 ? [] : state.lines.slice(firstNonSystemIndex);
    const welcome = action.welcomeLines.map((content, index) => ({
      id: index + 1,
      type: "system" as const,
      content
    }));
    const nextLines = [...welcome, ...remainingLines.map((line, index) => ({ ...line, id: welcome.length + index + 1 }))];

    return {
      ...state,
      lines: nextLines
    };
  }

  if (action.type === "push") {
    const lastId = state.lines[state.lines.length - 1]?.id ?? 0;
    return {
      ...state,
      lines: [...state.lines, { id: lastId + 1, ...action.line }]
    };
  }

  if (action.type === "clear") {
    return { ...state, lines: [], commandHistory: [], historyIndex: -1 };
  }

  if (action.type === "history") {
    return {
      ...state,
      commandHistory: [...state.commandHistory, action.value],
      historyIndex: -1
    };
  }

  return {
    ...state,
    historyIndex: action.value
  };
}

const initialContactState: ContactFlowState = {
  active: false,
  step: "platform_selection",
};

export default function Terminal({ locale, welcomeLines, floating = false, onLocaleChange, onClose }: TerminalProps) {
  const router = useRouter();
  const [state, dispatch] = useReducer(terminalReducer, initialState);
  const [contactFlow, setContactFlow] = useState<ContactFlowState>(initialContactState);
  const [floatingState, setFloatingState] = useState<FloatingTerminalState>("docked");
  const [hydrated, setHydrated] = useState(false);
  const [drag, setDrag] = useState({ x: 0, y: 0 });
  const dragPointer = useRef<{ startX: number; startY: number; originX: number; originY: number } | null>(null);
  const isDraggingRef = useRef(false);
  const isHoveredRef = useRef(false);
  const terminalBoxRef = useRef<HTMLDivElement>(null);

  const focusInput = () => {
    // Don't steal focus while the user is selecting text to copy.
    const selection = window.getSelection();
    if (selection && !selection.isCollapsed) {
      return;
    }

    terminalBoxRef.current?.querySelector("input")?.focus();
  };

  const projectTags = useMemo(
    () => Array.from(new Set(projects.flatMap((project) => project.tags))).sort((a, b) => a.localeCompare(b)),
    []
  );

  const commands = useMemo<Command[]>(
    () =>
      buildCommands({
        locale,
        navigate: (path) => router.push(path),
        switchLocale: onLocaleChange,
        projectTags
      }),
    [locale, onLocaleChange, projectTags, router]
  );

  const commandMap = useMemo(() => new Map(commands.map((command) => [command.name, command])), [commands]);
  const welcomeVersion = useMemo(() => welcomeLines?.join("\n") ?? "", [welcomeLines]);

  useEffect(() => {
    const raw = localStorage.getItem(TERMINAL_STORAGE_KEY);
    if (!raw) {
      setHydrated(true);
      return;
    }

    try {
      const parsed = JSON.parse(raw) as TerminalState & { contactActive?: boolean };
      if (Array.isArray(parsed.lines) && Array.isArray(parsed.commandHistory) && typeof parsed.historyIndex === "number") {
        dispatch({ type: "hydrate", value: parsed });
        // Restore an in-progress contact flow so the persisted platform prompt still works.
        if (parsed.contactActive) {
          setContactFlow({ ...initialContactState, active: true });
        }
      }
    } catch {
      localStorage.removeItem(TERMINAL_STORAGE_KEY);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    if (!state.lines.length && welcomeLines?.length) {
      welcomeLines.forEach((line) => {
        dispatch({ type: "push", line: { type: "system", content: line } });
      });
      localStorage.setItem(TERMINAL_WELCOME_VERSION_KEY, welcomeVersion);
      return;
    }

    if (!welcomeLines?.length) {
      return;
    }

    const storedWelcomeVersion = localStorage.getItem(TERMINAL_WELCOME_VERSION_KEY) ?? "";
    if (storedWelcomeVersion !== welcomeVersion) {
      dispatch({ type: "replaceWelcome", welcomeLines });
      localStorage.setItem(TERMINAL_WELCOME_VERSION_KEY, welcomeVersion);
    }
  }, [hydrated, state.lines.length, welcomeLines, welcomeVersion]);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    try {
      // Cap what we persist so years of history can't outgrow the storage quota.
      const persisted = {
        ...state,
        lines: state.lines.slice(-200),
        commandHistory: state.commandHistory.slice(-100),
        contactActive: contactFlow.active
      };
      localStorage.setItem(TERMINAL_STORAGE_KEY, JSON.stringify(persisted));
    } catch {
      // Storage full or unavailable — the terminal still works, just without persistence.
    }
  }, [contactFlow.active, hydrated, state]);

  const handleCommand = (rawInput: string) => {
    const input = rawInput.trim();
    dispatch({ type: "push", line: { type: "input", content: `> ${input}` } });

    if (!input) {
      return;
    }

    dispatch({ type: "history", value: input });

    if (contactFlow.active) {
      if (contactFlow.step === "platform_selection") {
        const platform = input.toLowerCase();
        
        switch (platform) {
          case "cancel":
          case "exit":
          case "q":
            dispatch({ type: "push", line: { type: "output", content: locale === "zh" ? "已退出联系方式流程。" : "Contact flow cancelled." } });
            setContactFlow(initialContactState);
            break;
          case "e-mail":
          case "email":
            dispatch({ type: "push", line: { type: "output", content: "ss18264@nyu.edu" } });
            setContactFlow(initialContactState);
            break;
          case "github":
            // Print the URL first so it survives a blocked popup.
            dispatch({ type: "push", line: { type: "output", content: "> Redirecting to Github... (https://github.com/SihongShen)" } });
            window.open("https://github.com/SihongShen", "_blank");
            setContactFlow(initialContactState);
            break;
          case "linkedin":
            dispatch({ type: "push", line: { type: "output", content: "> Redirecting to LinkedIn... (https://linkedin.com/in/sihongshen)" } });
            window.open("https://linkedin.com/in/sihongshen", "_blank");
            setContactFlow(initialContactState);
            break;
          case "小红书":
          case "xhs":
          case "xiaohongshu":
            dispatch({ type: "push", line: { type: "output", content: "> Redirecting to 小红书... (https://www.xiaohongshu.com/user/profile/6520f0f1000000002402f4ad)" } });
            window.open("https://www.xiaohongshu.com/user/profile/6520f0f1000000002402f4ad", "_blank");
            setContactFlow(initialContactState);
            break;
          default:
            dispatch({ type: "push", line: { type: "error", content: locale === "zh" ? `未知平台: ${input}。请输入 'e-mail'、'Github'、'Linkedin' 或 '小红书',输入 'cancel' 退出。` : `Unknown platform: ${input}. Please enter 'e-mail', 'Github', 'Linkedin', or '小红书' — or type 'cancel' to exit.` } });
            break;
        }
        return;
      }
    }

    const { command: commandName, args } = parseCommand(input);
    const command = commandMap.get(commandName);

    if (!command) {
      dispatch({ type: "push", line: { type: "error", content: `command not found: ${commandName}` } });
      return;
    }

    const result = command.execute(args);

    if (result === "__CLEAR__") {
      // The save effect persists the cleared state; no need to touch localStorage here.
      dispatch({ type: "clear" });
      return;
    }

    if (commandName === "contact") {
      setContactFlow({ ...initialContactState, active: true });
    }

    dispatch({ type: "push", line: { type: "output", content: result } });
  };

  const handleHistory = (direction: "up" | "down") => {
    if (!state.commandHistory.length) {
      return "";
    }

    const current = state.historyIndex;
    if (direction === "up") {
      const nextIndex = current < 0 ? state.commandHistory.length - 1 : Math.max(0, current - 1);
      dispatch({ type: "historyIndex", value: nextIndex });
      return state.commandHistory[nextIndex] ?? "";
    }

    if (current < 0) {
      return "";
    }

    const nextIndex = current + 1;
    if (nextIndex >= state.commandHistory.length) {
      dispatch({ type: "historyIndex", value: -1 });
      return "";
    }

    dispatch({ type: "historyIndex", value: nextIndex });
    return state.commandHistory[nextIndex] ?? "";
  };

  const handleCancel = () => {
    if (!contactFlow.active) {
      return;
    }

    setContactFlow(initialContactState);
    dispatch({ type: "push", line: { type: "output", content: "^C" } });
    dispatch({ type: "push", line: { type: "output", content: "Contact flow cancelled." } });
  };

  const wrapperClasses =
    !floating
      ? "fixed inset-0 z-50 flex items-center justify-center"
      : floatingState === "expanded"
        ? "fixed right-6 top-24 z-40"
        : "fixed right-6 top-24 z-30";

  const terminalSizeClasses =
    !floating
      ? "h-[min(72vh,680px)] w-[min(960px,92vw)]"
      : floatingState === "expanded"
        ? "h-[420px] w-[min(760px,78vw)]"
        : "h-[260px] w-[320px]";

  return (
    <AnimatePresence>
      <motion.div
        initial={floating ? { opacity: 0, scale: 0.9 } : { opacity: 1, scale: 1 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className={wrapperClasses}
        onMouseEnter={() => {
          isHoveredRef.current = true;
          if (floating && floatingState === "docked") {
            setFloatingState("expanded");
          }
        }}
        onMouseLeave={() => {
          isHoveredRef.current = false;
          // Only shrink back if we are not currently dragging it
          if (floating && floatingState === "expanded" && !isDraggingRef.current) {
            setFloatingState("docked");
          }
        }}
      >
        <motion.div
          ref={terminalBoxRef}
          className={`flex ${terminalSizeClasses} flex-col border border-[var(--terminal-primary)] bg-black/95 transition-all duration-300 ease-out`}
          animate={!floating ? { x: 0, y: 0 } : { x: drag.x, y: drag.y }}
          onClick={focusInput}
        >
          <TerminalHeader
            onClose={onClose}
            onDragStart={
              floating
                ? (event) => {
                    if (event.button !== 0) {
                      return;
                    }

                    // Stop the drag from rubber-band-selecting the header text.
                    event.preventDefault();
                    isDraggingRef.current = true;
                    // Prevent grabbing from turning it off if we just want to drag
                    dragPointer.current = {
                      startX: event.clientX,
                      startY: event.clientY,
                      originX: drag.x,
                      originY: drag.y
                    };

                    const move = (moveEvent: PointerEvent) => {
                      if (!dragPointer.current) {
                        return;
                      }

                      const dx = moveEvent.clientX - dragPointer.current.startX;
                      const dy = moveEvent.clientY - dragPointer.current.startY;
                      setDrag({ x: dragPointer.current.originX + dx, y: dragPointer.current.originY + dy });
                    };

                    const up = () => {
                      isDraggingRef.current = false;
                      // If hover was lost while dragging, we shrink it now
                      if (!isHoveredRef.current && floating) {
                        setFloatingState("docked");
                      }
                      window.removeEventListener("pointermove", move);
                      window.removeEventListener("pointerup", up);
                      window.removeEventListener("pointercancel", up);
                    };

                    window.addEventListener("pointermove", move);
                    window.addEventListener("pointerup", up);
                    window.addEventListener("pointercancel", up);
                  }
                : undefined
            }
          />
          <TerminalBody lines={state.lines} />
          <TerminalInput
            prompt={contactFlow.active ? `platform>` : "$"}
            canCancel={contactFlow.active}
            completions={commands.map((command) => command.name)}
            onSubmit={(value) => {
              handleCommand(value);
            }}
            onHistory={handleHistory}
            onCancel={handleCancel}
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
