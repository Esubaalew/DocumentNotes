# Document Notes Viewer with Authentication

This is a simple full-stack web application built for a technical assignment. It allows users to log in, create text-based notes, and view a list of their own notes.

## Technical Stack

*   **Backend:** C# with ASP.NET Core 8.0 Web API
*   **Frontend:** React (Vite) with JavaScript
*   **Authentication:** JSON Web Tokens (JWT)
*   **Database:** In-memory static data store (no database required)

---

## How to Run the Application Locally

You will need [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0) and [Node.js](https://nodejs.org/) installed on your machine.

### 1. Run the Backend API

First, start the backend server.

```bash
# Navigate to the backend folder
cd NotesApi

# Restore dependencies and run the project
dotnet run
```
The API will start running, typically on `https://localhost:7123`. You can visit `https://localhost:7123/swagger` to see the API documentation.

### 2. Run the Frontend Application

In a **new terminal**, start the React frontend.

```bash
# Navigate to the frontend folder
cd notes-app

# Install dependencies
npm install

# Start the development server
npm run dev
```
The application will open in your browser, typically at `http://localhost:5173`.

---

## Sample Login Credentials

The application uses a hardcoded list of users for authentication. You can use the following credentials to log in:

*   **Username:** `user1`
*   **Password:** `password1`

---
*   **Username:** `user2`
*   **Password:** `password2`

---

## Architecture and Design Decisions

*   **Decoupled Frontend/Backend:** The application is split into two separate projects: a C# ASP.NET Core Web API for the backend and a React application for the frontend. This is a modern, scalable architecture that allows for independent development and deployment. The two communicate via HTTP requests, with the backend exposing a RESTful API.

*   **JWT for Authentication:** JWT was chosen for authentication because it is stateless and works perfectly for decoupled applications. After a user logs in, the API issues a signed token. The React frontend stores this token and includes it in the `Authorization` header for all subsequent requests to protected endpoints. The API validates the token on each request to identify and authorize the user.

*   **In-Memory Data Store:** As per the project requirements, a simple static C# class (`InMemoryDataStore`) is used for data persistence. This avoids the complexity of setting up a database for this assignment. The data is pre-populated with sample users and notes and will reset every time the application restarts.

*   **Component-Based UI:** The React frontend is built with a component-based architecture. The main `App` component manages authentication state, and conditionally renders either the `Login` component or the `NotesDashboard` component. This separation of concerns makes the code cleaner and easier to manage.
