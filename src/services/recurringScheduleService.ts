// recurringScheduleService.ts
import RecurringSchedule from "../models/RecurringSchedule";

// Business logic functions
export const getRecurringSchedules = async (query: string, priority: string) => {
    const filter: Record<string, any> = {};

    if (query) {
        filter.titlePrefix = { $regex: query, $options: "i" };
    }

    if (priority) {
        filter.priority = priority;
    }

    return RecurringSchedule.find(filter);
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
