"use client";

import { ChangeEvent, FormEvent, KeyboardEvent } from "react";
import { Send } from "lucide-react";

interface MessageInputProps {
  input: string;
  handleInputChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
}

export function MessageInput({
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
}: MessageInputProps) {
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const form = e.currentTarget.form;
      if (form) {
        form.requestSubmit();
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative p-6 bg-gradient-to-t from-white via-white to-white/95 backdrop-blur-sm border-t border-neutral-200/60">
      <div className="relative max-w-4xl mx-auto">
        <div className="relative rounded-2xl bg-white shadow-lg shadow-neutral-200/50 border border-neutral-200/60 focus-within:shadow-xl focus-within:shadow-[#7c3aed]/10 focus-within:border-[#7c3aed]/30 transition-all duration-300">
          <textarea
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Describe the React component you want to create..."
            disabled={isLoading}
            className="w-full min-h-[88px] max-h-[200px] pl-5 pr-16 py-4 rounded-2xl bg-transparent text-neutral-800 resize-none focus:outline-none placeholder:text-neutral-400 text-[15px] font-normal leading-relaxed"
            rows={3}
          />
          <button 
            type="submit" 
            disabled={isLoading || !input.trim()}
            className="absolute right-4 bottom-4 p-3 rounded-xl transition-all duration-200 hover:bg-gradient-to-br hover:from-[#7c3aed] hover:to-[#2563eb] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent group disabled:hover:shadow-none hover:shadow-md hover:shadow-[#7c3aed]/20"
          >
            <Send className={`h-5 w-5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${isLoading || !input.trim() ? 'text-neutral-300' : 'text-[#7c3aed] group-hover:text-white'}`} />
          </button>
        </div>
        <div className="flex items-center justify-between mt-3 px-2">
          <p className="text-xs text-neutral-400">Press Enter to send, Shift+Enter for new line</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
            <span className="text-xs text-neutral-400">AI ready</span>
          </div>
        </div>
      </div>
    </form>
  );
}