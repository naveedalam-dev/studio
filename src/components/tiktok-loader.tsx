import { cn } from "@/lib/utils";

export function TikTokLoader({ className }: { className?: string }) {
  return (
    <div className={cn("relative flex h-12 w-12 items-center justify-center", className)}>
      <div className="absolute h-5 w-5 rounded-full tiktok-loader-dot-1"></div>
      <div className="absolute h-5 w-5 rounded-full tiktok-loader-dot-2"></div>
    </div>
  );
}
