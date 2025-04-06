// recurringScheduleService.ts
import RecurringSchedule from '../models/RecurringSchedule';

// Business logic functions
export const getRecurringSchedules = async (
  query: string,
  priority: string,
  page: number = 1,
  limit: number = 10,
) => {
  const filter: Record<string, any> = {};

  if (query) {
    filter.titlePrefix = { $regex: query, $options: 'i' };
  }

  if (priority) {
    filter.priority = priority;
  }

  const taskFields = '_id title priority completed';

  // Calculate pagination parameters
  const skip = (page - 1) * limit;

  // Get total count for pagination
  const total = await RecurringSchedule.countDocuments(filter);
  const totalPages = Math.ceil(total / limit);

  // Get paginated results
  const schedules = await RecurringSchedule.find(filter)
    .populate('dependencies', taskFields)
    .populate('createdTasks', taskFields)
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  return {
    schedules,
    total,
    totalPages,
  };
};

export const getRecurringScheduleById = async (id: string) => {
  return RecurringSchedule.findById(id);
};

export const updateRecurringSchedule = async (id: string, data: any) => {
  return RecurringSchedule.findByIdAndUpdate(id, data, { new: true });
};

export const deleteRecurringSchedule = async (id: string) => {
  return RecurringSchedule.findByIdAndDelete(id);
};
