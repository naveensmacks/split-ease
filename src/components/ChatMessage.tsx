import { cn } from "@/lib/utils";
import { ChatAvatar } from "./ChatAvatar";
import { Card, CardContent } from "@/components/ui/card";
import { UIMessage } from "ai";
import ReactMarkdown from "react-markdown";

import remarkGfm from "remark-gfm";

interface ChatMessageProps {
  message: UIMessage;
  onFeatureClick?: (feature: string) => void;
}

export function ChatMessage({ message, onFeatureClick }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex items-start space-x-3 py-3",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && <ChatAvatar sender="ai" />}
      <Card
        className={cn(
          "max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl shadow-md",
          isUser
            ? "bg-primary text-primary-foreground rounded-br-none"
            : "bg-card text-card-foreground rounded-bl-none"
        )}
      >
        <CardContent className="p-3">
          {message.content.length > 0 ? (
            <div className="text-sm">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  p: ({ children }) => (
                    <p className="mb-2 leading-relaxed">{children}</p>
                  ),
                  h1: ({ children }) => (
                    <h1 className="text-xl font-bold">{children}</h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-lg font-semibold">{children}</h2>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc ml-6">{children}</ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal ml-6">{children}</ol>
                  ),
                  li: ({ children }) => <li className="mb-1">{children}</li>,
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-muted pl-4 italic text-muted-foreground">
                      {children}
                    </blockquote>
                  ),
                  a: ({ href, children }) => (
                    <a
                      href={href as string}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primecolor hover:text-blue-600 underline"
                    >
                      {children}
                    </a>
                  ),
                  // No 'code' / 'inlineCode' overrides on purpose
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          ) : (
            <span className="italic font-light">
              {/* {"calling tool: " + message?.toolInvocations?.[0].toolName}
              {"calling tool1: " + message?.parts?.[0].type} */}
              {"Fetching details For you.."}
            </span>
          )}
          <p
            className={cn(
              "text-xs mt-1.5",
              isUser
                ? "text-primary-foreground/70 text-right"
                : "text-muted-foreground text-left"
            )}
          >
            {message.createdAt?.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </CardContent>
      </Card>
      {isUser && <ChatAvatar sender="user" />}
    </div>
  );
}
