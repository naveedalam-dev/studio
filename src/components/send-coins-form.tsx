'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useState, useEffect, useMemo, useTransition, useCallback } from 'react';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { CUSTOM_COIN_PRICE, PACKAGES, type Package } from '@/lib/data';
import { lookupUser } from '@/app/actions';
import { Loader2, CircleDollarSign, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { CoinSenderLogo } from './icons';

// Simple debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

const SendCoinsSchema = z.object({
  username: z.string().min(2, 'Username is too short.').startsWith('@', "Username must start with '@'."),
  customAmount: z.string().optional(),
});

type UserStatus = 'idle' | 'loading' | 'valid' | 'invalid' | 'not_found';

export function SendCoinsForm() {
  const [isSending, startSendingTransition] = useTransition();
  const [userStatus, setUserStatus] = useState<UserStatus>('idle');
  const [recipient, setRecipient] = useState<{ username: string; avatarUrl?: string } | null>(null);
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [deliveryTime, setDeliveryTime] = useState('');
  const { toast } = useToast();

  const form = useForm<z.infer<typeof SendCoinsSchema>>({
    resolver: zodResolver(SendCoinsSchema),
    defaultValues: { username: '', customAmount: '' },
    mode: 'onChange',
  });

  const watchedUsername = form.watch('username');
  const watchedCustomAmount = form.watch('customAmount');
  const debouncedUsername = useDebounce(watchedUsername, 500);

  useEffect(() => {
    if (!debouncedUsername || !debouncedUsername.startsWith('@') || debouncedUsername.length < 2) {
      setUserStatus('idle');
      setRecipient(null);
      return;
    }

    setUserStatus('loading');
    lookupUser(debouncedUsername).then(result => {
      if (result.found && result.username) {
        setUserStatus('valid');
        setRecipient({ username: result.username, avatarUrl: result.avatarUrl });
      } else {
        setUserStatus('not_found');
        setRecipient(null);
      }
    });
  }, [debouncedUsername]);

  const { totalCoins, totalPrice } = useMemo(() => {
    if (!selectedPackageId) return { totalCoins: 0, totalPrice: 0 };

    const selectedPkg = PACKAGES.find(p => p.id === selectedPackageId);
    if (!selectedPkg) return { totalCoins: 0, totalPrice: 0 };

    if (selectedPkg.isCustom) {
      const amount = parseFloat(watchedCustomAmount) || 0;
      return {
        totalCoins: amount,
        totalPrice: amount * CUSTOM_COIN_PRICE,
      };
    } else {
      return {
        totalCoins: selectedPkg.coins || 0,
        totalPrice: selectedPkg.price || 0,
      };
    }
  }, [selectedPackageId, watchedCustomAmount]);
  
  const formatCurrency = useCallback((amount: number) => {
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(amount);
  }, []);

  function onSubmit(data: z.infer<typeof SendCoinsSchema>) {
    if (isSendDisabled) return;

    const times = ['1 hour', '1.5 hours', '2 hours', '2.5 hours', '3 hours'];
    const randomTime = times[Math.floor(Math.random() * times.length)];
    
    startSendingTransition(() => {
      // Simulate API call
      setTimeout(() => {
        setDeliveryTime(randomTime);
        setShowSuccessDialog(true);
      }, 1000);
    });
  }
  
  const closeSuccessDialog = () => {
    setShowSuccessDialog(false);
    form.reset();
    setSelectedPackageId(null);
    setUserStatus('idle');
    setRecipient(null);
  }

  const isSendDisabled = isSending || userStatus !== 'valid' || totalCoins <= 0;

  return (
    <>
      <Card className="w-full shadow-lg">
        <div className="flex justify-between items-center p-6 pb-0">
          <CoinSenderLogo className="text-foreground h-7 w-7" />
          <Button variant="link" className="text-primary px-0 font-semibold">
            Log In
          </Button>
        </div>
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Get Coins</CardTitle>
          <CardDescription>Send coins to your favorite creator</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-8">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username (recipient)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input placeholder="@username" {...field} className="pr-10" />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                          {userStatus === 'loading' && <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />}
                          {userStatus === 'valid' && recipient?.avatarUrl && (
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={recipient.avatarUrl} alt={recipient.username} />
                              <AvatarFallback>{recipient.username.slice(1, 3).toUpperCase()}</AvatarFallback>
                            </Avatar>
                          )}
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                    {userStatus === 'not_found' && <p className="text-sm font-medium text-destructive">Recipient not found.</p>}
                    {userStatus === 'valid' && recipient && (
                      <p className="text-sm font-medium text-green-600">User found: {recipient.username}</p>
                    )}
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <Label>Choose a package</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {PACKAGES.map(pkg => {
                    const isSelected = selectedPackageId === pkg.id;
                    return (
                      <div
                        key={pkg.id}
                        onClick={() => setSelectedPackageId(pkg.id)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setSelectedPackageId(pkg.id)}
                        className={cn(
                          'relative group rounded-lg border-2 bg-card p-4 text-center transition-all duration-200 hover:shadow-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring',
                          isSelected ? 'border-primary shadow-xl scale-105' : 'border-border',
                        )}
                      >
                        {isSelected && <CheckCircle2 className="absolute top-2 right-2 h-5 w-5 text-primary" />}
                        <CircleDollarSign className="mx-auto h-8 w-8 text-amber-400 mb-2" />
                        <p className="font-bold text-lg">{pkg.isCustom ? 'Custom' : pkg.coins?.toLocaleString()}</p>
                        {pkg.isCustom ? (
                          <FormField
                              control={form.control}
                              name="customAmount"
                              render={({ field }) => (
                                  <FormItem className="mt-2">
                                      <FormControl>
                                          <Input 
                                            type="number"
                                            placeholder="Amount" 
                                            {...field}
                                            onFocus={() => setSelectedPackageId(pkg.id)}
                                            className="text-center"
                                          />
                                      </FormControl>
                                  </FormItem>
                              )}
                          />
                        ) : (
                          <p className="text-muted-foreground text-sm">{formatCurrency(pkg.price || 0)}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {totalPrice > 0 && (
                  <div className="space-y-2 rounded-lg border bg-secondary/50 p-4">
                      <h3 className="text-lg font-semibold">Total</h3>
                      <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Coins</span>
                          <span className="font-bold">{totalCoins.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center font-bold text-xl">
                          <span>Price</span>
                          <span>{formatCurrency(totalPrice)}</span>
                      </div>
                  </div>
              )}
            </CardContent>
            <CardFooter className="flex-col items-stretch gap-4">
              <Button type="submit" size="lg" disabled={isSendDisabled} className="w-full text-lg font-bold py-6">
                {isSending ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
                Send Coins
              </Button>
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="h-4 w-4 text-green-500" />
                <span>Secure payment · Data encrypted</span>
              </div>
              <p className="text-center text-xs text-muted-foreground">Save ~25% with <a href="#" className="underline text-primary">third-party</a>.</p>
            </CardFooter>
          </form>
        </Form>
      </Card>
      
      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Success!</AlertDialogTitle>
            <AlertDialogDescription>
              Your coins were sent successfully to {recipient?.username}. It will take approximately {deliveryTime} to be delivered.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={closeSuccessDialog}>Great!</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
