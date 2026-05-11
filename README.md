# HobHub — Backend

HobHub is a hobby-based social networking app that connects people through shared interests. Users build a profile, list their hobbies with skill levels, browse others, save favourites, and chat in real time.

This repository is the backend: a Node.js + TypeScript GraphQL API built with Apollo Server and Express. It handles authentication, user data, hobby matching, real-time messaging via WebSockets, and profile image uploads via Cloudinary.

> **Status:** Work in progress — core features are implemented, polish and additional features are planned.

## Tech Stack

| Layer | Library / Tool |
|---|---|
| Runtime | Node.js + TypeScript |
| HTTP server | Express 5 |
| GraphQL server | Apollo Server 5 |
| ORM | Prisma 7 |
| Database | PostgreSQL |
| Real-time | WebSockets (`ws`) |
| Auth | JWT + Google OAuth (`google-auth-library`) |
| Image uploads | Cloudinary |
| Password hashing | bcryptjs |

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database

### Install & run

```bash
npm install

# Run database migrations
npx prisma migrate dev

# Start the dev server with hot reload
npm run dev
```

The server starts at `http://localhost:3000` by default.

### Environment Variables

Create a `.env` file in the project root:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/hobhub

JWT_SECRET=your-jwt-secret

GOOGLE_CLIENT_ID=your-google-client-id

CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Optional — defaults to 3000
PORT=3000
```

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start with hot reload via tsx |
| `npm run build` | Generate Prisma client + compile TypeScript |
| `npm start` | Run the compiled production build |

## API

| Endpoint | Protocol | Description |
|---|---|---|
| `/graphql` | HTTP POST | GraphQL API |
| `/` | WebSocket | Real-time messaging |

During development the GraphQL playground is available at `http://localhost:3000/graphql`.

## GraphQL Overview

**Queries**
- `me` / `user(id)` — fetch user profiles
- `browseUsers` — discover other users
- `hobbies` / `hobby(id)` — hobby catalogue
- `myConversations` / `conversation(id)` / `conversationMessages(id)` — messaging

**Mutations**
- `registerUser` / `loginUser` / `loginWithGoogle` — authentication
- `completeOnboarding` — set up profile after registration
- `updateUser` / `deleteUser` — profile management
- `addUserHobby` — link a hobby to a user with a skill level
- `sendMessage` — send a chat message
- `getUploadSignature` — get a signed Cloudinary upload URL

The full schema lives in [`src/schema.graphql`](src/schema.graphql).

## Project Structure

```
src/
├── auth/          JWT context middleware and Google OAuth
├── config/        Prisma client and app config
├── resolvers/     GraphQL resolvers
├── schema.graphql GraphQL type definitions
├── services/      Business logic
├── types/         Shared TypeScript types
├── utils/         Utility functions
├── websocket/     WebSocket server and handlers
└── index.ts       Entry point

prisma/
├── schema.prisma  Database schema (User, Hobby, Conversation, Message)
└── migrations/    Prisma migration history
```

## Data Model

- **User** — profile info, hobbies, saved users, conversations
- **Hobby** — hobby catalogue (name)
- **UserHobby** — join table linking users to hobbies with an optional skill level
- **SavedUser** — bookmarked / saved user pairs
- **Conversation** — a direct conversation between two users
- **ConversationMessage** — individual messages within a conversation

## Related

- [hobhub-frontend](https://github.com/hobhub-app/hobhub-frontend) — React web and mobile app
