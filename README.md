# Feycback

Feycback is a Node.js and Express backend for a user-facing application with authentication, profile management, image entry tracking, and Clarifai face-detection support. It uses Prisma with PostgreSQL for the online database layer and includes an offline Knex/PostgreSQL setup for local development.

## Features

- User registration with hashed passwords.
- User sign-in with credential verification.
- Profile retrieval by user ID.
- Image entry counting for tracked user activity.
- Clarifai-powered image URL analysis.
- Prisma-backed online database support.
- Knex-based offline server support for local PostgreSQL development.

## Tech Stack

- Node.js
- Express
- PostgreSQL
- Prisma
- Knex
- bcrypt
- Clarifai
- dotenv-flow
- CORS

## Project Structure

- `index.js`: Main Prisma-based server entry point.
- `prisma.js`: Prisma client initialization.
- `server-online.js`: Online server version with Clarifai integration.
- `server-offline.js`: Offline server version using Knex.
- `backup.sql`: PostgreSQL database dump containing `users` and `login` tables.
- `Controllers/`: Route handlers for authentication, profiles, and image actions.

## Database

The bundled `backup.sql` file contains a PostgreSQL dump with two core tables:

- `login`: Stores user email and password hash.
- `users`: Stores profile data such as name, surname, email, entry count, and joined date.

The schema enforces unique email addresses in both tables and uses auto-incrementing IDs.

## Setup

### Prerequisites

- Node.js 24.x
- npm 11.x
- PostgreSQL
- A Prisma-compatible database URL
- A Clarifai API key for image analysis endpoints

### Install dependencies

```bash
npm install
```

### Initialize Prisma

```bash
npm run prisma:generate
```

### Configure environment variables

Create a `.env` file with values similar to:

```env
PORT=8080
NODE_ENV=development
DATABASE_URL=your_database_url
API_CLARIFAI=your_clarifai_api_key
DATABASE_PASSWORD_LOCAL=your_local_postgres_password
```

## Running the app

### Start the Prisma server

```bash
npm start
```

### Start in development

```bash
npm run start:dev
```

### Open Prisma Studio

```bash
npm run prisma:studio
```

## API Endpoints

| Method | Route | Description |
|---|---|---|
| GET | `/` | Tests database connectivity. |
| GET | `/users` | Returns all users. |
| POST | `/signIn` | Authenticates an existing user. |
| POST | `/register` | Registers a new user. |
| GET | `/profile/:id` | Returns a user profile by ID. |
| PUT | `/image` | Increments a user's image entry count. |
| POST | `/imageURL` | Sends an image URL to Clarifai for analysis. |

## Notes

- Passwords are hashed with bcrypt before storage.
- Registration uses a transaction to keep login and user records in sync.
- The repository includes both online and offline server variants, so the active entry point depends on the deployment target.

## License

This project is published under the ISC license.
