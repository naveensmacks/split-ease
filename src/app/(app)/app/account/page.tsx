import EditButtonLargeView from "@/components/edit-btn-large-view";
import H1 from "@/components/h1";
import NavigationHeader from "@/components/navigation-header";
import SignOutBtn from "@/components/sign-out-btn";
import { checkAuth, getUserById } from "@/lib/server-utils";
import { extractInitials } from "@/lib/utils";

export default async function Page() {
  //get loggedIn user data using auth function
  const session = await checkAuth();
  const userId = session.user.id ? session.user.id : "";
  const user = await getUserById(userId);
  if (!user) {
    // Handle the case where user is null
    return <div>User not found</div>;
  }
  const { email, firstName, lastName } = user;
  return (
    <div className="px-2">
      <NavigationHeader
        backRoute={"/app/groups"}
        editRoute={`/app/account/edit`}
      />
      <div className="w-full flex flex-col gap-2 items-center">
        <div className="flex w-14 h-14 bg-accountcolor rounded-full text-white text-4xl justify-center items-center">
          {extractInitials(firstName, lastName)}
        </div>
        <H1>
          {firstName} {lastName}
        </H1>
        <div className="text-white">{email}</div>
        <EditButtonLargeView href={`/app/account/edit`} />

        <SignOutBtn />
      </div>
    </div>
  );
}
