
'use server';
/**
 * @fileOverview An AI agent that predicts a contractor's future performance and earnings.
 *
 * - predictContractorPerformance - A function that analyzes a contractor's history to make predictions.
 * - PredictContractorPerformanceInput - The input type for the function.
 * - PredictContractorPerformanceOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProjectHistoryItemSchema = z.object({
  name: z.string().describe('The name of the project.'),
  role: z.string().describe('The role the contractor had on the project.'),
  duration: z.string().describe('The duration of the project.'),
});

export const PredictContractorPerformanceInputSchema = z.object({
  contractorId: z.string(),
  skills: z.array(z.string()).describe("A list of the contractor's skills."),
  projectHistory: z.array(ProjectHistoryItemSchema).describe("A list of the contractor's past projects."),
  rating: z.number().describe("The contractor's average rating."),
});
export type PredictContractorPerformanceInput = z.infer<typeof PredictContractorPerformanceInputSchema>;

export const PredictContractorPerformanceOutputSchema = z.object({
  predictedEarnings: z.object({
    nextSixMonths: z.number().describe('Predicted earnings (in INR) for the next 6 months.'),
    nextYear: z.number().describe('Predicted earnings (in INR) for the next 12 months.'),
  }),
  predictedProjectTypes: z
    .array(z.string())
    .describe('An array of project types the contractor is likely to be matched with.'),
  predictionSummary: z
    .string()
    .describe('A textual summary explaining the predictions based on the provided data.'),
});
export type PredictContractorPerformanceOutput = z.infer<typeof PredictContractorPerformanceOutputSchema>;

export async function predictContractorPerformance(input: PredictContractorPerformanceInput): Promise<PredictContractorPerformanceOutput> {
  return predictContractorPerformanceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictContractorPerformancePrompt',
  input: {schema: PredictContractorPerformanceInputSchema},
  output: {schema: PredictContractorPerformanceOutputSchema},
  prompt: `You are a data science expert specializing in the construction industry labor market. Your task is to predict a contractor's future performance based on their profile.

Analyze the following contractor data:
- Skills: {{{json skills}}}
- Project History: {{{json projectHistory}}}
- Rating: {{{rating}}}

Based on this data, you must provide a plausible and optimistic prediction for their potential earnings in INR for the next 6 and 12 months. Also, predict the top 3 types of projects they are most likely to be hired for. Finally, provide a brief summary explaining your prediction, highlighting their strengths.

The market is strong, so be encouraging in your analysis. Generate realistic but positive numbers for earnings.

Output must follow the specified JSON schema.
`,
});

const predictContractorPerformanceFlow = ai.defineFlow(
  {
    name: 'predictContractorPerformanceFlow',
    inputSchema: PredictContractorPerformanceInputSchema,
    outputSchema: PredictContractorPerformanceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
