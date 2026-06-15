'use server';
/**
 * @fileOverview A Genkit flow that categorizes changelog entries into predefined categories.
 *
 * - categorizeChangelogEntry - A function that handles the changelog entry categorization process.
 * - CategorizeChangelogEntryInput - The input type for the categorizeChangelogEntry function.
 * - CategorizeChangelogEntryOutput - The return type for the categorizeChangelogEntry function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CategorizeChangelogEntryInputSchema = z.object({
  entry: z.string().describe('The changelog entry to categorize.'),
});
export type CategorizeChangelogEntryInput = z.infer<
  typeof CategorizeChangelogEntryInputSchema
>;

const CategorizeChangelogEntryOutputSchema = z.object({
  category: z
    .enum(['Features', 'Improvements', 'Bug Fixes', 'Other'])
    .describe('The category of the changelog entry.'),
  explanation: z
    .string()
    .describe('A brief explanation for the chosen category.'),
});
export type CategorizeChangelogEntryOutput = z.infer<
  typeof CategorizeChangelogEntryOutputSchema
>;

export async function categorizeChangelogEntry(
  input: CategorizeChangelogEntryInput
): Promise<CategorizeChangelogEntryOutput> {
  return categorizeChangelogEntryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'categorizeChangelogEntryPrompt',
  input: {schema: CategorizeChangelogEntryInputSchema},
  output: {schema: CategorizeChangelogEntryOutputSchema},
  prompt: `You are an expert in software release notes and changelog management.

Your task is to classify the following changelog entry into one of the following categories:
- 'Features': For new functionalities or significant additions.
- 'Improvements': For enhancements to existing features, performance boosts, or usability updates.
- 'Bug Fixes': For corrections to defects or issues.
- 'Other': For entries that do not fit into the above categories.

Provide a concise explanation for your categorization.

Changelog Entry: {{{entry}}}`,
});

const categorizeChangelogEntryFlow = ai.defineFlow(
  {
    name: 'categorizeChangelogEntryFlow',
    inputSchema: CategorizeChangelogEntryInputSchema,
    outputSchema: CategorizeChangelogEntryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
