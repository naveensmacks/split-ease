import Link from "next/link";
import logo from "../../public/splitEaseIcon.svg";
import Image from "next/image";
export default function Logo() {
  return (
    <Link href={process.env.NEXT_PUBLIC_LANDING_PAGE_URL!}>
      <Image src={logo} alt="SplitEase logo" className="w-10 h-10" />
    </Link>
  );
}
