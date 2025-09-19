'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useState, useEffect, useMemo, useCallback } from 'react';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { CUSTOM_COIN_PRICE, PACKAGES, type Package } from '@/lib/data';
import { Loader2, CheckCircle2, UserCheck, Send, Check } from 'lucide-react';

const SendCoinsSchema = z.object({
  username: z.string().min(2, 'Username is too short.').startsWith('@', "Username must start with '@'."),
  customAmount: z.string().optional(),
});

type UserStatus = 'idle' | 'valid' | 'invalid';
type SendingStep = 'idle' | 'fetching' | 'found' | 'sending' | 'success';

export function SendCoinsForm() {
  const [sendingStep, setSendingStep] = useState<SendingStep>('idle');
  const [deliveryTimeMessage, setDeliveryTimeMessage] = useState('');
  const [userStatus, setUserStatus] = useState<UserStatus>('idle');
  const [recipient, setRecipient] = useState<{ username: string; avatarUrl?: string } | null>(null);
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null);
  const [balance, setBalance] = useState(999999999999999);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof SendCoinsSchema>>({
    resolver: zodResolver(SendCoinsSchema),
    defaultValues: { username: '', customAmount: '' },
    mode: 'onChange',
  });

  const watchedUsername = form.watch('username');
  const watchedCustomAmount = form.watch('customAmount');

  useEffect(() => {
    const username = form.getValues('username');
    if (form.getFieldState('username').isDirty && !username.startsWith('@')) {
      setUserStatus('invalid');
      setRecipient(null);
    } else if (username.length > 1 && username.startsWith('@')) {
      setUserStatus('valid');
      const nameForAvatar = username.substring(1);
      setRecipient({
        username: username,
        avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(nameForAvatar)}&background=random`,
      });
    } else {
      setUserStatus('idle');
      setRecipient(null);
    }
  }, [watchedUsername, form]);

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

  const generateDeliveryTimeMessage = () => {
    const randomHours = Math.floor(Math.random() * 3) + 1; // 1, 2, or 3 hours
    const randomMinutes = Math.floor(Math.random() * 60);
    let message = `Note: The coins will be sent to the user within ${randomHours} hour`;
    if (randomHours > 1) {
      message += 's';
    }
    if (randomMinutes > 0) {
      message += ` and ${randomMinutes} minute`;
      if (randomMinutes > 1) {
        message += 's';
      }
    }
    message += '.';
    setDeliveryTimeMessage(message);
  };
  
  function onSubmit(data: z.infer<typeof SendCoinsSchema>) {
    if (isSendDisabled) return;

    if (totalCoins > balance) {
      toast({
        title: 'Error',
        description: 'Insufficient credits.',
        variant: 'destructive',
      });
      return;
    }
    
    generateDeliveryTimeMessage();
    setSendingStep('fetching');

    const totalDuration = Math.floor(Math.random() * (15000 - 8000 + 1)) + 8000; // 8-15 seconds
    const fetchingDuration = totalDuration * 0.4;
    const foundDuration = totalDuration * 0.2;
    const sendingDuration = totalDuration * 0.4;

    setTimeout(() => {
      setSendingStep('found');
      setTimeout(() => {
        setSendingStep('sending');
        setTimeout(() => {
          setSendingStep('success');

          setBalance(prev => prev - totalCoins);
          
          setTimeout(() => {
            // Reset form
            form.reset();
            setSelectedPackageId(null);
            setUserStatus('idle');
            setRecipient(null);
            setSendingStep('idle');
          }, 4000); // Keep success message for 4 seconds
        }, sendingDuration);
      }, foundDuration);
    }, fetchingDuration);
  }

  const isSendDisabled = sendingStep !== 'idle' || userStatus !== 'valid' || !selectedPackageId || totalCoins <= 0;

  const renderSendingOverlay = () => {
    if (sendingStep === 'idle') return null;

    let icon, text;
    const username = form.getValues('username');

    switch (sendingStep) {
      case 'fetching':
        icon = <Loader2 className="h-12 w-12 animate-spin text-primary" />;
        text = 'Fetching user account...';
        break;
      case 'found':
        icon = (
          <div className="relative h-12 w-12">
            <CheckCircle2 className="h-12 w-12 text-green-500" />
          </div>
        );
        text = `User account ${username} found.`;
        break;
      case 'sending':
        icon = <Send className="h-12 w-12 animate-pulse text-primary" />;
        text = 'Sending coins...';
        break;
      case 'success':
        return (
          <div className="absolute inset-0 bg-background/90 backdrop-blur-sm flex flex-col items-center justify-center z-10 rounded-lg p-4">
            <div className="animate-in fade-in zoom-in-95 w-full max-w-sm mx-auto">
              <Card className="shadow-2xl border-green-500/50">
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-4">
                     <Image src="https://i.postimg.cc/brkZMhPN/tiktok-coin.png" alt="Success" width={64} height={64} />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">Coins Sent!</h3>
                  <p className="text-muted-foreground mt-2">
                    You have successfully sent {totalCoins.toLocaleString()} coins to {username}.
                  </p>
                  <p className="text-xs text-muted-foreground/80 mt-6 animate-in fade-in-50 delay-500">
                    {deliveryTimeMessage}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      default:
        return null;
    }

    return (
      <div className="absolute inset-0 bg-background/90 backdrop-blur-sm flex flex-col items-center justify-center z-10 rounded-lg p-4">
        <div className="animate-in fade-in zoom-in-95">
          <div className="flex flex-col items-center justify-center gap-4 text-center">
            {icon}
            <p className={cn("text-xl font-semibold text-foreground", sendingStep === 'sending' && 'animate-pulse')}>{text}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Card className="w-full shadow-lg relative overflow-hidden">
        {renderSendingOverlay()}
        <div className={cn("transition-opacity duration-300", sendingStep !== 'idle' && "opacity-50 blur-sm")}>
          <div className="flex justify-between items-center p-6 pb-0">
            <Image src="https://i.postimg.cc/brkZMhPN/tiktok-coin.png" alt="Coins Logo" width={28} height={28} />
            <div className="text-primary font-semibold">
              Balance: {balance.toLocaleString()} Coins
            </div>
          </div>
          <CardHeader>
            <CardTitle className="font-headline text-3xl">Get TikTok Coins</CardTitle>
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
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input placeholder="@username" {...field} className="pr-10" />
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
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
                            isSelected ? 'border-primary shadow-lg scale-105' : 'border-border',
                          )}
                        >
                          {isSelected && <CheckCircle2 className="absolute top-2 right-2 h-5 w-5 text-primary" />}
                          <Image src="https://i.postimg.cc/brkZMhPN/tiktok-coin.png" alt="Coins Logo" width={32} height={32} className="mx-auto mb-2" />
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
                      <span className="text-muted-foreground">Total Coins</span>
                      <span className="font-bold">{totalCoins.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center font-bold text-xl">
                      <span>Price</span>
                      <span>{formatCurrency(totalPrice)}</span>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button type="submit" size="lg" disabled={isSendDisabled} className="w-full text-lg font-bold py-6 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white">
                  Send Coins
                </Button>
              </CardFooter>
            </form>
          </Form>
        </div>
      </Card>
    </>
  );
}
