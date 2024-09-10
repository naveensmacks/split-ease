import { PlusIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { Button } from "./ui/button";
import { useGroupContext } from "@/lib/hooks";

export default function AddExpenseButton() {
  const { selectedGroupId } = useGroupContext();
  return (
    <Button size="icon" asChild>
      <Link href={`/app/group/${selectedGroupId}/expenses/add`}>
        <PlusIcon className="w-6 h-6" />
      </Link>
    </Button>
  );
}
