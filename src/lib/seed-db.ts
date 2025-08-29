
'use server';
// Ensure environment variables are loaded
import 'dotenv/config';
import mongoose from 'mongoose';
import dbConnect from './mongodb';
import User from '@/models/User';
import Project from '@/models/Project';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

const seedData = async () => {
  // Check if the script is being run to generate JSON or to seed the DB
  const generateJsonOnly = process.argv.includes('--generate-json');

  if (generateJsonOnly) {
    console.log('Generating DUMMY_DATA.json file...');
  } else {
    try {
      const conn = await dbConnect();
      if (!conn) {
        console.error('Database not configured. Seeding cannot proceed.');
        process.exit(1);
      }
      console.log('Database connected. Clearing existing data...');
      await User.deleteMany({});
      await Project.deleteMany({});
      console.log('Existing data cleared.');
    } catch (error) {
        console.error('Error connecting to or clearing the database:', error);
        process.exit(1);
    }
  }

  try {
    // --- User Data Definition ---
    const salt = await bcrypt.genSalt(10);
    const usersToCreate = [
      // Admin
      {
        _id: new mongoose.Types.ObjectId(),
        name: 'Admin User',
        email: 'admin@geo3dhub.com',
        password: await bcrypt.hash('password123', salt),
        role: 'admin',
        location: 'Headquarters',
        professionalTitle: 'Platform Administrator',
        joinedDate: new Date(),
      },
      // Managers
      {
        _id: new mongoose.Types.ObjectId(),
        name: 'Sarah Miller',
        email: 'manager.sarah@example.com',
        password: await bcrypt.hash('password123', salt),
        role: 'manager',
        location: 'New York, USA',
        professionalTitle: 'Senior Project Manager',
        joinedDate: new Date(),
      },
      {
        _id: new mongoose.Types.ObjectId(),
        name: 'James Brown',
        email: 'manager.james@example.com',
        password: await bcrypt.hash('password123', salt),
        role: 'manager',
        location: 'London, UK',
        professionalTitle: 'Construction Overseer',
        joinedDate: new Date(),
      },
      // Clients
      {
        _id: new mongoose.Types.ObjectId(),
        name: 'Client Corp',
        email: 'client.corp@example.com',
        password: await bcrypt.hash('password123', salt),
        role: 'client',
        companyName: 'Innovate Solutions Inc.',
        location: 'San Francisco, CA',
        joinedDate: new Date(),
      },
      {
        _id: new mongoose.Types.ObjectId(),
        name: 'John Property',
        email: 'client.john@example.com',
        password: await bcrypt.hash('password123', salt),
        role: 'client',
        location: 'Miami, FL',
        joinedDate: new Date(),
      },
      // Contractors
      {
        _id: new mongoose.Types.ObjectId(),
        name: 'Alice Johnson',
        email: 'contractor.alice@example.com',
        password: await bcrypt.hash('password123', salt),
        role: 'contractor',
        location: 'Austin, TX',
        professionalTitle: 'Full-Stack Developer',
        skills: ['React', 'Node.js', 'MongoDB', 'AWS', 'Next.js'],
        bio: 'Experienced full-stack developer with a passion for building scalable web applications.',
        joinedDate: new Date(),
      },
      {
        _id: new mongoose.Types.ObjectId(),
        name: 'Bob Smith',
        email: 'contractor.bob@example.com',
        password: await bcrypt.hash('password123', salt),
        role: 'contractor',
        location: 'London, UK',
        professionalTitle: 'Master Electrician',
        skills: ['Wiring', 'Panel Upgrades', 'Commercial', 'Inspections', 'Lighting'],
        bio: 'Certified Master Electrician with over 15 years of experience in commercial and residential projects.',
        joinedDate: new Date(),
      },
      {
        _id: new mongoose.Types.ObjectId(),
        name: 'Charlie Brown',
        email: 'contractor.charlie@example.com',
        password: await bcrypt.hash('password123', salt),
        role: 'contractor',
        location: 'Berlin, Germany',
        professionalTitle: 'Lead Plumber',
        skills: ['Piping', 'Fixtures', 'Water Heaters', 'New Construction'],
        bio: 'Specializing in new construction plumbing and high-efficiency systems.',
        joinedDate: new Date(),
      },
      {
        _id: new mongoose.Types.ObjectId(),
        name: 'Diana Prince',
        email: 'contractor.diana@example.com',
        password: await bcrypt.hash('password123', salt),
        role: 'contractor',
        location: 'Mumbai, India',
        professionalTitle: '3D Modeler & Architect',
        skills: ['AutoCAD', 'Blender', '3D Rendering', 'Architectural Design'],
        bio: 'Creative architect with expertise in creating stunning 3D visualizations.',
        joinedDate: new Date(),
      },
      {
        _id: new mongoose.Types.ObjectId(),
        name: 'Ethan Hunt',
        email: 'contractor.ethan@example.com',
        password: await bcrypt.hash('password123', salt),
        role: 'contractor',
        location: 'Pune, India',
        professionalTitle: 'General Contractor',
        skills: ['General Contracting', 'Framing', 'Roofing', 'Project Management'],
        bio: 'General contractor focused on delivering projects on time and on budget.',
        joinedDate: new Date(),
      },
    ];

    const clientUser = usersToCreate.find(u => u.role === 'client' && u.companyName === 'Innovate Solutions Inc.');
    const managerUser = usersToCreate.find(u => u.role === 'manager');
    const assignedContractors = usersToCreate.filter(u => u.role === 'contractor').slice(0, 3).map(c => c._id);
    
    if (!clientUser || !managerUser) {
        throw new Error('Could not find necessary client or manager for project creation.');
    }

    const projectsToCreate = [
      {
        name: 'GeoSpatial 3D Mapping Initiative',
        clientName: 'Innovate Solutions Inc.',
        description:
          'A project to develop a high-fidelity 3D map of an urban area using satellite imagery and ground-level data. Requires expertise in data processing and 3D visualization.',
        status: 'In Progress',
        progress: 75,
        startDate: new Date('2023-09-01'),
        deadline: new Date('2024-06-30'),
        budget: 1500000,
        tags: ['3D Modeling', 'Data Science', 'GeoSpatial'],
        createdBy: clientUser._id,
        manager: managerUser._id,
        assignedContractors: assignedContractors,
        roadmap: [],
        editHistory: [],
      },
      {
        name: 'AI-Powered Logistics Optimizer',
        clientName: 'Global Transport Co.',
        description:
          'Develop a machine learning model to optimize delivery routes and reduce fuel consumption for a large fleet of vehicles.',
        status: 'Planning',
        progress: 10,
        startDate: new Date('2024-02-01'),
        deadline: new Date('2024-12-01'),
        budget: 800000,
        tags: ['AI', 'Machine Learning', 'Logistics'],
        createdBy: clientUser._id,
        roadmap: [],
        editHistory: [],
      },
      {
        name: 'E-commerce Platform Upgrade',
        clientName: 'Retail Giant',
        description:
          'Complete overhaul of an existing e-commerce website to improve performance, user experience, and scalability. Requires Next.js and modern frontend technologies.',
        status: 'Completed',
        progress: 100,
        startDate: new Date('2023-01-15'),
        deadline: new Date('2023-10-01'),
        budget: 2500000,
        tags: ['Web Development', 'Next.js', 'E-commerce'],
        createdBy: clientUser._id,
        manager: managerUser._id,
        roadmap: [],
        editHistory: [],
      },
      {
        name: 'Residential Building Construction',
        clientName: 'John Property',
        description:
          'Construction of a 4-story residential building. Seeking a full team including general contractor, electricians, and plumbers.',
        status: 'On Hold',
        progress: 25,
        startDate: new Date('2023-05-10'),
        deadline: new Date('2025-05-10'),
        budget: 50000000,
        tags: ['Construction', 'Residential', 'General Contracting'],
        createdBy: clientUser._id,
        roadmap: [],
        editHistory: [],
      },
    ];

    if (generateJsonOnly) {
      // Prepare data for JSON output, converting ObjectId and Date
      const usersJson = usersToCreate.map(u => ({...u, _id: {$oid: u._id.toString()}, joinedDate: {$date: u.joinedDate.toISOString()}}));
      const projectsJson = projectsToCreate.map(p => ({
          ...p,
          _id: {$oid: new mongoose.Types.ObjectId().toString()},
          createdBy: {$oid: p.createdBy.toString()},
          manager: p.manager ? {$oid: p.manager.toString()} : undefined,
          assignedContractors: p.assignedContractors.map(id => ({$oid: id.toString()})),
          startDate: {$date: p.startDate.toISOString()},
          deadline: {$date: p.deadline.toISOString()},
      }))
      
      const dataToWrite = {
        users: usersJson,
        projects: projectsJson
      }
      
      fs.writeFileSync(
        path.join(process.cwd(), 'DUMMY_DATA.json'),
        JSON.stringify(dataToWrite, null, 2),
        'utf-8'
      );
      console.log('Successfully created DUMMY_DATA.json.');

    } else {
      console.log('Inserting data into the database...');
      await User.insertMany(usersToCreate);
      console.log(`${usersToCreate.length} users created successfully.`);

      await Project.insertMany(projectsToCreate);
      console.log(`${projectsToCreate.length} projects created successfully.`);
    }

  } catch (error) {
    console.error('Error during data generation/seeding:', error);
  } finally {
    if (!generateJsonOnly) {
      await mongoose.disconnect();
      console.log('Database connection closed.');
    }
  }
};

// Check if the script is run directly from the command line
if (require.main === module) {
  seedData();
}
