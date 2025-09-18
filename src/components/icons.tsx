import type { SVGProps } from "react";

export function CoinSenderLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      width="256"
      height="256"
      {...props}
    >
      <defs>
        <linearGradient id="a" x1="128" x2="128" y1="23.9" y2="236.1" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FDE047" />
          <stop offset="1" stopColor="#FBBF24" />
        </linearGradient>
        <linearGradient id="b" x1="128" x2="128" y1="48.2" y2="212.2" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FB923C" />
          <stop offset="1" stopColor="#F97316" />
        </linearGradient>
        <linearGradient id="c" x1="150.3" x2="150.3" y1="60.3" y2="198.3" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FEF08A" />
          <stop offset="1" stopColor="#FDE047" />
        </linearGradient>
      </defs>
      <path
        fill="url(#a)"
        d="M128 23.9c57.5 0 104.1 46.6 104.1 104.1S185.5 232.1 128 232.1 23.9 185.5 23.9 128 70.5 23.9 128 23.9z"
      />
      <path
        fill="url(#b)"
        d="M128 48.2c44.1 0 79.8 35.7 79.8 79.8s-35.7 79.8-79.8 79.8-79.8-35.7-79.8-79.8 35.7-79.8 79.8-79.8z"
      />
      <path
        fill="url(#c)"
        d="M184.4 96.3c-2.3-1.2-4.9-1.8-7.5-1.8-5.4 0-10.6 2.1-14.5 5.9-3.9 3.8-6.2 8.9-6.2 14.4v60.9c0 5.4-2.1 10.5-5.9 14.3-3.8 3.8-8.8 5.9-14.2 5.9s-10.4-2.1-14.2-5.9c-3.8-3.8-5.9-8.9-5.9-14.3V91.6c0-5.1-1.6-9.9-4.5-13.9-3.2-4.2-7.9-7-13.2-7.5-10.3-.9-18.7 7.5-18.7 17.8v45c0 14.9 6 29.3 16.6 39.9s25.2 16.7 40.2 16.7c14.9 0 29.3-6 39.9-16.6 10.6-10.6 16.6-25 16.6-39.9v-28c.1-16.7-13.3-30.3-29.9-30.3z"
      />
    </svg>
  );
}
