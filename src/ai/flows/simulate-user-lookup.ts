'use server';

/**
 * @fileOverview Simulates a user lookup using a generative AI to confirm the existence of the recipient's username.
 *
 * - simulateUserLookup - A function that simulates the user lookup process.
 * - SimulateUserLookupInput - The input type for the simulateUserLookup function.
 * - SimulateUserLookupOutput - The return type for the simulateUserLookup function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SimulateUserLookupInputSchema = z.object({
  username: z
    .string()
    .describe('The username of the recipient, starting with @.'),
});
export type SimulateUserLookupInput = z.infer<typeof SimulateUserLookupInputSchema>;

const SimulateUserLookupOutputSchema = z.object({
  found: z.boolean().describe('Whether the user was found or not.'),
  avatarUrl: z.string().optional().describe('The URL of the user avatar, if found.'),
});
export type SimulateUserLookupOutput = z.infer<typeof SimulateUserLookupOutputSchema>;

export async function simulateUserLookup(input: SimulateUserLookupInput): Promise<SimulateUserLookupOutput> {
  // For this demo, we'll just simulate a successful response.
  // In a real app, this would call the Genkit flow.
  return new Promise(resolve => {
    setTimeout(() => {
      if (input.username.length > 2 && input.username !== '@') {
        resolve({
          found: true,
          avatarUrl: `https://ui-avatars.com/api/?name=${input.username.substring(1)}&background=random`,
        });
      } else {
        resolve({ found: false });
      }
    }, 500 + Math.random() * 1000); // Simulate network delay
  });
}

const simulateUserLookupPrompt = ai.definePrompt({
  name: 'simulateUserLookupPrompt',
  input: {schema: SimulateUserLookupInputSchema},
  output: {schema: SimulateUserLookupOutputSchema},
  prompt: `You are a social media user lookup service.  Given a username, determine if the user exists and, if so, provide a plausible avatar URL.

  Username: {{{username}}}

  Respond in JSON format.
  `,
});

const simulateUserLookupFlow = ai.defineFlow(
  {
    name: 'simulateUserLookupFlow',
    inputSchema: SimulateUserLookupInputSchema,
    outputSchema: SimulateUserLookupOutputSchema,
  },
  async input => {
     // This flow is not called directly in the demo to avoid API key errors.
     // The exported `simulateUserLookup` function above provides a mocked response.
    const {output} = await simulateUserLookupPrompt(input);
    return output!;
  }
);
