"use client";

import React, { useState, useEffect } from "react";
import { ChatMessages } from "@/components/ChatMessages";
import { ChatInput } from "@/components/ChatInput";
import { useChat } from "@ai-sdk/react";
import { MessagesSquare } from "lucide-react";

interface ChatbotClientProps {
  groupId: string;
  userId: string;
  userName: string;
  groupName: string;
  groupDescription: string;
  memberCount: number;
  currencyType: string;
  splitEaseEnabled: boolean;
}

export default function ChatbotClient({
  groupId,
  userId,
  userName,
  groupName,
  groupDescription,
  memberCount,
  currencyType,
  splitEaseEnabled,
}: ChatbotClientProps) {
  const [isLoading, setIsLoading] = useState(false);

  const {
    messages,
    status,
    setMessages,
    input,
    handleInputChange,
    handleSubmit,
    append,
  } = useChat({
    maxSteps: 3,
    body: {
      groupId,
      userId,
      userName,
      groupName,
      groupDescription,
      memberCount,
      currencyType,
      splitEaseEnabled,
    },
  });

  //Initial welcome message from AI
  useEffect(() => {
    setMessages([
      {
        id: "initial-ai-message",
        content: `Hello ${userName}! I am SplitEase AI. How can I help you today?`,
        role: "assistant",
        createdAt: new Date(),
        parts: [
          // {
          //   type: "text",
          //   text: "Hello! I am SplitEase AI. How can I help you manage your expenses and splits today?",
          // },
        ],
      },
    ]);
  }, [setMessages, userName]);

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // start your loading spinner
    setIsLoading(true);

    try {
      // call the original handleSubmit (it returns a Promise)
      handleSubmit(e);
    } catch (err) {
      console.error(err);
    } finally {
      // stop the spinner once chat is done (or errored)
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-grow h-full bg-background antialiased">
      <header className="p-4 border-b border-border shadow-sm bg-card">
        <div className="container mx-auto flex items-center">
          <MessagesSquare className="sm:h-7 sm:w-7 text-primary mr-2" />
          <h1 className="sm:text-xl font-semibold text-foreground">
            SplitEase AI Chat
          </h1>
        </div>
      </header>
      <main className="flex flex-col flex-grow h-fulloverflow-hidden">
        <ChatMessages messages={messages} isLoading={isLoading} />
        <ChatInput
          // onSendMessage={handleSendMessage}
          handleInputChange={handleInputChange}
          onChatSubmit={handleSubmit}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          input={input}
          status={status}
        />
      </main>
    </div>
  );
}
