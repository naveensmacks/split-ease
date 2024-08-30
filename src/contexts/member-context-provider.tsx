import { addMemberToGroup } from "@/actions/actions";
import { useGroupContext } from "@/lib/hooks";
import { getUserByEmail, isMemberOfGroup } from "@/lib/server-utils";
import { MemberEssential } from "@/lib/types";
import { TMemberForm } from "@/lib/validation";
import React, { createContext, useState } from "react";
import { toast } from "sonner";

export const MemberContext = createContext<MemberContextType | null>(null);

type MemberContextProviderProps = {
  data: MemberEssential[];
  children: React.ReactNode;
};

type MemberContextType = {
  memberList: MemberEssential[] | null;

  handleAddMember: (
    newMember: TMemberForm,
    groupId: string
  ) => ReturnType<typeof addMemberToGroup>;
};

export default function MemberContextProvider({
  data,
  children,
}: MemberContextProviderProps) {
  const [memberList, setMemberList] = useState<MemberEssential[]>(data);
  const { handleEditGroupList } = useGroupContext();

  const handleAddMember = async (newMember: TMemberForm, groupId: string) => {
    const actionData = await addMemberToGroup(newMember, groupId);

    if (actionData && actionData.isSuccess && actionData.data) {
      setMemberList(actionData.data.users);
      handleEditGroupList(actionData.data, groupId);
    }
    return actionData;
  };
  return (
    <MemberContext.Provider value={{ memberList, handleAddMember }}>
      {children}
    </MemberContext.Provider>
  );
}
