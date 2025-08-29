# Geo 3D Hub

This is a Next.js application built with Firebase Studio. It serves as a platform to connect clients with construction and 3D modeling contractors, featuring AI-powered tools for project management and smart matching.

---

## Getting Started

To run this project on your local machine, follow these steps:

1.  **Install Dependencies:** Open your terminal, navigate to the project's root directory, and run the following command to install all the necessary packages:
    ```bash
    npm install
    ```

2.  **Configure Environment Variables:** Before running the application, you must set up your API keys in the `.env` file. See the **Configuration** section below for detailed instructions.

3.  **Run the Development Server:** After configuration, start the development server by running:
    ```bash
    npm run dev
    ```

The application will now be running and accessible at [http://localhost:9002](http://localhost:9002).

---

## Configuration (`.env` file)

To enable all features, you need to configure two main services in your `.env` file: **MongoDB** and **Google AI**.

### 1. MongoDB Setup (for the Database)

Your application needs to connect to a MongoDB database to store user and project data.

1.  **Get a MongoDB Connection String:** You can use a free cloud database from [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) or run a local MongoDB instance.
2.  **Find Your Connection String:**
    *   **For a local instance**, the string is typically `mongodb://localhost:27017/<your_db_name>`.
    *   **For MongoDB Atlas**, navigate to your cluster, click "Connect," select "Drivers," and copy the connection string provided. Remember to replace `<username>` and `<password>` with your database user credentials.
3.  **Update the `.env` file:** Open the `.env` file in the root of your project and set the `MONGODB_URI` variable to your connection string.

    ```env
    # Example for local MongoDB
    MONGODB_URI="mongodb://localhost:27017/geo3dhub"

    # Example for MongoDB Atlas
    # MONGODB_URI="mongodb+srv://your_user:your_password@cluster0.xxxxx.mongodb.net/your_db_name"
    ```

### 2. Google AI API Key Setup (for AI Features)

The AI features in this application (like roadmap generation and analytics) are powered by Google's Gemini models through Genkit. This requires a Google AI API key.

1.  **Get Your API Key:**
    *   Go to **[Google AI Studio](https://aistudio.google.com/app/apikey)**.
    *   Click "**Create API key in new project**".
    *   Copy the generated API key.
2.  **Update the `.env` file:** Open the `.env` file and paste your key into the `GEMINI_API_KEY` variable.

    ```env
    # For Generative AI features using Genkit and Google AI
    GEMINI_API_KEY="YOUR_API_KEY_HERE"
    ```

After saving the `.env` file with both your `MONGODB_URI` and `GEMINI_API_KEY`, all features of the application will be fully enabled.

---

## Populating Your Database

You have two options to populate your database with sample data.

### Option 1: Generate a JSON Data File (Recommended for manual import)

If you prefer to have a raw JSON file that you can inspect or import manually using a tool like MongoDB Compass, you can generate one.

1. Run the following command in your terminal:
    ```bash
    npm run generate-seed-json
    ```
2. This will create a `DUMMY_DATA.json` file in your project's root directory. You can copy the contents of this file to import into your `users` and `projects` collections.

### Option 2: Seed the Database Directly (Recommended for quick setup)

To automatically populate your connected MongoDB database with sample data (users, projects, etc.), you can run the seed script directly.

1.  **Ensure your `.env` file has the correct `MONGODB_URI`**.
2.  Run the following command in your terminal:
    ```bash
    npm run seed
    ```
This will clear your existing `Users` and `Projects` collections and fill them with the sample data defined in `src/lib/seed-db.ts`. This is highly recommended for quickly seeing the app in action.
