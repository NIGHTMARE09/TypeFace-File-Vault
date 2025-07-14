# Typeface File Vault

A minimalistic Dropbox-like file management app. Users can upload, view, and download files through a modern web interface.

## Features

- **User Management:** Register, login, and logout.
- **File Operations:** Upload, preview, list, download, and delete files.
- **Modern UI:** Minimalistic design with Tailwind CSS, clear visual feedback, and a consistent color palette.

## Tech Stack

- **Backend:**
  - Node.js & Express: Server framework.
  - TypeScript: Adds static typing.
  - Multer: Handles file uploads.
  - Prisma: ORM for database interaction.

- **Frontend:**
  - React: JavaScript library for building user interfaces.
  - Vite: Fast frontend build tool.
  - Tailwind CSS: Utility-first CSS framework for styling.

## Persistent Storage

This project utilizes persistent storage for both file metadata and the actual file data:

- **File Metadata:** Information about uploaded files (filename, size, type, etc.) is stored persistently in a **PostgreSQL database** via the Prisma ORM. The database schema is defined in `backend/prisma/schema.prisma`.
- **File Data:** The actual content of the uploaded files is stored persistently on the backend server's local file system within the `uploads` directory.

## Frontend State Management

Frontend state is primarily managed using React's built-in hooks (`useState`, `useEffect`). Authentication state is handled via a custom `AuthContext` using React's Context API. A `useDebounce` hook is used for handling debounced input.

## Setup

### Prerequisites

- Node.js (v14 or higher recommended)
- npm or yarn
- **PostgreSQL database**

### Backend

1. Navigate to the `backend/` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure your PostgreSQL database connection string in a `.env` file in the `backend/` directory. Example:
   ```env
   DATABASE_URL="postgresql://user:password@host:port/database?schema=public"
   ```
4. Apply database migrations using Prisma:
   ```bash
   npx prisma migrate dev --name initial_schema
   ```
   (Replace `initial_schema` with a descriptive name if you've made schema changes)
5. Generate the Prisma client:
   ```bash
   npx prisma generate
   ```
6. Run the development server:
   ```bash
   npm run dev
   ```

### Frontend

1. Navigate to the `frontend/` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

## Git Workflow

This project is organized in a single repository with `backend` and `frontend` directories. Use standard Git commands to manage and update the repository.

## License

This project is licensed under the MIT License.