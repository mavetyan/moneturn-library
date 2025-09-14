# Moneturn Book Library

A full-stack book library management system built with Node.js, React, and PostgreSQL.

## Tech Stack

- **Backend**: Node.js, TypeScript, Fastify, Prisma
- **Frontend**: React, TypeScript, TailwindCSS, Vite
- **Database**: PostgreSQL with Docker

## Quick Start

1. **Start database**
   ```bash
   docker-compose up -d
   ```

2. **Setup backend**
   ```bash
   cd backend
   npm install
   npx prisma generate
   npx prisma db push
   npm run dev
   ```

3. **Setup frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Access application**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:3001

## Features

- CRUD operations for books and authors
- Real-time UI updates
- Responsive design
- Error handling and validation
- API testing with Jest

## API Endpoints

**Authors**: `GET|POST|PUT|DELETE /authors`
**Books**: `GET|POST|PUT|DELETE /books`

## Author

**Mher Avetyan** - [@mavetyan](https://github.com/mavetyan)