
'use server';
/**
 * @fileOverview An AI agent that analyzes project descriptions to find the most in-demand skills.
 *
 * - analyzeProjectSkills - A function that takes a list of project descriptions and returns the top 5 skills.
 * - AnalyzeProjectSkillsInput - The input type for the analyzeProjectSkills function.
 * - AnalyzeProjectSkillsOutput - The return type for the analyzeProjectSkills function.
 */

import {ai} from '@/ai/genkit';
import { AnalyzeProjectSkillsInputSchema, AnalyzeProjectSkillsOutputSchema, type AnalyzeProjectSkillsInput, type AnalyzeProjectSkillsOutput } from '@/models/Analytics';

export async function analyzeProjectSkills(input: AnalyzeProjectSkillsInput): Promise<AnalyzeProjectSkillsOutput> {
  const prompt = ai.definePrompt({
    name: 'analyzeProjectSkillsPrompt',
    input: {schema: AnalyzeProjectSkillsInputSchema},
    output: {schema: AnalyzeProjectSkillsOutputSchema},
    prompt: `You are a data analyst specializing in the job market. You are given a list of project descriptions. Your task is to analyze these descriptions and identify the top 5 most in-demand skills.

Project Descriptions:
{{{json projectDescriptions}}}

Based on these descriptions, determine the 5 most frequently requested or implied skills. Return them as a list of strings.
`,
  });

  const analyzeProjectSkillsFlow = ai.defineFlow(
    {
      name: 'analyzeProjectSkillsFlow',
      inputSchema: AnalyzeProjectSkillsInputSchema,
      outputSchema: AnalyzeProjectSkillsOutputSchema,
    },
    async input => {
      const {output} = await prompt(input);
      return output!;
    }
  );
  
  return analyzeProjectSkillsFlow(input);
}
