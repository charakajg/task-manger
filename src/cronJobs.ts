import cron from "node-cron";
import RecurringSchedule from "./models/RecurringSchedule";
import Task from "./models/Task";
import moment from "moment";
import { mapFrequency } from "./utils";

// Note: This runs every hour, however
// Since our tasks runs only on daily/weekly/monthly basis, we could run it only once or twice a day
cron.schedule("0 * * * *", async () => {
  console.log("Running scheduled task check...");

  try {
    // Fetch all schedules whose nextRunningDate has passed
    const now = new Date();
    const schedules = await RecurringSchedule.find({ nextRunningDate: { $lte: now } });

    if (schedules.length === 0) {
      console.log("No scheduled tasks to create.");
      return;
    }

    for (const schedule of schedules) {
      console.log(`Processing schedule: ${schedule.titlePrefix}`);

      // Create a new task from the schedule
      const newTask = await Task.create({
        title: `${schedule.titlePrefix} - ${schedule.nextSuffixNumber}`,
        priority: schedule.priority,
        completed: false,
        dependencies: schedule.dependencies,
      });

      console.log(`Created new task: ${newTask.title}`);

      const newNextRunningDate = moment(schedule.nextRunningDate).add(1, mapFrequency(schedule.frequency)).toDate();

      // Update schedule with new values
      await RecurringSchedule.findByIdAndUpdate(schedule._id, {
        nextRunningDate: newNextRunningDate,
        nextSuffixNumber: schedule.nextSuffixNumber + 1,
        $push: { createdTasks: newTask._id },
      });

      console.log(`Updated schedule: ${schedule.titlePrefix}`);
    }

    console.log("All due tasks processed successfully.");
  } catch (error) {
    console.error("Error running scheduled task:", error);
  }
});
