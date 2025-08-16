"use client";

import React, { useEffect, useRef } from "react";
import { ChatMessage } from "./ChatMessage";
import { ChatAvatar } from "./ChatAvatar";
import { LoadingSpinner } from "./LoadingSpinner";
import { Card, CardContent } from "@/components/ui/card";
import { UIMessage } from "ai";

interface ChatMessagesProps {
  messages: UIMessage[];
  isLoading: boolean;
  onFeatureClick?: (feature: string) => void;
}

export function ChatMessages({
  messages,
  isLoading,
  onFeatureClick,
}: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div
      ref={scrollContainerRef}
      className="flex-grow overflow-y-auto p-4 space-y-2 bg-background"
    >
      {messages.map((msg) => (
        <ChatMessage
          key={msg.id}
          message={msg}
          onFeatureClick={onFeatureClick}
        />
      ))}
      {isLoading && (
        <div className="flex items-start space-x-3 justify-start animate-pulse py-3">
          <ChatAvatar sender="ai" />
          <Card className="bg-card text-card-foreground rounded-bl-none shadow-md max-w-xs">
            <CardContent className="p-3">
              <LoadingSpinner size="sm" />
            </CardContent>
          </Card>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}
