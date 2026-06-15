'use server';
/**
 * @fileOverview A Genkit flow for generating a human-readable summary from technical commit messages.
 *
 * - generateFeatureSummary - A function that generates a concise feature summary.
 * - GenerateFeatureSummaryInput - The input type for the generateFeatureSummary function.
 * - GenerateFeatureSummaryOutput - The return type for the generateFeatureSummary function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateFeatureSummaryInputSchema = z.object({
  commitMessages: z
    .array(z.string())
    .describe('An array of technical commit messages.'),
});
export type GenerateFeatureSummaryInput = z.infer<
  typeof GenerateFeatureSummaryInputSchema
>;

const GenerateFeatureSummaryOutputSchema = z.object({
  summary: z
    .string()
    .describe(
      'A concise, human-readable summary of the feature or update based on the commit messages.'
    ),
});
export type GenerateFeatureSummaryOutput = z.infer<
  typeof GenerateFeatureSummaryOutputSchema
>;

export async function generateFeatureSummary(
  input: GenerateFeatureSummaryInput
): Promise<GenerateFeatureSummaryOutput> {
  return generateFeatureSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateFeatureSummaryPrompt',
  input: { schema: GenerateFeatureSummaryInputSchema },
  output: { schema: GenerateFeatureSummaryOutputSchema },
  prompt: `You are an expert release notes writer. Your task is to analyze a list of technical commit messages and synthesize them into a concise, human-readable summary for a new feature or update. Focus on the user-facing benefits and what the changes mean for the end user, rather than the technical implementation details.

Commit Messages:
{{#each commitMessages}}
- {{{this}}}
{{/each}}

Please provide a summary that is suitable for release notes. Place the summary in a JSON object with a single field called "summary".`,
});

const generateFeatureSummaryFlow = ai.defineFlow(
  {
    name: 'generateFeatureSummaryFlow',
    inputSchema: GenerateFeatureSummaryInputSchema,
    outputSchema: GenerateFeatureSummaryOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
