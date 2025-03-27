import Task, { ITask } from "../models/Task";
import RecurringSchedule, { IRecurringSchedule } from "../models/RecurringSchedule";
import moment from "moment";
import { Types } from "mongoose";
import { Frequency, mapFrequency } from "../utils";

// Define the types for incoming query params and task data

interface QueryParams {
  query?: string;
  priority?: string;
  completed?: boolean;
}

interface CreateTaskData {
  title: string;
  priority: string;
  dependencies: string[];
  recurring: boolean;
  recurringFrequency?: Frequency;
}

interface UpdateTaskData extends Partial<CreateTaskData> {
  completed?: boolean;
}

export const getTasks = async (queryParams: QueryParams): Promise<ITask[]> => {
  const { query, priority, completed } = queryParams;
  const filter: Record<string, any> = {};

  if (query) {
    filter.title = { $regex: query, $options: "i" };
  }

  if (priority) {
    filter.priority = priority;
  }

  if (completed !== undefined) {
    filter.completed = completed;
  }

  return await Task.find(filter);
};

export const getTaskById = async (id: string): Promise<ITask | null> => {
  return await Task.findById(id);
};

export const createTask = async (taskData: CreateTaskData): Promise<ITask> => {
  const { title, priority, dependencies, recurring, recurringFrequency } = taskData;

  if (recurring) {
    const initialSuffixNumber = 1;
    const taskDependencies = dependencies.map((id: string) => new Types.ObjectId(id));

    let task: ITask = new Task({
      title: `${title} - ${initialSuffixNumber}`,
      priority,
      dependencies: taskDependencies,
    });

    task = await task.save();

    const nextRunningDate: Date = moment().add(1, mapFrequency(recurringFrequency!)).toDate();
    const recurringSchedule: IRecurringSchedule = new RecurringSchedule({
      titlePrefix: title,
      priority,
      frequency: recurringFrequency!,
      createdTasks: [task._id],
      dependencies: taskDependencies,
      nextSuffixNumber: initialSuffixNumber + 1,
      nextRunningDate,
    });

    await recurringSchedule.save();
    return task;
  } else {
    let task: ITask = new Task({
      title,
      priority,
      completed: false,
      dependencies: dependencies.map((id: string) => new Types.ObjectId(id)),
    });

    task = await task.save();
    return task;
  }
};

export const updateTask = async (id: string, taskData: UpdateTaskData): Promise<ITask | null> => {
  const { completed, dependencies } = taskData;
  if (completed || dependencies) {
    const origTask = await Task.findById(id);
    if (completed && origTask?.dependencies) {
      const allTasks = await Task.find({});
      const incompleteDependantTask = origTask.dependencies.find(
        (depId) => {
            const depTask = allTasks.find((t) => t._id == depId);
            return depTask && !depTask.completed;
        }
      );

      if (incompleteDependantTask) {
        throw new Error("Not allowed to mark the task as complete, before its dependencies");
      }
    }

    if (dependencies && origTask?.completed) {
      throw new Error("Not allowed to update dependencies of an already completed task");
    }
  }

  return await Task.findByIdAndUpdate(id, taskData, { new: true });
};

export const deleteTask = async (id: string): Promise<ITask | null> => {
  // Remove the task from all RecurringSchedules
  await RecurringSchedule.updateMany(
    {
      $or: [
        { createdTasks: id },
        { dependencies: id },
      ],
    },
    {
      $pull: {
        createdTasks: id,
        dependencies: id,
      },
    }
  );

  // Remove the task from dependencies in all other tasks
  await Task.updateMany({ dependencies: id }, { $pull: { dependencies: id } });

  return await Task.findByIdAndDelete(id);
};
