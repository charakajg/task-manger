
# Task Manager

## Features

- **Task management**: Create, read, edit, and delete tasks.
- **Recurring jobs**: Schedule recurring tasks that can run daily, weekly, monthly

## Setting up

### 3. Setup environment variables:

Update `.env` file in the root directory

```plaintext
MONGO_URI=<your-mongo-db-uri>
```

Note that you can use `docker-compose up -d` to setup docker

### 4. Run the development server:

To build, run

```bash
npm run buid:dev
```

To start the development environment, run:

```bash
npm run start:dev
```

## Additonal scripts

- `npm run test`: Run Jest tests.
- `npm run seed`: Seed the database with sample data.

## Project Structure

Some of the folders and files

```
├── client/                     # React frontend
├── src/                        # Node.js backend
│   ├── seed.ts                 # Seeder script
│   ├── models/                 # Mongoose models
│   └── routes/                 # Backend API logic
│   └── services/               # Backend service logic (only included unit tests for these)
│   └── cronJobs.ts             # This has the logic for recurring task schedule
├── dist/                       # Compiled output
├── tsconfig.json               # TypeScript configuration
├── webpack.config.js           # Webpack configuration
├── docker-compose.yml          # Docker compose file to setup mongodb
└── .env                        # Environment variables
```

## Technologies

- **Frontend**: React, Zustand, React Router, CSS/SASS
- **Backend**: Node.js, Express, Mongoose, Node-Cron
- **Testing**: Jest
