
# System Design: Geo 3D Contractor Transparency Hub

This document outlines the system architecture, components, and data flow for the Geo 3D Hub application.

---

## 1. High-Level Architecture

The Geo 3D Hub is a modern web application built on a **Monolithic Frontend with a Serverless Backend** architecture. This is achieved using the Next.js framework, which allows for both client-side rendering (CSR) and server-side rendering (SSR), along with backend API logic in a single, unified codebase.

- **Client**: A responsive web interface built with React and Next.js, accessible from any modern browser.
- **Server**: Serverless API routes hosted by the Next.js environment (e.g., on Vercel, or Firebase App Hosting).
- **Database**: A NoSQL MongoDB database for storing user, project, and application data.
- **AI Services**: Google's Generative AI (Gemini models) integrated via the Genkit framework for intelligent features.

```
+----------------+      +-------------------------+      +---------------------+
|   Web Browser  | <--> |   Next.js Application   | <--> |      MongoDB        |
| (User/Client)  |      |  (Frontend + Backend)   |      |      Database       |
+----------------+      +-----------+-------------+      +---------------------+
                                    |
                                    |
                            +-------v---------+
                            | Genkit AI Flows |
                            | (Google Gemini) |
                            +-----------------+
```

---

## 2. Component Breakdown

### 2.1. Frontend

The frontend is responsible for rendering the user interface and handling user interactions.

- **Framework**: **Next.js 14+ (App Router)** is used for its file-based routing, server components, and performance optimizations.
- **UI Library**: **React** is the core library for building interactive components.
- **UI Components**: **ShadCN UI** provides a set of accessible, unstyled components that are customized using **Tailwind CSS**. This allows for rapid development while maintaining a unique visual identity.
- **State Management**: Client-side state is managed using React hooks (`useState`, `useEffect`). For cross-component state, React Context (`useContext`) is used (e.g., for authentication).
- **Styling**: **Tailwind CSS** is used for utility-first styling, with a centralized theme defined in `src/app/globals.css` using HSL CSS variables for easy customization.

### 2.2. Backend (API Layer)

The backend logic resides within the Next.js application itself using **API Routes**.

- **Implementation**: API endpoints are defined in the `src/app/api/` directory. Each route is a serverless function that handles a specific HTTP request (GET, POST, PUT, DELETE).
- **Responsibilities**:
  - Handling CRUD (Create, Read, Update, Delete) operations for database models.
  - Interacting with the MongoDB database via Mongoose.
  - Encapsulating business logic (e.g., creating a new project, updating a user profile).
  - Eventually, handling user authentication and authorization logic.

### 2.3. Database

The database is the persistent storage layer for all application data.

- **Technology**: **MongoDB**, a NoSQL document database. It is chosen for its flexible schema, which is ideal for an evolving application where user and project data structures might change.
- **ODM (Object Data Mapper)**: **Mongoose** is used to define data schemas, validate data, and provide a structured way to interact with MongoDB from the Next.js backend.
- **Connection**: Managed by `src/lib/mongodb.ts`, which implements a cached connection pattern to optimize performance in a serverless environment.
- **Core Models**:
  - **`User`**: Stores information about all platform participants (admins, managers, clients, contractors). A single collection with a `role` field is used to differentiate user types.
  - **`Project`**: Stores all data related to a project, including its description, budget, status, timeline, and the AI-generated roadmap.

### 2.4. AI / Generative Layer

The application leverages generative AI for several key features.

- **Framework**: **Genkit** is used as the primary toolkit for all AI-related functionality. It provides a structured way to define, run, and monitor AI flows.
- **AI Model Provider**: **Google AI (Gemini)** is the underlying model provider, configured in `src/ai/genkit.ts`.
- **AI Flows**: Specific AI tasks are encapsulated in "flows" within the `src/ai/flows/` directory. Each flow is a server-side function that can be called from the frontend. Examples include:
  - `generateProjectRoadmap`: Creates a project plan from a description.
  - `analyzeContractorUpdates`: Assesses project progress from text updates.
  - `predictContractorPerformance`: Forecasts a contractor's potential based on their profile.
- **Schema-Driven Output**: Zod schemas are used to define the expected input and, crucially, the output structure for AI models. This ensures the AI returns clean, predictable JSON data that the application can easily parse and display.

---

## 3. Data Flow Examples

### 3.1. User Enrollment Flow

1.  A user fills out the enrollment form (e.g., `/enroll/contractor`).
2.  The React component on the page captures the form data in its state.
3.  On submission, the component makes a `POST` request to the `/api/users` endpoint, sending the user data in the request body.
4.  The API route handler (`src/app/api/users/route.ts`) receives the request.
5.  It uses the `User` model (Mongoose) to create a new document in the MongoDB database.
6.  The API route sends back a success response (201 Created) with the new user data.
7.  The frontend component receives the response and redirects the user to the login page.

### 3.2. AI Roadmap Generation Flow

1.  A user navigates to the project roadmap page (`/projects/[id]/roadmap`).
2.  The page fetches the project details from `/api/projects/[id]`.
3.  The user clicks the "Generate AI Roadmap" button.
4.  The React component calls the `generateProjectRoadmap` server-side function (which is an exported AI flow from `src/ai/flows/generate-project-roadmap.ts`).
5.  The Genkit flow constructs a prompt using the project's description and defined output schema.
6.  Genkit sends the request to the Google Gemini API.
7.  The Gemini API returns a structured JSON object matching the requested Zod schema.
8.  The flow returns this JSON to the frontend component.
9.  The component updates its state with the new roadmap data and renders it for the user to view and edit.
10. The user can then save this roadmap, which sends a `PUT` request to `/api/projects/[id]` to persist the data in MongoDB.

---

## 4. Scalability and Future Considerations

- **Scalability**: The serverless nature of Next.js API Routes allows the backend to scale automatically with demand. MongoDB is also designed for horizontal scalability.
- **Authentication**: The current system uses mock authentication. A full implementation would involve a service like Firebase Authentication or another third-party provider. The `useAuth` hook is a placeholder for this integration.
- **File Storage**: For project documents and user avatars, a dedicated cloud storage solution like Firebase Storage or AWS S3 would be required. Images would not be stored in the database.
- **Real-time Features**: For features like live chat and real-time notifications, WebSockets would be implemented, potentially using a service like Pusher or a self-hosted solution.
