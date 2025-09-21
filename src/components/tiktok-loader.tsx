import { cn } from "@/lib/utils";

export function TikTokLoader({ className }: { className?: string }) {
  return (
    <div className={cn("relative flex h-20 w-20 items-center justify-center", className)}>
      <div className="absolute h-8 w-8 rounded-full tiktok-loader-dot-1"></div>
      <div className="absolute h-8 w-8 rounded-full tiktok-loader-dot-2"></div>
    </div>
  );
}
