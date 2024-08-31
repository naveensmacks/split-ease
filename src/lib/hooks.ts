import { GroupContext } from "@/contexts/group-context-provider";
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
