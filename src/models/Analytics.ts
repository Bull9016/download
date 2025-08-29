
import { z } from 'zod';

// Zod schemas for the AI flow that analyzes project skills
export const AnalyzeProjectSkillsInputSchema = z.object({
  projectDescriptions: z.array(z.string()).describe('A list of project descriptions.'),
});

export const AnalyzeProjectSkillsOutputSchema = z.object({
  mostInDemandSkills: z.array(z.string()).describe('The top 5 most in-demand skills based on the project descriptions.'),
});

// TypeScript types inferred from the Zod schemas
export type AnalyzeProjectSkillsInput = z.infer<typeof AnalyzeProjectSkillsInputSchema>;
export type AnalyzeProjectSkillsOutput = z.infer<typeof AnalyzeProjectSkillsOutputSchema>;
