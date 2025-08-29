
# Web Pages and User Flow Overview

This document outlines the primary web pages of the Geo 3D Hub application, their purpose, and the intended user roles for each.

---

## Public & Authentication Pages

These pages are accessible to anyone, including users who are not logged in.

-   **/login**: The main login page for all user roles. This page also serves as the target for specialized logins like `/client-login`.
-   **/enroll/client**: The registration form for new clients. Upon successful registration, users are redirected to the `/login` page.
-   **/enroll/contractor**: The registration form for new contractors. Upon successful registration, users are redirected to the `/login` page.
-   **/about-us**: A public page describing the mission and vision of Geo 3D Hub. It links to login and enrollment pages.
-   **/privacy-policy**: The platform's privacy policy, accessible from the public footer.
-   **/terms-of-service**: The platform's terms of service, accessible from the public footer.
-   **/not-found (404)**: A user-friendly page shown for any invalid URL.

---

## Core Application Pages (Authenticated Users)

These pages are accessible only after a user has logged in. The specific content may vary based on the user's role.

-   **/**: The main **Dashboard**. This is the landing page after login, providing a summary of projects and communications.
    -   *Connects to*: `/projects/[id]`, `/contractors/[id]`, `/chat`.
    -   *Access*: All roles.
-   **/projects**: The **Projects Overview** page. Displays a list of all available projects in a card format.
    -   *Connects to*: `/projects/new`, `/projects/[id]`.
    -   *Access*: All roles.
-   **/projects/new**: The **Create New Project** form. Allows clients and managers to post new projects. After submission, it redirects to `/projects`.
    -   *Access*: Client, Manager, Admin.
-   **/projects/[id]**: The **Project Details** page. Shows a detailed view of a single project, including its status, team, description, and tabs for more specific information.
    -   *Connects to*: `/projects/[id]/roadmap`, `/contractors/[id]` (for team members).
    -   *Access*: All roles (though access might be restricted based on project assignment).
-   **/projects/[id]/roadmap**: The **AI Project Roadmap** page. A special page for generating, viewing, and editing the project's phased roadmap and milestones. Tracks edit history.
    -   *Access*: Client, Manager, Contractor (assigned to the project), Admin.
-   **/contractors**: The **Find Contractors** page. A gallery view of all available contractors on the platform.
    -   *Connects to*: `/contractors/[id]`.
    -   *Access*: Client, Manager, Admin.
-   **/contractors/[id]**: The **Contractor Profile** page. A detailed public profile for a single contractor, showcasing their skills, rating, project history, and an AI-powered performance forecast.
    -   *Connects to*: `/chat`.
    -   *Access*: All roles.
-   **/matching**: The **Smart Contractor Matching** page. An AI-powered tool for clients to find the best contractors based on detailed project requirements.
    -   *Access*: Client, Manager, Admin.
-   **/chat**: The main **Messages** interface, showing a list of conversations.
    -   *Connects to*: `/chat/[id]`.
    -   *Access*: All roles.
-   **/chat/[id]**: The detailed view of a **single chat conversation**.
    -   *Access*: All roles (participants of the chat).
-   **/account/settings**: The **User Account Settings** page. Allows a logged-in user to manage their own profile information, password, and preferences.
    -   *Access*: All roles.

---

## Admin Section Pages

These pages are exclusively for users with the `admin` role and are grouped under the `/admin` URL path. They are all interconnected via the admin sidebar navigation.

-   **/admin**: The **Admin Dashboard**. Provides an overview of platform statistics and quick links to all other administrative actions.
-   **/admin/analytics**: The **Analytics Dashboard**. A visual dashboard with charts and KPIs on user growth, project completion rates, and contractor performance.
-   **/admin/users**: The **User Management** page. A table view of all users on the platform, allowing admins to view profiles. Connects to `/contractors/[id]`.
-   **/admin/roles**: The **Role Management** page. Defines the different user roles on the platform.
-   **/admin/work-allocation**: A tool for **assigning contractors** to projects.
-   **/admin/managers**: A page to view and **manage project managers**.
-   **/admin/appearance**: A settings page to **customize the site's theme colors** and manage images.
-   **/admin/activity-log**: An audit log that tracks important actions taken across the platform.
-   **/admin/settings**: A page for configuring global **system settings**.
