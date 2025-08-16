import type { Message } from "@/types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, Bot } from "lucide-react";
import { useUserContext } from "@/lib/hooks";
import { extractInitials } from "@/lib/utils";

interface ChatAvatarProps {
  sender: Message["sender"];
}

export function ChatAvatar({ sender }: ChatAvatarProps) {
  const { user } = useUserContext();
  const initials = extractInitials(user.firstName, user.lastName);
  if (sender === "user") {
    return (
      <div className="flex w-8 h-8 bg-accountcolor rounded-full text-white text-xs sm:text-sm justify-center items-center">
        {initials}
      </div>
    );
  }
  return (
    <Avatar className="h-8 w-8 sm:h-10 sm:w-10 border-accent/30">
      <AvatarFallback className="bg-accent/10 text-accent">
        <Bot className="h-6 w-6 sm:h-8 sm:w-8" />
      </AvatarFallback>
    </Avatar>
  );
}
