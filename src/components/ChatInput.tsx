"use client";

import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send, CornerDownLeft } from "lucide-react";
import { LoadingSpinner } from "./LoadingSpinner";
import { ChatRequestOptions } from "ai";

interface ChatInputProps {
  // onSendMessage: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onChatSubmit: (
    event?: {
      preventDefault?: () => void;
    },
    chatRequestOptions?: ChatRequestOptions
  ) => void;
  isLoading: boolean;
  input: string;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  status: "submitted" | "streaming" | "ready" | "error";
}

export function ChatInput({
  handleInputChange,
  onChatSubmit,
  input,
  isLoading,
  setIsLoading,
  status,
}: ChatInputProps) {
  // const [inputValue, setInputValue] = useState("");

  // const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   if (!isLoading) {
  //     onChatSubmit(e);
  //     setInputValue("");
  //   }
  // };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onChatSubmit(e);
    }
  };

  return (
    <form
      onSubmit={onChatSubmit}
      className="flex-shrink-0 p-4 border-t border-border bg-card shadow-lg"
    >
      <div className="relative flex items-center space-x-2">
        <Textarea
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Type your message to SplitEase AI..."
          className="flex-grow resize-none pr-20 min-h-[52px] max-h-[150px] rounded-lg shadow-inner focus-visible:ring-accent"
          rows={1}
          disabled={isLoading}
          aria-label="Chat message input"
        />
        <Button
          type="submit"
          size="icon"
          className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-md bg-accent hover:bg-accent/90 text-accent-foreground"
          disabled={isLoading || !input.trim()}
          aria-label="Send message"
        >
          {isLoading ? (
            <LoadingSpinner size="sm" className="text-accent-foreground" />
          ) : (
            <Send className="h-5 w-5" />
          )}
        </Button>
        {/* <button disabled={status !== 'ready'}>
      {status === 'streaming' ? 'Loading…' : 'Send'}
    </button> */}
      </div>
      <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1">
        <CornerDownLeft className="h-3 w-3" /> Shift+Enter for new line.
      </p>
    </form>
  );
}
