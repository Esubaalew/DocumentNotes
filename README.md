# Document Notes App

A full-stack web application for secure note-taking. Users can register, log in, and manage their personal notes.

## Technical Stack

- **Backend:** C# with ASP.NET Core 8.0 Web API
- **Frontend:** React (Vite) with JavaScript
- **Authentication:** JSON Web Tokens (JWT)
- **Database:** SQLite (persistent storage)

---

## Instructions for Running the Application Locally

### Prerequisites
- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js](https://nodejs.org/)

### 1. Run the Backend API

```bash
# Navigate to the backend folder
cd NotesApi

# Restore dependencies and run the project
dotnet restore
dotnet run
```
- The API will start, typically on `http://localhost:5105` (see your terminal for the exact port).
- On first run, a SQLite database file (`notes.db`) will be created and seeded with demo data.
- API docs available at `/swagger` (e.g., `http://localhost:5105/swagger`).

### 2. Run the Frontend Application

In a **new terminal**:

```bash
# Navigate to the frontend folder
cd notes-app

# Install dependencies
npm install

# Start the development server
npm run dev
```
- The app will open at `http://localhost:5173`.

---

## Sample Login Credentials

Demo users are seeded automatically:

- **Username:** `demo`  
  **Password:** `demo123`
- **Username:** `test`  
  **Password:** `test123`

---

## Architecture and Design Decisions

- **Decoupled Frontend/Backend:**
  - The backend (ASP.NET Core Web API) and frontend (React) are separate projects, communicating via RESTful HTTP APIs.

- **JWT Authentication:**
  - Stateless authentication using JWT. The backend issues a signed token on login, which the frontend stores and sends with each request.

- **Persistent Storage with SQLite:**
  - Notes and users are stored in a SQLite database (`notes.db`).
  - On first run, the database is seeded with demo users and notes for easy testing.

- **Service-Oriented Backend:**
  - Core logic (authentication, note management) is encapsulated in service classes (`AuthService`, `NoteService`).
  - Controllers are thin and delegate to services, making the codebase testable and maintainable.

- **Unit Testing:**
  - Core logic is covered by unit tests using xUnit and EF Core's in-memory provider.
  - Run all tests with:
    ```sh
    dotnet test
    ```

- **Component-Based UI:**
  - The React frontend uses a component-based architecture for maintainability and scalability.

---

## Additional Notes
- If you want to reseed the database, delete `NotesApi/notes.db` and restart the backend.
- All sensitive configuration (JWT keys, etc.) is stored in `NotesApi/appsettings.json`.
- CORS is configured to allow requests from the frontend dev server (`http://localhost:5173`).

---

## API Documentation

- The backend API includes built-in **Swagger (OpenAPI)** support for interactive documentation and testing.
- Once the backend is running, visit:
  - `http://localhost:5105/swagger` (or the port shown in your terminal)
- You can explore and test all API endpoints directly from the Swagger UI.

---

For questions or contributions, please open an issue or pull request!
