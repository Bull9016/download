'use server';
/**
 * @fileOverview AI agent that generates plausible data science statistics for the admin dashboard.
 * This flow is useful for demos when no real data is available.
 *
 * - generateDataScienceStats - A function that generates statistics about project completion time and companies worked with.
 * - GenerateDataScienceStatsInput - The input type for the generateDataScienceStats function.
 * - GenerateDataScienceStatsOutput - The return type for the generateDataScienceStats function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDataScienceStatsInputSchema = z.object({
  startDate: z
    .string()
    .describe('The start date for the data range to calculate statistics for.'),
  endDate: z
    .string()
    .describe('The end date for the data range to calculate statistics for.'),
});
export type GenerateDataScienceStatsInput = z.infer<
  typeof GenerateDataScienceStatsInputSchema
>;

const GenerateDataScienceStatsOutputSchema = z.object({
  averageProjectCompletionTime: z
    .string()
    .describe('The average project completion time in days.'),
  topCompaniesWorkedWith: z
    .array(z.string())
    .describe('The top 5 companies contractors have worked with.'),
  mostInDemandSkills: z
    .array(z.string())
    .describe('The top 5 most in-demand skills based on project requirements.'),
  newUserGrowth: z
    .object({
      clients: z.number().describe('The number of new clients who joined.'),
      contractors: z
        .number()
        .describe('The number of new contractors who joined.'),
    })
    .describe('The growth in new users, separated by clients and contractors.'),
  projectSuccessRate: z
    .string()
    .describe(
      'The percentage of projects successfully completed, formatted as a string like "95%".'
    ),
});
export type GenerateDataScienceStatsOutput = z.infer<
  typeof GenerateDataScienceStatsOutputSchema
>;

export async function generateDataScienceStats(
  input: GenerateDataScienceStatsInput
): Promise<GenerateDataScienceStatsOutput> {
  return generateDataScienceStatsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateDataScienceStatsPrompt',
  input: {schema: GenerateDataScienceStatsInputSchema},
  output: {schema: GenerateDataScienceStatsOutputSchema},
  prompt: `You are a data scientist who generates plausible statistics for a contractor management platform's dashboard. You are given a start and end date. You must generate statistics based on imagined data, as if you had access to all the project, company, and user data you need.

Start Date: {{{startDate}}}
End Date: {{{endDate}}}

Generate the following statistics for the given period:
1. The average project completion time in days. Format this as a number followed by " days".
2. The top 5 companies that contractors have worked with.
3. The top 5 most in-demand skills based on project requirements.
4. The number of new clients and new contractors who joined.
5. The project success rate. Format this as a percentage string, e.g., "92%".

Your output must be plausible and professional, mirroring what a real-world dashboard would show.
`,
});

const generateDataScienceStatsFlow = ai.defineFlow(
  {
    name: 'generateDataScienceStatsFlow',
    inputSchema: GenerateDataScienceStatsInputSchema,
    outputSchema: GenerateDataScienceStatsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
