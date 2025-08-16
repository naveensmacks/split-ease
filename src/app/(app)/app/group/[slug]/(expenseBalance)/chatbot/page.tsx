import { checkAuth, getUserById, getGroupByGroupId } from "@/lib/server-utils";
import ChatbotClient from "@/components/chatbot-client";

export default async function ChatPage({
  params,
}: {
  params: { slug: string };
}) {
  const session = await checkAuth();
  const user = await getUserById(session.user.id);
  const group = await getGroupByGroupId(params.slug);

  return (
    <ChatbotClient
      groupId={params.slug}
      userId={session.user.id}
      userName={
        user?.firstName
          ? `${user.firstName} ${user.lastName || ""}`.trim()
          : session.user.email || ""
      }
      groupName={group?.groupName || ""}
      groupDescription={group?.groupDescription || ""}
      memberCount={group?.users?.length || 0}
      currencyType={group?.currencyType || "USD"}
      splitEaseEnabled={group?.splitEase || false}
    />
  );
}
