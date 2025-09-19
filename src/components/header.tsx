import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MoreVertical, Search } from 'lucide-react';
import { ThemeToggleButton } from '@/components/theme-toggle';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function AppHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex h-16 w-full items-center justify-between border-b bg-background px-4 sm:px-6 lg:px-8">
      <div className="flex items-center">
        <Image src="https://i.postimg.cc/mDRCj2Jj/Tik-Tok-logo-svg.png" alt="TikTok Logo" width={112} height={32} />
      </div>
      <div className="hidden flex-1 justify-center px-8 sm:flex">
        <div className="relative w-full max-w-sm">
          <Input type="search" placeholder="Search" className="rounded-full bg-muted pr-10" />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <Search className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Avatar>
            <AvatarImage src="https://i.postimg.cc/FR9kcCkn/446fd5d86ec906a98d556d890fb00c74.jpg" alt="User Avatar" />
            <AvatarFallback>U</AvatarFallback>
        </Avatar>
        <ThemeToggleButton />
        <MoreVertical className="h-6 w-6 cursor-pointer text-foreground" />
      </div>
    </header>
  );
}
