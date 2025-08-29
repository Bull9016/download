
'use server';
/**
 * @fileOverview An AI agent that generates a detailed project roadmap.
 *
 * - generateProjectRoadmap - A function that creates a roadmap with phases and milestones.
 */

import {ai} from '@/ai/genkit';
import { GenerateProjectRoadmapInputSchema, GenerateProjectRoadmapOutputSchema, type GenerateProjectRoadmapInput, type GenerateProjectRoadmapOutput } from '@/models/Project';

export async function generateProjectRoadmap(input: GenerateProjectRoadmapInput): Promise<GenerateProjectRoadmapOutput> {
  return generateProjectRoadmapFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateProjectRoadmapPrompt',
  input: {schema: GenerateProjectRoadmapInputSchema},
  output: {schema: GenerateProjectRoadmapOutputSchema},
  prompt: `You are an expert project manager specializing in construction and software projects. Your task is to create a detailed project roadmap based on the provided project description, start date, and deadline.

The roadmap must be broken down into logical phases (e.g., Planning, Development, Testing, Deployment). Each phase must contain a list of relevant milestones. Each milestone must have a unique ID, a name, a description, and an initial status of "Pending". Generate IDs for phases and milestones sequentially (e.g., p1, p2, m1, m2).

Analyze the project description to create realistic and relevant phases and milestones.

Project Description: {{{projectDescription}}}
Start Date: {{{startDate}}}
Deadline: {{{deadline}}}

Generate a comprehensive roadmap based on this information. The output must strictly follow the provided JSON schema.
`,
});

const generateProjectRoadmapFlow = ai.defineFlow(
  {
    name: 'generateProjectRoadmapFlow',
    inputSchema: GenerateProjectRoadmapInputSchema,
    outputSchema: GenerateProjectRoadmapOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
