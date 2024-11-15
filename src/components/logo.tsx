import Link from "next/link";
import logo from "../../public/splitEaseIcon.svg";
import Image from "next/image";
export default function Logo() {
  return (
    <Link href="/">
      <Image
        src={logo}
        alt="SplitEase logo"
        className="sm:w-14 sm:h-14 w-10 h-10"
      />
    </Link>
  );
}
