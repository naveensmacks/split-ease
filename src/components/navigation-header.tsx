import { ArrowLeftIcon, GearIcon, Pencil2Icon } from "@radix-ui/react-icons";
import Link from "next/link";

type NavigationHeaderProps = {
  backRoute: string;
  editRoute: string;
  useSettingSymbol?: boolean;
};
export default function NavigationHeader({
  backRoute,
  editRoute,
  useSettingSymbol = false,
}: NavigationHeaderProps) {
  return (
    <div className="p-1 flex justify-between items-center sm:hidden">
      <Link href={backRoute}>
        <ArrowLeftIcon className="w-8 h-8" />
      </Link>
      <Link href={editRoute}>
        {useSettingSymbol && <GearIcon className="w-8 h-8" />}
        {!useSettingSymbol && <Pencil2Icon className="w-7 h-7" />}
      </Link>
    </div>
  );
}
