import type { SVGProps } from "react";

export function CoinSenderLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="10" fill="hsl(var(--primary))" stroke="none" />
      <path
        d="M16 8A4 4 0 1 1 12.1 4"
        stroke="hsl(var(--primary-foreground))"
        strokeWidth="2.5"
      />
      <path
        d="M8 16A4 4 0 1 1 11.9 20"
        stroke="hsl(var(--primary-foreground))"
        strokeWidth="2.5"
      />
       <path
        d="M12 4V20"
        stroke="hsl(var(--primary-foreground))"
        strokeWidth="2.5"
      />
    </svg>
  );
}
