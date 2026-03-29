# Agent Instructions for UIGen

AI-powered React component generator with live preview built with Next.js 15, React 19, TypeScript, Tailwind CSS v4, Prisma, and Anthropic Claude.

## Build Commands

```bash
npm run dev           # Start development server with Turbopack
npm run dev:daemon    # Start server in background (logs to logs.txt)
npm run build         # Build for production
npm run start         # Start production server
npm run lint          # Run ESLint
npm run test          # Run all tests (watch mode)
npm run test -- --run # Run all tests once (CI mode)
```

### Running a Single Test

```bash
npm run test -- --run src/lib/__tests__/file-system.test.ts  # Single file
npm run test -- --run MessageList                            # By test name
npm run test -- --run --reporter=verbose                    # Verbose output
```

## Project Structure

```
src/
├── actions/          # Server Actions ("use server")
├── app/              # Next.js App Router
│   ├── api/          # API routes
│   └── [projectId]/  # Dynamic routes
├── components/
│   ├── ui/           # Shadcn/ui components
│   ├── chat/         # Chat components
│   └── editor/       # Code editor components
├── hooks/            # Custom React hooks
├── lib/
│   ├── contexts/     # React contexts
│   ├── tools/        # AI tool implementations
│   └── transform/    # Code transformation utilities
└── middleware.ts     # Auth middleware
```

## Code Style Guidelines

### TypeScript
- **Strict mode enabled** - no implicit any, strict null checks
- Use `interface` for object shapes, `type` for unions/intersections
- Use `Record<string, T>` over plain objects when appropriate

### Naming Conventions
| Type | Convention | Example |
|------|------------|---------|
| Files | kebab-case | `file-system.ts`, `chat-context.tsx` |
| Components | PascalCase | `ChatInterface.tsx`, `MessageList.tsx` |
| Functions/Variables | camelCase | `handleSubmit`, `isLoading` |
| Constants | SCREAMING_SNAKE_CASE | `MAX_RETRIES` |
| Types/Interfaces | PascalCase | `SessionPayload` |

### Imports
Use `@/` path alias for internal imports. Group: external → internal → relative.
```typescript
import { useState } from "react";
import { clsx } from "clsx";
import { cn } from "@/lib/utils";
import { useChat } from "@/lib/contexts/chat-context";
import { MessageList } from "./MessageList";
```
- Named exports for utilities
- Default exports for React components

### React Components
- Function components only
- `"use client"` directive for client-side components
- `"use server"` directive for Server Actions
```tsx
"use client";

interface ComponentProps {
  title: string;
  onSubmit: () => void;
}

export function MyComponent({ title, onSubmit }: ComponentProps) {
  return <button onClick={onSubmit}>{title}</button>;
}
```

### Error Handling
- Use `try/catch` for async operations
- Return `null` for operations that may fail without throwing
- Throw `Error` objects, not strings
```typescript
try {
  const result = await prisma.user.findUnique({ where: { id } });
  return result;
} catch (error) {
  console.error("Failed to fetch user:", error);
  return null;
}
```

### Tailwind CSS
- Tailwind v4 syntax (CSS-based, no config file)
- Use `cn()` utility for conditional classes
- Prefer Tailwind's built-in colors
```tsx
<div className="flex items-center justify-between p-4">
  <Button variant="default" size="sm" />
</div>
```

### Testing
- Place test files in `__tests__` subdirectories alongside source files
- Use `test()`, `expect()`, `vi.mock()` from vitest
- Use `@testing-library/react` for component testing
- Always call `cleanup()` in `afterEach`
```typescript
import { test, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";

vi.mock("@/lib/some-dependency", () => ({
  someFunction: vi.fn(),
}));

afterEach(cleanup);

test("component renders correctly", () => {
  render(<MyComponent />);
  expect(screen.getByText("Hello")).toBeDefined();
});
```

### Comments & File Organization
- DO NOT ADD comments unless asked or for complex non-obvious code
- Keep files under 500 lines; split larger files
- API routes in `src/app/api/[route]/route.ts`

## Database (Prisma)

- Schema: `prisma/schema.prisma`
- Generated client: `src/generated/prisma`
- After schema changes: `npx prisma generate && npx prisma migrate dev`
- Reset: `npm run db:reset`

## AI SDK Patterns

```typescript
import type { Message } from "ai";

const messages: Message[] = [
  { id: "1", role: "user", content: "Create a button" },
  { id: "2", role: "assistant", content: "I'll help...", parts: [...] },
];
```

Use `useChat` hook from `ai` package for AI integrations.

## Server-Only Code

```typescript
import "server-only";

export async function getSession() { /* Returns session or null */ }

export async function requireAuth() {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");
  return session;
}
```

## Environment Variables

```
DATABASE_URL=file:./dev.db
JWT_SECRET=your-secret-key
GOOGLE_GENERATIVE_AI_API_KEY=your-gemini-api-key  # Optional
```
