import Wrapper from "./Wrapper";

export const Footer = () => {
  return (
    <footer className="relative z-10 py-8 mt-auto bg-white/30 backdrop-blur-sm">
      <Wrapper>
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()}{" "}
            <span className="font-semibold text-foreground">Z Consult</span>.
            All rights reserved.
          </p>
          <div className="flex gap-4 text-xs text-muted-foreground/80">
            <a href="#" className="hover:text-primary transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Contact Support
            </a>
          </div>
        </div>
      </Wrapper>
    </footer>
  );
};
