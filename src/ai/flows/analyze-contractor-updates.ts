'use server';
/**
 * @fileOverview An AI agent that analyzes contractor work updates to assess project progress.
 *
 * - analyzeContractorUpdates - A function that analyzes contractor updates and visualizes project progress.
 * - AnalyzeContractorUpdatesInput - The input type for the analyzeContractorUpdates function.
 * - AnalyzeContractorUpdatesOutput - The return type for the analyzeContractorUpdates function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeContractorUpdatesInputSchema = z.object({
  projectDescription: z.string().describe('A detailed description of the project.'),
  contractorUpdates: z.string().describe('The daily work updates from the contractor.'),
  currentTimeline: z.string().optional().describe('The current project timeline, if available.'),
});
export type AnalyzeContractorUpdatesInput = z.infer<typeof AnalyzeContractorUpdatesInputSchema>;

const AnalyzeContractorUpdatesOutputSchema = z.object({
  progressSummary: z.string().describe('A summary of the project progress based on the updates.'),
  isOnTrack: z.boolean().describe('Whether the project is on track based on the updates.'),
  potentialDelays: z.string().describe('Any potential delays identified in the updates.'),
  revisedTimeline: z.string().optional().describe('A revised project timeline, if necessary.'),
});
export type AnalyzeContractorUpdatesOutput = z.infer<typeof AnalyzeContractorUpdatesOutputSchema>;

export async function analyzeContractorUpdates(input: AnalyzeContractorUpdatesInput): Promise<AnalyzeContractorUpdatesOutput> {
  return analyzeContractorUpdatesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeContractorUpdatesPrompt',
  input: {schema: AnalyzeContractorUpdatesInputSchema},
  output: {schema: AnalyzeContractorUpdatesOutputSchema},
  prompt: `You are an AI project tracker. Analyze the contractor's daily work updates in the context of the project description and current timeline (if available) to assess the project's progress, identify potential delays, and revise the timeline if necessary.

Project Description: {{{projectDescription}}}
Contractor Updates: {{{contractorUpdates}}}
Current Timeline: {{{currentTimeline}}}

Based on the above information, provide a summary of the project progress, determine if the project is on track, identify any potential delays, and suggest a revised timeline if necessary.

Output should follow the schema: ${JSON.stringify(AnalyzeContractorUpdatesOutputSchema.shape)}`,
});

const analyzeContractorUpdatesFlow = ai.defineFlow(
  {
    name: 'analyzeContractorUpdatesFlow',
    inputSchema: AnalyzeContractorUpdatesInputSchema,
    outputSchema: AnalyzeContractorUpdatesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
