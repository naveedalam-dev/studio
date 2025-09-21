import { cn } from "@/lib/utils";

export function TikTokLoader({ className }: { className?: string }) {
  return (
    <div className={cn("relative flex h-24 w-24 items-center justify-center", className)}>
      <div className="absolute h-10 w-10 rounded-full tiktok-loader-dot-1"></div>
      <div className="absolute h-10 w-10 rounded-full tiktok-loader-dot-2"></div>
    </div>
  );
}
