import Task, { ITask } from '../models/Task';
import RecurringSchedule, {
  IRecurringSchedule,
} from '../models/RecurringSchedule';
import moment from 'moment';
import { Types } from 'mongoose';
import { Frequency, mapFrequency } from '../utils';

// Define the types for incoming query params and task data

interface QueryParams {
  query?: string;
  priority?: string;
  completed?: boolean;
  page?: number;
  limit?: number;
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

export const getTasks = async (
  queryParams: QueryParams,
): Promise<{
  tasks: ITask[];
  total: number;
  limit: number;
  page: number;
  totalPages: number;
}> => {
  let { query, priority, completed, page = 1, limit = 10 } = queryParams;

  // Sanitize and validate page and limit
  page = Math.max(1, parseInt(page as unknown as string, 10)); // Ensure page is a positive integer, default to 1
  limit = Math.max(1, Math.min(100, parseInt(limit as unknown as string, 10))); // Ensure limit is between 1 and 100

  const filter: Record<string, any> = {};

  if (query) {
    filter.title = { $regex: query, $options: 'i' };
  }

  if (priority) {
    filter.priority = priority;
  }

  if (completed !== undefined) {
    filter.completed = completed;
  }

  // Calculate skip and limit values based on page and limit
  const skip = (page - 1) * limit;

  // Fetch the tasks
  const tasks = await Task.find(filter)
    .skip(skip)
    .limit(limit)
    .populate('dependencies', '_id title priority completed');

  // Get the total number of tasks matching the filter
  const total = await Task.countDocuments(filter);

  // Calculate the total number of pages
  const totalPages = Math.ceil(total / limit);

  // Return tasks along with metadata
  return {
    tasks,
    total,
    limit,
    page,
    totalPages,
  };
};

export const getTaskById = async (id: string): Promise<ITask | null> => {
  return await Task.findById(id);
};

export const createTask = async (taskData: CreateTaskData): Promise<ITask> => {
  const { title, priority, dependencies, recurring, recurringFrequency } =
    taskData;

  const taskDependencies =
    dependencies && dependencies.length > 0
      ? dependencies
          .filter((e) => !!e)
          .map((id: string) => new Types.ObjectId(id))
      : [];

  if (recurring) {
    const initialSuffixNumber = 1;

    let task: ITask = new Task({
      title: `${title} - #${initialSuffixNumber}`,
      priority,
      dependencies: taskDependencies,
    });

    task = await task.save();

    const nextRunningDate: Date = moment()
      .add(1, mapFrequency(recurringFrequency!))
      .toDate();
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
      dependencies: taskDependencies,
    });

    task = await task.save();
    return task;
  }
};

export const updateTask = async (
  id: string,
  taskData: UpdateTaskData,
): Promise<ITask | null> => {
  const { completed, dependencies } = taskData;
  if (completed || dependencies) {
    const origTask = await Task.findById(id);
    if (completed && origTask?.dependencies) {
      const allTasks = await Task.find({});
      const incompleteDependantTask = origTask.dependencies.find((depId) => {
        const depTask = allTasks.find((t) => t._id == depId);
        return depTask && !depTask.completed;
      });

      if (incompleteDependantTask) {
        throw new Error(
          'Not allowed to mark the task as complete, before its dependencies',
        );
      }
    }

    if (dependencies && origTask?.completed) {
      throw new Error(
        'Not allowed to update dependencies of an already completed task',
      );
    }
  }

  return await Task.findByIdAndUpdate(id, taskData, { new: true });
};

export const deleteTask = async (id: string): Promise<ITask | null> => {
  // Remove the task from all RecurringSchedules
  await RecurringSchedule.updateMany(
    {
      $or: [{ createdTasks: id }, { dependencies: id }],
    },
    {
      $pull: {
        createdTasks: id,
        dependencies: id,
      },
    },
  );

  // Remove the task from dependencies in all other tasks
  await Task.updateMany({ dependencies: id }, { $pull: { dependencies: id } });

  return await Task.findByIdAndDelete(id);
};
