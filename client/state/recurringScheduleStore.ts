import { create } from 'zustand';
import axios from 'axios';
import { API_PATH, Frequency } from '../constants';
const RECURRING_SCHEDULE_ROUTE_URL = `${API_PATH}/recurring-schedules`;

interface RecurringSchedule {
    _id: number;
    titlePrefix: string;
    priority: string;
    frequency: string;
    completed: boolean;
    dependencies: string[];
    createdTasks: string[];
    createdAt: Date;
    nextRunningDate: Date;
    nextSuffixNumber: number;
}

interface RecurringScheduleStore {
    recurringSchedules: RecurringSchedule[];
    loading: boolean;
    error: string | null;

    fetchAll: () => Promise<void>;
    updateSchedule: (id: number, changes: { titlePrefix?: string, priority?: string, frequency?: string, dependencies?: string[]}) => Promise<void>;
    removeSchedule: (id: number) => Promise<void>;
}

// Create store for recurring schedules
const recurringScheduleStore = create<RecurringScheduleStore>((set) => ({
  recurringSchedules: [],
  loading: false,
  error: null,
  fetchAll: async() => {
    set({loading: true, error: null});
    try {
        const response = await axios.get<RecurringSchedule[]>(RECURRING_SCHEDULE_ROUTE_URL);
        const recurringSchedules = response.data;
        set({ recurringSchedules: recurringSchedules, loading: false });
    } catch (error) {
        set({ error: 'Failed to fetch recurring schedules', loading: false});
    }
  },
  updateSchedule: async(id, changes) => {
    set({loading: true, error: null});
    try {
        const response = await axios.put<RecurringSchedule>(`${RECURRING_SCHEDULE_ROUTE_URL}/${id}`, changes);
        const updatedRec = response.data;
        set((state) => {
            //Note that the record is removed from the local store, in order to prevent additional http calls
            const fnMap = (rec: RecurringSchedule) => rec._id === id ? updatedRec : rec;
            return { recurringSchedules: state.recurringSchedules.map(fnMap), loading: false};
        });
    } catch (error) {
        set({ error: 'Failed to update recurring schedule', loading: false});
    }
  },
  removeSchedule: async(id) => {
    set({loading: true, error: null});
    try {
        await axios.delete(`${RECURRING_SCHEDULE_ROUTE_URL}/${id}`);
        set((state) => {
            //Note that the record is updated in the local store, in order to prevent additional http calls
            const fnFilter = (rec: RecurringSchedule) => rec._id !== id;
            return { recurringSchedules: state.recurringSchedules.filter(fnFilter), loading: false};
        });
    } catch (error) {
        set({ error: 'Failed to remove recurring schedule', loading: false});
    }
  },
}));

export default recurringScheduleStore;
