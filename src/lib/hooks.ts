import { GroupContext } from "@/contexts/group-context-provider";
import { MemberContext } from "@/contexts/member-context-provider";
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

export function useMemberContext() {
  const context = useContext(MemberContext);
  if (!context) {
    throw new Error(
      "useMemberContext must be used within a MemberContextProvider"
    );
  }
  return context;
}
