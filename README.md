Prerequisites
Before you get started, make sure you have the following installed on your system:

Node.js (version 20.x or higher)
NVM v0.38.0
pnpm v9.4.0
npm (version 10.x.x or higher) or Yarn (version 1.22.x or higher)
Docker Desktop 4.25.2 (129061). (for running services in containers)
Git (for version control)

# Project Setup Guide

Welcome to the Project Setup Guide! This document provides you with all the necessary information to get this project up and running on your machine. Whether you're looking to contribute or just want to explore the functionalities, you're in the right place.

## Prerequisites

Before you get started, make sure you have the following installed on your system:

- Node.js (version 20.x or higher)
- NVM v0.38.0
- pnpm v9.4.0
- npm (version 10.x.x or higher) or Yarn (version 1.22.x or higher)
- Docker Desktop 4.25.2 (129061). (for running services in containers)
- Git (for version control)

## Installation Steps

1. **Fork and clone the Repository**

   Start by forking and then cloning the project repository to your local machine:

   ```bash
   git clone https://github.com/taoshidev/request-network-ui.git
   cd request-network-ui
   ```

2. **Install Dependencies**

   Use npm/pnpm or Yarn to install the project dependencies:

   ```bash
   # Using pnpm
   pnpm install

   # Using Yarn
   yarn install
   ```

3. **Environment Configuration**

   Copy the `.env.example` file to create your own `.env or .env.local` file. Adjust the variables to match your environment setup:

   ```bash
   cp .env.example .env.local
   ```

   Make sure to replace the placeholders in the `.env or .env.local` file with your actual environment variables.

4. **Database Setup**

   This app uses supabase, an open source Firebase alternative (https://supabase.com/). To setup your local supabase installation, follow the official supabase documentation here: https://supabase.com/docs/guides/cli/local-development. With the app and database running, you need to run database migration to setup the initial database schema. Run the following command to execute migrations:

   ```bash
   pnpm db:push or pnpm db:migrate
   # or
   yarn db:push or pnpm db:migrate
   ```

6. **Start the Application**

   Once the database is set up, you can start the application server:

   ```bash
   pnpm build && pnpm start
   # or
   yarn build && yarn start
   ```

   To run the server on development mode:

   ```bash
   pnpm dev
   # or
   yarn dev
   ```

   Running the server on development mode will enable live reload through nodemon. Any code changes you made in the src directory will be reactive (will re-transpile, and made available)

   This command will start the server, making the application available at `http://localhost:3000` by default (or another port, depending on your `.env` configuration).

## Development Workflow

- **Running the Development Server**

  For development, you might want to use the development server with hot-reload functionality:

  ```bash
  pnpm dev
  # or
  yarn dev
  ```

- **Running Tests**

  Execute the test suite to ensure your changes haven't broken existing functionality:

  ```bash
  pnpm test
  # or
  yarn test
  ```

- **Building for Production**

  To create a production build, run:

  ```bash
  pnpm build
  # or
  yarn build
  ```

  This command compiles TypeScript to JavaScript, optimizing for production environments.

## Contributing

We welcome contributions to this project! Please refer to the CONTRIBUTING.md file for detailed guidelines on how to contribute.
