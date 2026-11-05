import Link from "next/link";

interface BrandProps {
  href?: string;
  compact?: boolean;
  subtitle?: boolean;
  className?: string;
}

export function Brand({
  href = "/",
  compact = false,
  subtitle = true,
  className = "",
}: BrandProps) {
  const content = (
    <>
      <span className="brand-mark" aria-hidden="true">
        <svg viewBox="0 0 32 32" width="100%" height="100%" fill="none">
          <circle
            cx="16"
            cy="16"
            r="12.5"
            stroke="url(#brand-gradient)"
            strokeWidth="1.2"
            opacity=".9"
          />
          <path
            d="M10.5 16.4l3.6 3.5 7.4-8"
            stroke="var(--color-lilac-white)"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="24.4" cy="9.6" r="1.5" fill="var(--color-lavender-accent)" />
          <circle cx="7.4" cy="21.8" r="1" fill="var(--color-lilac-white)" opacity=".7" />
          <defs>
            <linearGradient id="brand-gradient" x1="4" y1="28" x2="28" y2="4">
              <stop stopColor="#e59cff" />
              <stop offset=".5" stopColor="#ba9cff" />
              <stop offset="1" stopColor="#9cb2ff" />
            </linearGradient>
          </defs>
        </svg>
      </span>
      {!compact && (
        <span className="brand-text">
          <span className="brand-name">Motiveva</span>
          {subtitle && <span className="brand-sub">Tu mejor versión</span>}
        </span>
      )}
    </>
  );

  if (!href) {
    return <span className={`brand ${className}`}>{content}</span>;
  }

  const accessibleSuffix = compact ? "Motiveva, inicio" : "Inicio";

  return (
    <Link href={href} className={`brand ${className}`}>
      {content}
      <span className="sr-only">{accessibleSuffix}</span>
    </Link>
  );
}
