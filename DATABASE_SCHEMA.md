
# Database Schema Diagram for Geo 3D Hub

This document provides a visual representation and explanation of the MongoDB database schema used in the Geo 3D Hub application.

---

## High-Level Diagram

This text-based diagram illustrates the relationship between the `Users` and `Projects` collections. It shows a "one-to-many" relationship where one User (like a client or manager) can be associated with multiple Projects, and a "many-to-many" relationship for contractors assigned to projects.

```
+---------------------------------+
|             Users             |
|---------------------------------|
| _id: ObjectId (Primary Key)     |
| name: String                    |
| email: String (Unique)          |
| role: String (Enum)             |
| location: String                |
| professionalTitle: String (c)   |
| skills: [String] (c)            |
| bio: String (c)                 |
| companyName: String (cl)        |
| ...                             |
+---------------------------------+
       |         |           |
       |         |           |
 (manager) |   (createdBy)   | (assignedContractors)
       |         |           |
       V         V           V
+----------------------------------+
|             Projects             |
|----------------------------------|
| _id: ObjectId (Primary Key)      |
| name: String                     |
| description: String              |
| status: String (Enum)            |
| roadmap: [Object]                |
| editHistory: [Object]            |
| ...                              |
|----------------------------------|
| createdBy: ObjectId (ref: User)  | --< (One User creates Many Projects)
| manager: ObjectId (ref: User)    | --< (One User manages Many Projects)
| assignedContractors: [ObjectId]  | --< (Many Users can be on Many Projects)
+----------------------------------+
```

### Key:
- `(c)`: Field specific to `contractor` role.
- `(cl)`: Field specific to `client` role.

---

## Collection Details

### 1. `Users` Collection

-   **Purpose**: Stores information for every individual on the platform, regardless of their role. A single collection is used for simplicity and efficiency in querying all users at once.
-   **Schema File**: `src/models/User.ts`
-   **Key Fields**:
    -   `_id`: Unique identifier for each user document.
    -   `role`: A critical field that differentiates between `admin`, `manager`, `client`, and `contractor`. This determines their permissions and the data fields relevant to them.

### 2. `Projects` Collection

-   **Purpose**: Stores all data related to a specific project, from its initial description to its final roadmap.
-   **Schema File**: `src/models/Project.ts`
-   **Key Fields**:
    -   `_id`: Unique identifier for each project document.
    -   `roadmap`: An array of embedded documents that contains the full, structured project plan. This data is stored directly within the project to ensure it's always retrieved together, reducing the need for extra database queries.
    -   `editHistory`: Another embedded array that logs all changes to the roadmap, providing a complete audit trail.

### 3. Relationships (`Refs`)

-   **How they work**: Instead of joining tables like in SQL, MongoDB uses references. We store the `_id` of a document from one collection inside a field in another. For example, the `createdBy` field in a `Project` document holds the `_id` of the `User` who created it.
-   **`createdBy`**: A direct reference to a single `User` document.
-   **`manager`**: A direct reference to a single `User` document.
-   **`assignedContractors`**: An array of `ObjectId`s, where each ID references a different `User` document with the `contractor` role. This creates the "many-to-many" link.
-   **Population**: When we need to fetch a project and see the details of the manager (like their name and email), we use Mongoose's `.populate('manager')` method. This efficiently looks up the referenced user and "joins" the data for the API response.
