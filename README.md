# AI Agent Backend

This is a [NestJS](https://nestjs.com/) backend service for the AI Agent project. It provides RESTful APIs for authentication (Google/Apple OAuth, JWT), user management, chat, media, and agent management.

---

## Table of Contents

- [AI Agent Backend](#ai-agent-backend)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Project Structure](#project-structure)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the Project](#running-the-project)
    - [Development](#development)
    - [Production](#production)
    - [With Docker](#with-docker)
  - [Testing](#testing)
  - [API Documentation](#api-documentation)
  - [License](#license)

---

## Features

- Google and Apple OAuth authentication (web and mobile)
- JWT authentication
- User profile management
- AI agent management (create, update, delete, list)
- Chat and media modules
- TypeORM with PostgreSQL
- MinIO integration for media storage
- Redis integration
- Swagger API documentation

---

## Project Structure

```
ai-agent-be/
├── .env.example           # Example environment variables
├── .env                   # Your environment variables (not committed)
├── Dockerfile*            # Docker build files
├── docker-compose.yml     # Docker Compose for local development
├── nest-cli.json
├── package.json
├── README.md
├── src/
│   ├── app.module.ts
│   ├── main.ts
│   ├── common/
│   ├── config/
│   ├── modules/
│   │   ├── agent/
│   │   ├── auth/
│   │   ├── chat/
│   │   ├── media/
│   │   ├── socket/
│   │   ├── user/
│   │   └── vector-store/
│   └── proto/
└── test/
```

---

## Getting Started

### Prerequisites

- Node.js (v22+ recommended)
- npm (v9+ recommended)
- Docker & Docker Compose (optional, for local development)

### Installation

```bash
git clone https://github.com/your-org/ai-agent-be.git
cd ai-agent-be
npm install
```

---

## Environment Variables

Copy `.env.example` to `.env` and fill in your configuration:

```bash
cp .env.example .env
```

Key variables:

- `PORT` - API server port
- `DB_*` - PostgreSQL database config
- `MINIO_*` - MinIO storage config
- `REDIS_*` - Redis config
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` - Google OAuth
- `APPLE_CLIENT_ID`, `APPLE_TEAM_ID`, `APPLE_KEY_ID`, `APPLE_PRIVATE_KEY_PATH` - Apple OAuth
- `WEB_REDIRECT_URL` - Web OAuth redirect URL
- `JWT_SECRET` - JWT signing secret

---

## Running the Project

### Development

```bash
npm run start:dev
```

### Production

```bash
npm run build
npm run start:prod
```

### With Docker

```bash
docker-compose up --build
```

---

## Testing

- **Unit tests:**  
  ```bash
  npm run test
  ```

- **E2E tests:**  
  ```bash
  npm run test:e2e
  ```

- **Test coverage:**  
  ```bash
  npm run test:cov
  ```

---

## API Documentation

After starting the server, Swagger docs are available at:

```
http://localhost:8000/api
```

---

## License

This project is UNLICENSED.  
See the [LICENSE](LICENSE) file
