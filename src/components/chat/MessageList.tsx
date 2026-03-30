"use client";

import { Message } from "ai";
import { cn } from "@/lib/utils";
import { User, Bot, Loader2 } from "lucide-react";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { ToolInvocationMessage } from "./ToolInvocationMessage";

interface MessageListProps {
  messages: Message[];
  isLoading?: boolean;
}

export function MessageList({ messages, isLoading }: MessageListProps) {
  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)] px-4 text-center">
        <div className="relative flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-br from-[#7c3aed] to-[#2563eb] mb-5 shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-3xl"></div>
          <Bot className="h-8 w-8 text-white relative z-10" />
        </div>
        <p className="text-neutral-900 font-bold text-xl mb-3 bg-gradient-to-r from-[#7c3aed] to-[#2563eb] bg-clip-text text-transparent">Start a conversation</p>
        <p className="text-neutral-500 text-base max-w-sm leading-relaxed">I can help you create beautiful React components with live preview</p>
        <div className="flex gap-2 mt-6">
          <div className="px-4 py-2 bg-white border border-neutral-200/60 rounded-full text-sm font-medium text-neutral-600 hover:bg-neutral-50 transition-colors cursor-pointer shadow-sm">Create a button</div>
          <div className="px-4 py-2 bg-white border border-neutral-200/60 rounded-full text-sm font-medium text-neutral-600 hover:bg-neutral-50 transition-colors cursor-pointer shadow-sm">Design a form</div>
          <div className="px-4 py-2 bg-white border border-neutral-200/60 rounded-full text-sm font-medium text-neutral-600 hover:bg-neutral-50 transition-colors cursor-pointer shadow-sm">Build a card</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto px-6 py-8 bg-gradient-to-br from-neutral-50/50 to-white">
      <div className="space-y-8 max-w-4xl mx-auto w-full">
        {messages.map((message) => (
          <div
            key={message.id || message.content}
            className={cn(
              "flex gap-4",
              message.role === "user" ? "justify-end" : "justify-start"
            )}
          >
            {message.role === "assistant" && (
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#7c3aed] to-[#2563eb] flex items-center justify-center shadow-md">
                  <Bot className="h-5 w-5 text-white" />
                </div>
              </div>
            )}
            
            <div className={cn(
              "flex flex-col gap-2 max-w-[85%]",
              message.role === "user" ? "items-end" : "items-start"
            )}>
              <div className={cn(
                "rounded-2xl px-5 py-4",
                message.role === "user" 
                  ? "bg-gradient-to-r from-[#8b5cf6] to-[#3b82f6] text-white shadow-lg shadow-purple-500/10 border border-white/10" 
                  : "bg-white/90 backdrop-blur-sm text-neutral-800 border border-[#8b5cf6]/20 shadow-md shadow-purple-500/5"
              )}>
                <div className="text-[15px] leading-relaxed">
                  {message.parts ? (
                    <>
                      {message.parts.map((part, partIndex) => {
                        switch (part.type) {
                          case "text":
                            return message.role === "user" ? (
                              <span key={partIndex} className="whitespace-pre-wrap">{part.text}</span>
                            ) : (
                              <MarkdownRenderer
                                key={partIndex}
                                content={part.text}
                                className="prose-sm"
                              />
                            );
                            case "reasoning":
                            return (
                              <div key={partIndex} className="mt-3 p-4 bg-white/40 backdrop-blur-sm rounded-xl border border-[#8b5cf6]/20">
                                <span className="text-xs font-semibold text-neutral-500 block mb-2 uppercase tracking-wider">Reasoning</span>
                                <span className="text-sm text-neutral-700 leading-relaxed">{part.reasoning}</span>
                              </div>
                            );
                          case "tool-invocation":
                            return (
                              <ToolInvocationMessage
                                key={partIndex}
                                toolInvocation={part.toolInvocation}
                              />
                            );
                          case "source":
                            return (
                              <div key={partIndex} className="mt-2 text-xs text-neutral-500">
                                Source: {JSON.stringify(part.source)}
                              </div>
                            );
                          case "step-start":
                            return partIndex > 0 ? <hr key={partIndex} className="my-3 border-neutral-200" /> : null;
                          default:
                            return null;
                        }
                      })}
                      {isLoading &&
                        message.role === "assistant" &&
                        messages.indexOf(message) === messages.length - 1 && (
                          <div className="flex items-center gap-3 mt-4 text-neutral-500 bg-gradient-to-r from-[#7c3aed]/10 to-[#2563eb]/10 px-4 py-3 rounded-xl">
                            <div className="relative">
                              <Loader2 className="h-4 w-4 animate-spin text-[#7c3aed]" />
                            </div>
                            <span className="text-sm font-medium bg-gradient-to-r from-[#7c3aed] to-[#2563eb] bg-clip-text text-transparent">Generating component...</span>
                          </div>
                        )}
                    </>
                  ) : message.content ? (
                    message.role === "user" ? (
                      <span className="whitespace-pre-wrap">{message.content}</span>
                    ) : (
                      <MarkdownRenderer content={message.content} className="prose-sm" />
                    )
                  ) : isLoading &&
                    message.role === "assistant" &&
                    messages.indexOf(message) === messages.length - 1 ? (
                    <div className="flex items-center gap-3 text-neutral-500 bg-gradient-to-r from-[#7c3aed]/10 to-[#2563eb]/10 px-4 py-3 rounded-xl">
                      <Loader2 className="h-4 w-4 animate-spin text-[#7c3aed]" />
                      <span className="text-sm font-medium bg-gradient-to-r from-[#7c3aed] to-[#2563eb] bg-clip-text text-transparent">Generating component...</span>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
            
            {message.role === "user" && (
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-md">
                  <User className="h-5 w-5 text-white" />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}