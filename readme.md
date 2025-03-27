
# Task Manager

## Features

- **Task management**: Create, read, edit, and delete tasks.
- **Recurring jobs**: Schedule recurring tasks that can run daily, weekly, monthly

## Scope and areas for improvement

* Due to time limitations, some of the improvedments were not made. However, ALL the features requested in assigment are there.
* Note that unit tests have only been added for services under /src/services/ (API/Integration/e2e tests have not been included)
* Views under /client/screens/ could have been broken down into smaller components
* UI is sort of sketchy and it can significantly be improved (as in the following screenshots)
* A cron job to check new tasks that need to be created runs every hour. However, we can change it to once/twice a day (since the minimum frequency is daily). For testing purposes, it can be changed to 1 minutes.

# UI Screenshots

<img width="1372" alt="Screenshot 2025-03-27 at 13 52 04" src="https://github.com/user-attachments/assets/a1a45aba-4fa3-4baf-a329-506e797393d6" />
<img width="1416" alt="Screenshot 2025-03-27 at 13 52 31" src="https://github.com/user-attachments/assets/62d4092a-dd0c-4ec0-b8c0-fc8ec3a60e2a" />
<img width="1382" alt="Screenshot 2025-03-27 at 13 52 49" src="https://github.com/user-attachments/assets/dfd3cbd6-510d-4c31-82d0-7c6f69283359" />
<img width="1390" alt="Screenshot 2025-03-27 at 13 53 33" src="https://github.com/user-attachments/assets/6ab446f5-6d61-4886-9bab-54ed106646f6" />
<img width="1341" alt="Screenshot 2025-03-27 at 13 53 57" src="https://github.com/user-attachments/assets/9afc3be5-3063-4f9d-9c61-a79cb145dd5e" />
<img width="479" alt="Screenshot 2025-03-27 at 13 54 14" src="https://github.com/user-attachments/assets/3bc77281-54e0-474b-a357-ccf5025b9032" />
<img width="1148" alt="Screenshot 2025-03-27 at 13 54 28" src="https://github.com/user-attachments/assets/facc21b7-afc7-419c-9654-990dd8c94231" />
<img width="1418" alt="Screenshot 2025-03-27 at 13 54 38" src="https://github.com/user-attachments/assets/cfa5dd3b-2b7a-4cb2-9ae6-d146da482b0e" />

# DB Screenshots
<img width="1152" alt="Screenshot 2025-03-27 at 14 26 45" src="https://github.com/user-attachments/assets/032ab5e6-0d4e-4afb-a0f4-10f61e90317d" />
<img width="1140" alt="Screenshot 2025-03-27 at 14 28 14" src="https://github.com/user-attachments/assets/deb3ee0b-ef48-491e-94e3-7988cf916447" />


## Setting up

### Setup environment variables:

Update `.env` file in the root directory

```plaintext
MONGO_URI=<your-mongo-db-uri>
```

Note that you can use `docker-compose up -d` to setup docker

### Run the development server:

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

## How to test recurring tasks for dev/testing purposes

Since you may not wait for hours/days to test recurring tasks.
You can do the following:

- First create a recurring task with a prefered frequency
- <img width="1408" alt="Screenshot 2025-03-27 at 14 37 11" src="https://github.com/user-attachments/assets/3fd5a13f-aca6-416f-8639-791b2b3df2b6" />
- Now, you must be able to see the schedule under "Recurring Schedules" in UI and there should be a task (first task) that had been already created
- The next running date for the given task should be correct based on the frequency that you set.
- <img width="1408" alt="Screenshot 2025-03-27 at 14 37 11" src="https://github.com/user-attachments/assets/3fdae2cb-945f-446b-b1ed-73d02b4121ed" />
- If you want to test it soon, you can change the `nextRunningDate` via a MongoDB tool in db and set it to today.
- <img width="865" alt="Screenshot 2025-03-27 at 14 40 15" src="https://github.com/user-attachments/assets/a7607b89-c3a5-4c69-87bb-8fbb8fca2bb9" />
- Then when it automatically runs next hour, it will create a new task. You can speed this up further by changing the cronjob to run every minute (Replace "0 * * * *" with "* * * * *") under cronJobs.ts (Note that this hadn't been made configurable due to time limitations, so you would have to edit manually, for now)
- <img width="775" alt="Screenshot 2025-03-27 at 14 41 27" src="https://github.com/user-attachments/assets/549d8404-c3cc-4e8e-b689-335137047dee" />

