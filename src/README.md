# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## MongoDB Configuration

To enable database features, you need to connect the application to a MongoDB instance. You can get a free database from [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register).

Follow these steps to connect your database:

1.  **Create a MongoDB Atlas Account:** Sign up for a free account if you don't have one.

2.  **Create a New Project and Cluster:** Follow the on-screen instructions to create a new project and then build a new cluster. The free "M0" tier is sufficient for this application.

3.  **Configure Database Access:**
    *   In your cluster's "Database Access" section, create a new database user with a username and password. Make sure to grant this user "Read and write to any database" access.
    *   In the "Network Access" section, add your current IP address to the IP access list. A quick way to do this is to click "Add Current IP Address".

4.  **Get Your Connection String:**
    *   Go back to your cluster's "Overview" and click the "Connect" button.
    *   Select "Drivers" as your connection method.
    *   You will see a connection string that looks something like this: `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`

5.  **Update `.env` file:**
    *   Copy the connection string.
    *   Replace `<username>` and `<password>` with the credentials for the database user you created in step 3.
    *   Paste the complete and updated string into the `MONGODB_URI` variable in your `.env` file.

After saving the `.env` file, the application will automatically connect to your database, and features like user management and project creation will be fully functional.

## Firebase Configuration

To enable authentication and other Firebase services, you need to add your project's credentials to the `.env` file.

Follow these steps to find your Firebase configuration values:

1.  **Go to the Firebase Console:** Open [https://console.firebase.google.com/](https://console.firebase.google.com/) in your browser.

2.  **Select Your Project:** Choose the Firebase project you want to use for this application. **The project name does not need to be "Geo 3D Hub".** You can use any existing project or create a new one for free.

3.  **Go to Project Settings:** In the left sidebar, click the gear icon (⚙️) next to "Project Overview" and select **Project settings**.

4.  **Find Your Web App:** In the **General** tab, scroll down to the "Your apps" card. Click on your web app to see its configuration. If you don't have a web app yet, click the `</>` (Web) icon to create one.

5.  **Get Config Values:** In the app settings, find the section named **Firebase SDK snippet** and select the **Config** option. You will see a code block that looks like this:

    ```javascript
    const firebaseConfig = {
      apiKey: "AIzaSy...",
      authDomain: "your-project-id.firebaseapp.com",
      projectId: "your-project-id",
      storageBucket: "your-project-id.appspot.com",
      messagingSenderId: "1234567890",
      appId: "1:1234567890:web:abcdef123456"
    };
    ```

6.  **Update `.env` file:** Copy the values from the `firebaseConfig` object and paste them into your `.env` file, matching the variable names.

    For example:
    - `apiKey` goes into `NEXT_PUBLIC_FIREBASE_API_KEY`
    - `authDomain` goes into `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
    - `projectId` goes into `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
    - ...and so on.

After saving the `.env` file, the application will automatically use your credentials, and authentication will work correctly.
