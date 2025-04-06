# Task Manager

## Features

- **Task management**: Create, read, edit, and delete tasks.
- **Recurring jobs**: Schedule recurring tasks that can run daily, weekly, or monthly.
- **Task dependencies**: Tasks can have dependencies that must be completed first.
- **Pagination**: Both task and schedule lists support pagination for better performance.
- **Filtering and sorting**: Filter tasks by status, priority, or search text.

## Limitations and Areas for Improvement

- Note that unit tests have only been added for services under /src/services/ (API/Integration/e2e tests have not been included).
- Some views under /client/screens/ could be further broken down into smaller components.
- Confirmation for actions like delete could have been added
- A third-party library (such as Tailwind) could be used to simplify styling even more.
- There may be areas where further validations need to be added on the API side.
- The cron job to create recurring tasks runs every hour. This could eve, be changed to once/twice a day (since the minimum frequency is daily). For testing purposes, it can be changed to 1 minute.

# UI Screenshots

<img width="500" alt="Tasks Screen" src="https://github.com/user-attachments/assets/4c488c8c-4060-4cc4-badd-dc2941557476" />
<img width="500" alt="New Task Form" src="https://github.com/user-attachments/assets/51f8af6f-19f5-4693-8a36-b5db9893afc6" />
<img width="500" alt="Edit Task Form" src="https://github.com/user-attachments/assets/3074dfbc-c4be-4fb3-a94f-e7af61fb4f75" />
<img width="500" alt="Schedules Screen" src="https://github.com/user-attachments/assets/8cf25375-14c8-4dac-b128-59e5dcc0aee3" />

# DB Screenshots

<img width="500" alt="DB Tasks Collection" src="https://github.com/user-attachments/assets/3c497eb8-c6cf-40df-99ac-90a03bc1d33c" />
<img width="500" alt="DB RecurringSchedules Collection" src="https://github.com/user-attachments/assets/16506d86-0120-4862-a135-2437faf4fc86" />

# API Docs

Available at http://localhost:3000/api-docs

<img width="500" alt="Swagger GET API" src="https://github.com/user-attachments/assets/5d471a72-667b-479e-b121-552fa36ca4f0" />
<img width="500" alt="Swagger Docs" src="https://github.com/user-attachments/assets/0746849b-8f10-4e67-8dd6-4e964a1776c1" />

# Test Coverage

Note that tests are added only for service functions

<img width="500" alt="Test Coverage" src="https://github.com/user-attachments/assets/ecf80dd1-7ca2-4ef5-ab9d-b6b26fe0ef6a" />

## Setting up

### Running (using Docker)

Use
`npm run docker:up`

The application includes additonal docker support with the following commands:

```bash
# Start application and database containers
npm run docker:up

# Stop and remove containers
npm run docker:down

# Reload (stop and then start)
npm run docker:reload

```

### Setup environment variables:

If you want to directly run for development purposes, update `.env` file in the root directory to point to the MongoDB URI.

```plaintext
MONGO_URI=<your-mongo-db-uri>
```

No need to configure this if you run directly with docker. 

### Runing for development (without using docker):

To build, run

```bash
npm run build:dev
```

To start the development environment, run:

```bash
npm run start:dev
```

## Additional Scripts

- `npm run test`: Run Jest tests
- `npm run test:coverage`: Run tests with coverage report
- `npm run lint`: Check code for linting issues
- `npm run lint:fix`: Fix lint issues automatically
- `npm run format`: Format files with Prettier
- `npm run build`: Build the application

## Project Structure

Some of the folders and files

```
├── client/                     # React frontend
├── src/                        # Node.js backend
│   ├── models/                 # Mongoose models
│   ├── routes/                 # Backend API logic
│   ├── services/               # Backend service logic (only included unit tests for these)
│   └── cronJobs.ts             # This has the logic for recurring task schedule
├── dist/                       # Compiled output
├── docker-entrypoint-initdb.d/
│   └── mongo-init.js           # Seed data for mongodb
├── tsconfig.json               # TypeScript configuration
├── webpack.config.js           # Webpack configuration
├── docker-compose.yml          # Docker compose file to setup mongodb
└── .env                        # Environment variables
```

## Technologies

- **Frontend**: React, Zustand, React Router, CSS/SASS
- **Backend**: Node.js, Express, Mongoose, Node-Cron
- **Testing**: Jest

## How to test recurring tasks for dev/testing purposes

Since you may not wait for hours/days to test recurring tasks.
You can do the following:

- First create a recurring task with a prefered frequency
  
<img width="400" alt="Add Task - Select Frequency" src="https://github.com/user-attachments/assets/9069caa0-3ab5-48e7-bd45-3bd11ca27833" />

- Now, you must be able to see the schedule under "Recurring Schedules" in UI and there should be a task (first task) that had been already created
- The next running date for the given task should be correct based on the frequency that you set.

<img width="500" alt="Schedules - Check" src="https://github.com/user-attachments/assets/74e93795-5230-49a5-8885-51c9e8f98071" />

- If you want to test it soon, you can change the `nextRunningDate` via a MongoDB tool in db and set it to today.
  
<img width="500" alt="DB nextRunningDate" src="https://github.com/user-attachments/assets/a7607b89-c3a5-4c69-87bb-8fbb8fca2bb9" />

- Then when it automatically runs next hour, it will create a new task. You can speed this up further by changing the cronjob to run every minute (Replace `0 * * *` with `* * * *`) under `cronJobs.ts` (Note that this hadn't been made configurable due to time limitations, so you would have to edit manually, for now)

<img width="500" alt="Code configuration" src="https://github.com/user-attachments/assets/549d8404-c3cc-4e8e-b689-335137047dee" />
