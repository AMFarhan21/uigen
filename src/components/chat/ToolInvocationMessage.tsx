"use client";

import { Loader2, Check, FileEdit, FilePlus, FileX, FileText, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ToolInvocationMessageProps {
  toolInvocation: {
    toolCallId: string;
    toolName: string;
    args: Record<string, unknown>;
    state: "partial-call" | "call" | "result";
    result?: unknown;
  };
}

function truncatePath(path: string, maxLength = 30): string {
  if (path.length <= maxLength) return path;
  const start = path.substring(0, 10);
  const end = path.substring(path.length - maxLength + 13);
  return `${start}...${end}`;
}

function getStrReplaceEditorMessage(args: Record<string, unknown>): {
  message: string;
  icon: typeof FileEdit;
} {
  const command = args.command as string;
  const path = (args.path as string) || "unknown";
  const truncatedPath = truncatePath(path);

  switch (command) {
    case "create":
      return {
        message: `Creating \`${truncatedPath}\``,
        icon: FilePlus,
      };
    case "str_replace":
      return {
        message: `Editing \`${truncatedPath}\``,
        icon: FileEdit,
      };
    case "insert":
      return {
        message: `Updating \`${truncatedPath}\``,
        icon: FileEdit,
      };
    case "view":
      return {
        message: `Reading \`${truncatedPath}\``,
        icon: FileText,
      };
    case "undo_edit":
      return {
        message: `Reverting \`${truncatedPath}\``,
        icon: FileEdit,
      };
    default:
      return {
        message: `Modifying \`${truncatedPath}\``,
        icon: FileEdit,
      };
  }
}

function getFileManagerMessage(args: Record<string, unknown>): {
  message: string;
  icon: typeof FileEdit;
} {
  const command = args.command as string;
  const path = (args.path as string) || "unknown";
  const newPath = args.new_path as string | undefined;
  const truncatedPath = truncatePath(path);

  switch (command) {
    case "rename":
      return {
        message: newPath
          ? `Renaming \`${truncatedPath}\` to \`${truncatePath(newPath)}\``
          : `Renaming \`${truncatedPath}\``,
        icon: ArrowRight,
      };
    case "delete":
      return {
        message: `Deleting \`${truncatedPath}\``,
        icon: FileX,
      };
    default:
      return {
        message: `Managing \`${truncatedPath}\``,
        icon: FileEdit,
      };
  }
}

function getToolMessage(toolName: string, args: Record<string, unknown>): {
  message: string;
  icon: typeof FileEdit;
} {
  switch (toolName) {
    case "str_replace_editor":
      return getStrReplaceEditorMessage(args);
    case "file_manager":
      return getFileManagerMessage(args);
    default:
      return {
        message: `Running \`${toolName}\``,
        icon: FileEdit,
      };
  }
}

export function ToolInvocationMessage({
  toolInvocation,
}: ToolInvocationMessageProps) {
  const { toolName, args, state } = toolInvocation;
  const isComplete = state === "result";
  const { message, icon: Icon } = getToolMessage(toolName, args);

  return (
    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-neutral-50 rounded-lg text-xs font-mono border border-neutral-200">
      {isComplete ? (
        <Check className="w-3 h-3 text-emerald-500" />
      ) : (
        <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
      )}
      <span className="text-neutral-700 flex items-center gap-1.5">
        <Icon className="w-3 h-3" />
        {message}
      </span>
    </div>
  );
}
