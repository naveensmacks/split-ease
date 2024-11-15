import { GroupContext } from "@/contexts/group-context-provider";
import { UserContext } from "@/contexts/user-context-provider";
import { useContext } from "react";

export function useGroupContext() {
  const context = useContext(GroupContext);
  if (!context) {
    throw new Error(
      "useGroupContext must be used within a GroupContextProvider"
    );
  }
  return context;
}

export function useUserContext() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserContextProvider");
  }
  return context;
}
