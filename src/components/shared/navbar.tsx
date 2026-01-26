import { GhostButton } from "@/components/shared/buttons";
import { Logo } from "@/components/shared/logo";
import Wrapper from "@/components/shared/Wrapper";
import Link from "next/link";

export const Navbar = () => {
  return (
    <header className="relative z-10 w-full py-6 border-b border-border/10 bg-white/50 backdrop-blur-sm">
      <Wrapper className="flex items-center justify-between">
        <Link href="/">
          <Logo />
        </Link>
        <nav className="hidden md:flex items-center gap-2">
          <Link href="#features">
            <GhostButton title="Features" className="text-sm font-medium" />
          </Link>
          <Link href="#pricing">
            <GhostButton title="Pricing" className="text-sm font-medium" />
          </Link>
          <Link href="/login">
            <GhostButton title="Sign In" className="text-sm font-medium" />
          </Link>
        </nav>
      </Wrapper>
    </header>
  );
};
