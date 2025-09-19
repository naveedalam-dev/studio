import { SendCoinsForm } from "@/components/send-coins-form";

export default function Home() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] w-full flex-col items-center justify-center bg-background p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-2xl">
        <SendCoinsForm />
      </div>
    </div>
  );
}
