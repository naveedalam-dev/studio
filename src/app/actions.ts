'use server';

import { simulateUserLookup, SimulateUserLookupInput } from '@/ai/flows/simulate-user-lookup';

export async function lookupUser(username: string): Promise<{
  found: boolean;
  avatarUrl?: string;
  username?: string;
}> {
  if (!username.startsWith('@') || username.length < 2) {
    return { found: false };
  }

  try {
    const input: SimulateUserLookupInput = { username };
    const result = await simulateUserLookup(input);

    if (result.found) {
      // Use a consistent placeholder avatar for demo purposes
      const avatarUrl = `https://picsum.photos/seed/${username}/150/150`;
      return { found: true, avatarUrl, username };
    }
    return { found: false };
  } catch (error) {
    console.error('Error looking up user:', error);
    return { found: false };
  }
}
