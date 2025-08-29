
import mongoose, { Schema, Document, models, Model, Types } from 'mongoose';
import { z } from 'zod';

// Zod Schemas for AI Flows
export const GenerateProjectRoadmapInputSchema = z.object({
  projectDescription: z.string().describe('A detailed description of the project.'),
  startDate: z.string().describe('The project start date in ISO format.'),
  deadline: z.string().describe('The project deadline in ISO format.'),
});

const MilestoneSchema = z.object({
    id: z.string().describe("A unique identifier for the milestone (e.g., 'm1', 'm2')."),
    name: z.string().describe("The name of the milestone."),
    description: z.string().describe("A brief description of what this milestone entails."),
    status: z.enum(['Pending', 'In Progress', 'Completed']).describe("The current status of the milestone.")
});

const RoadmapPhaseSchema = z.object({
    id: z.string().describe("A unique identifier for the phase (e.g., 'p1', 'p2')."),
    name: z.string().describe("The name of the project phase (e.g., 'Phase 1: Planning & Design')."),
    description: z.string().describe("A summary of what this phase will accomplish."),
    milestones: z.array(MilestoneSchema).describe("A list of milestones within this phase.")
});

export const GenerateProjectRoadmapOutputSchema = z.object({
  roadmap: z.array(RoadmapPhaseSchema).describe("The structured project roadmap with phases and milestones."),
});

// TypeScript types inferred from Zod schemas
export type GenerateProjectRoadmapInput = z.infer<typeof GenerateProjectRoadmapInputSchema>;
export type GenerateProjectRoadmapOutput = z.infer<typeof GenerateProjectRoadmapOutputSchema>;


// Mongoose Interfaces and Schemas
export interface Milestone extends z.infer<typeof MilestoneSchema> {}

export interface RoadmapPhase extends z.infer<typeof RoadmapPhaseSchema> {}

export interface EditHistory {
  timestamp: Date;
  editor: string; // For simplicity, storing name. Could be a User ObjectId ref.
  change: string;
}


export interface IProject extends Document {
  name: string;
  clientName: string;
  description: string;
  status: 'Planning' | 'In Progress' | 'Completed' | 'On Hold';
  progress: number;
  deadline: Date;
  startDate: Date;
  budget: number;
  tags: string[];
  manager?: Types.ObjectId;
  assignedContractors: Types.ObjectId[];
  createdBy: Types.ObjectId; // User who created the project (client)
  roadmap: RoadmapPhase[];
  editHistory: EditHistory[];
}

const MongooseMilestoneSchema: Schema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'In Progress', 'Completed'], default: 'Pending' },
});

const MongooseRoadmapPhaseSchema: Schema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  milestones: [MongooseMilestoneSchema],
});

const EditHistorySchema: Schema<EditHistory> = new Schema({
    timestamp: { type: Date, default: Date.now },
    editor: { type: String, required: true },
    change: { type: String, required: true },
});

const ProjectSchema: Schema<IProject> = new Schema({
  name: { type: String, required: true },
  clientName: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ['Planning', 'In Progress', 'Completed', 'On Hold'], default: 'Planning' },
  progress: { type: Number, default: 0, min: 0, max: 100 },
  deadline: { type: Date, required: true },
  startDate: { type: Date, required: true },
  budget: { type: Number, required: true },
  tags: [{ type: String }],
  manager: { type: Schema.Types.ObjectId, ref: 'User' },
  assignedContractors: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  roadmap: { type: [MongooseRoadmapPhaseSchema], default: [] },
  editHistory: { type: [EditHistorySchema], default: [] },
}, { timestamps: true });

const Project: Model<IProject> = models.Project || mongoose.model<IProject>('Project', ProjectSchema);

export default Project;
