// mongo-init.js - This file will run when MongoDB container initializes
db = db.getSiblingDB('taskdb');

// Clear existing collections (if any)
db.tasks.drop();
db.recurringschedules.drop();

// Set up current date references for scheduling
const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);

const nextWeek = new Date(today);
nextWeek.setDate(nextWeek.getDate() + 7);

const nextMonth = new Date(today);
nextMonth.setMonth(nextMonth.getMonth() + 1);

// ----------------------------------------------------
// PART 1: Create independent tasks first
// ----------------------------------------------------

const independentTasks = [
  {
    title: 'Setup development environment',
    completed: true,
    priority: 'high',
  },
  {
    title: 'Create project documentation',
    completed: true,
    priority: 'medium',
  },
  {
    title: 'Design database schema',
    completed: true,
    priority: 'high',
  },
  {
    title: 'Buy office supplies',
    completed: false,
    priority: 'low',
  },
  {
    title: 'Schedule team meeting',
    completed: false,
    priority: 'medium',
  },
];

const independentTasksResult = db.tasks.insertMany(independentTasks);
print('Independent tasks inserted successfully!');

// ----------------------------------------------------
// PART 2: Create tasks with dependencies
// ----------------------------------------------------

// Implementation tasks (depends on design tasks)
const implementationTasks = [
  {
    title: 'Implement user authentication',
    completed: false,
    priority: 'high',
    dependencies: [
      independentTasksResult.insertedIds[0],
      independentTasksResult.insertedIds[2],
    ],
  },
  {
    title: 'Create database models',
    completed: false,
    priority: 'high',
    dependencies: [independentTasksResult.insertedIds[2]],
  },
  {
    title: 'Implement API endpoints',
    completed: false,
    priority: 'medium',
    dependencies: [independentTasksResult.insertedIds[2]],
  },
];

const implementationTasksResult = db.tasks.insertMany(implementationTasks);
print('Implementation tasks with dependencies inserted successfully!');

// Testing tasks (depends on implementation tasks)
const testingTasks = [
  {
    title: 'Write unit tests',
    completed: false,
    priority: 'medium',
    dependencies: [
      implementationTasksResult.insertedIds[1],
      implementationTasksResult.insertedIds[2],
    ],
  },
  {
    title: 'Perform integration testing',
    completed: false,
    priority: 'high',
    dependencies: [
      implementationTasksResult.insertedIds[0],
      implementationTasksResult.insertedIds[1],
      implementationTasksResult.insertedIds[2],
    ],
  },
];

const testingTasksResult = db.tasks.insertMany(testingTasks);
print('Testing tasks with dependencies inserted successfully!');

// ----------------------------------------------------
// PART 3: Create recurring schedules with varied frequencies
// ----------------------------------------------------

// Get some existing tasks to use as dependencies for recurring schedules
const existingTasks = db.tasks.find().toArray();

const recurringSchedules = [
  {
    titlePrefix: 'Daily Standup Meeting',
    priority: 'medium',
    frequency: 'daily',
    nextRunningDate: tomorrow,
    nextSuffixNumber: 1,
    createdTasks: [],
    dependencies: [],
  },
  {
    titlePrefix: 'Weekly Code Review',
    priority: 'high',
    frequency: 'weekly',
    nextRunningDate: nextWeek,
    nextSuffixNumber: 1,
    createdTasks: [],
    dependencies: [existingTasks[0]._id, existingTasks[1]._id], // Dependencies on setup and documentation
  },
  {
    titlePrefix: 'Monthly Report Generation',
    priority: 'medium',
    frequency: 'monthly',
    nextRunningDate: nextMonth,
    nextSuffixNumber: 1,
    createdTasks: [],
    dependencies: [],
  },
];

db.recurringschedules.insertMany(recurringSchedules);
print('Recurring schedules inserted successfully!');

// ----------------------------------------------------
// PART 4: Create a few recurring tasks that have already been generated
// ----------------------------------------------------

// Create a few tasks that were generated from recurring schedules
const recurringTasksGenerated = [
  {
    title: 'Daily Standup Meeting #0',
    completed: true,
    priority: 'medium',
  },
  {
    title: 'Weekly Code Review #0',
    completed: true,
    priority: 'high',
    dependencies: [existingTasks[0]._id, existingTasks[1]._id],
  },
];

const recurringTasksResult = db.tasks.insertMany(recurringTasksGenerated);

// Update the recurring schedules to link to their created tasks
db.recurringschedules.updateOne(
  { titlePrefix: 'Daily Standup Meeting' },
  { $push: { createdTasks: recurringTasksResult.insertedIds[0] } },
);

db.recurringschedules.updateOne(
  { titlePrefix: 'Weekly Code Review' },
  { $push: { createdTasks: recurringTasksResult.insertedIds[1] } },
);

print('Generated recurring tasks inserted and linked to schedules!');
print('All seed data has been successfully inserted.');

// Output statistics
print('Statistics:');
print('- Total tasks: ' + db.tasks.count());
print('- Completed tasks: ' + db.tasks.count({ completed: true }));
print('- Pending tasks: ' + db.tasks.count({ completed: false }));
print('- High priority tasks: ' + db.tasks.count({ priority: 'high' }));
print('- Medium priority tasks: ' + db.tasks.count({ priority: 'medium' }));
print('- Low priority tasks: ' + db.tasks.count({ priority: 'low' }));
print(
  '- Tasks with dependencies: ' +
    db.tasks.count({ dependencies: { $exists: true, $ne: [] } }),
);
print('- Recurring schedules: ' + db.recurringschedules.count());
