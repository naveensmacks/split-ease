"use client";
import { useGroupContext } from "@/lib/hooks";
import GroupInfoHeader from "./group-info-header";
import EditButtonLargeView from "./edit-btn-large-view";

export default function GroupInfoExpanded() {
  const { selectedGroup } = useGroupContext();
  return (
    <div className="flex sm:gap-4 gap-2 rounded-lg min-h-[120px] justify-start items-center sm:max-w-[750px]">
      <GroupInfoHeader />
      {selectedGroup?.groupId && (
        <EditButtonLargeView
          href={`/app/group/${selectedGroup.groupId}/edit`}
        />
      )}
    </div>
  );
}
