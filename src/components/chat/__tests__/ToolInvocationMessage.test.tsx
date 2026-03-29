import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ToolInvocationMessage } from "../ToolInvocationMessage";

afterEach(cleanup);

test("shows loading spinner when tool is in call state", () => {
  const toolInvocation = {
    toolCallId: "1",
    toolName: "str_replace_editor",
    args: { command: "create", path: "/App.jsx" },
    state: "call" as const,
  };

  render(<ToolInvocationMessage toolInvocation={toolInvocation} />);

  const spinner = document.querySelector(".animate-spin");
  expect(spinner).toBeDefined();
});

test("shows checkmark when tool is in result state", () => {
  const toolInvocation = {
    toolCallId: "1",
    toolName: "str_replace_editor",
    args: { command: "create", path: "/App.jsx" },
    state: "result" as const,
    result: "Success",
  };

  render(<ToolInvocationMessage toolInvocation={toolInvocation} />);

  expect(screen.getByText("Creating `/App.jsx`")).toBeDefined();
  const spinner = document.querySelector(".animate-spin");
  expect(spinner).toBeNull();
});

test("shows 'Creating' message for str_replace_editor with create command", () => {
  const toolInvocation = {
    toolCallId: "1",
    toolName: "str_replace_editor",
    args: { command: "create", path: "/components/Button.jsx" },
    state: "result" as const,
    result: "Success",
  };

  render(<ToolInvocationMessage toolInvocation={toolInvocation} />);

  expect(screen.getByText("Creating `/components/Button.jsx`")).toBeDefined();
});

test("shows 'Editing' message for str_replace_editor with str_replace command", () => {
  const toolInvocation = {
    toolCallId: "1",
    toolName: "str_replace_editor",
    args: { command: "str_replace", path: "/App.jsx" },
    state: "result" as const,
    result: "Success",
  };

  render(<ToolInvocationMessage toolInvocation={toolInvocation} />);

  expect(screen.getByText("Editing `/App.jsx`")).toBeDefined();
});

test("shows 'Updating' message for str_replace_editor with insert command", () => {
  const toolInvocation = {
    toolCallId: "1",
    toolName: "str_replace_editor",
    args: { command: "insert", path: "/App.jsx", insert_line: 5 },
    state: "result" as const,
    result: "Success",
  };

  render(<ToolInvocationMessage toolInvocation={toolInvocation} />);

  expect(screen.getByText("Updating `/App.jsx`")).toBeDefined();
});

test("shows 'Reading' message for str_replace_editor with view command", () => {
  const toolInvocation = {
    toolCallId: "1",
    toolName: "str_replace_editor",
    args: { command: "view", path: "/App.jsx" },
    state: "result" as const,
    result: "File content...",
  };

  render(<ToolInvocationMessage toolInvocation={toolInvocation} />);

  expect(screen.getByText("Reading `/App.jsx`")).toBeDefined();
});

test("shows 'Renaming' message for file_manager with rename command", () => {
  const toolInvocation = {
    toolCallId: "1",
    toolName: "file_manager",
    args: { command: "rename", path: "/Old.jsx", new_path: "/New.jsx" },
    state: "result" as const,
    result: { success: true },
  };

  render(<ToolInvocationMessage toolInvocation={toolInvocation} />);

  expect(screen.getByText("Renaming `/Old.jsx` to `/New.jsx`")).toBeDefined();
});

test("shows 'Deleting' message for file_manager with delete command", () => {
  const toolInvocation = {
    toolCallId: "1",
    toolName: "file_manager",
    args: { command: "delete", path: "/components/Old.jsx" },
    state: "result" as const,
    result: { success: true },
  };

  render(<ToolInvocationMessage toolInvocation={toolInvocation} />);

  expect(screen.getByText("Deleting `/components/Old.jsx`")).toBeDefined();
});

test("truncates long paths", () => {
  const toolInvocation = {
    toolCallId: "1",
    toolName: "str_replace_editor",
    args: {
      command: "create",
      path: "/components/very/deeply/nested/folder/structure/LongComponentName.jsx",
    },
    state: "result" as const,
    result: "Success",
  };

  render(<ToolInvocationMessage toolInvocation={toolInvocation} />);

  const text = screen.getByText(/Creating/).textContent;
  expect(text).toContain("...");
  expect(text).toContain(".jsx");
});

test("shows fallback message for unknown tool", () => {
  const toolInvocation = {
    toolCallId: "1",
    toolName: "unknown_tool",
    args: {},
    state: "result" as const,
    result: "Success",
  };

  render(<ToolInvocationMessage toolInvocation={toolInvocation} />);

  expect(screen.getByText("Running `unknown_tool`")).toBeDefined();
});

test("shows generic message for unknown command in str_replace_editor", () => {
  const toolInvocation = {
    toolCallId: "1",
    toolName: "str_replace_editor",
    args: { command: "unknown", path: "/App.jsx" },
    state: "result" as const,
    result: "Success",
  };

  render(<ToolInvocationMessage toolInvocation={toolInvocation} />);

  expect(screen.getByText("Modifying `/App.jsx`")).toBeDefined();
});
