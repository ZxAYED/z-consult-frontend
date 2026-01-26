type LogoProps = {
  variant?: "mark" | "full";
  className?: string;
};

export function Logo({ variant = "full", className }: LogoProps) {
  const primary = "#76BA4B";
  const ink = "#0E171E";
  const muted = "#59656E";

  const Mark = (
    <svg
      className={className}
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      aria-label="Z Consult"
    >
      {/* Queue nodes */}
      <circle cx="8" cy="10" r="2" fill={primary} />
      <circle cx="26" cy="10" r="2" fill={primary} />
      <circle cx="8" cy="24" r="2" fill={primary} />
      <circle cx="26" cy="24" r="2" fill={primary} />

      {/* Z flow path */}
      <path
        d="M10.5 10H23.5L10.5 24H23.5"
        stroke={ink}
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Clock dot (time) */}
      <circle cx="27.2" cy="6.8" r="1.6" fill={ink} />
      <path
        d="M27.2 6.2v1.6l1 .6"
        stroke="#FFFFFF"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  if (variant === "mark") return Mark;

  return (
    <div
      className={className}
      style={{ display: "flex", alignItems: "center", gap: 10 }}
    >
      {Mark}
      <div style={{ lineHeight: 1.05 }}>
        <div
          style={{
            fontWeight: 700,
            letterSpacing: "-0.02em",
            color: ink,
            fontSize: 18,
          }}
        >
          Z <span style={{ color: primary }}>Consult</span>
        </div>
        <div style={{ fontSize: 12.5, color: muted, marginTop: 2 }}>
          Appointment &amp; Queue Manager
        </div>
      </div>
    </div>
  );
}
