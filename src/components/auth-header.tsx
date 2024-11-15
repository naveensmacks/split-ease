import Logo from "./logo";
import H1 from "./h1";

export default function AuthHeader() {
  return (
    <div>
      <div className="fixed w-full m-auto flex justify-left items-center sm:h-28 h-16 bg-primecolor gap-x-1 px-4">
        <Logo />
        <H1 className="sm:text-4xl text-2xl text-white/80">Split Ease</H1>
      </div>
    </div>
  );
}
