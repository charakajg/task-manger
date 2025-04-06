import { create } from 'zustand';
import axios from 'axios';
import { API_PATH } from '../constants';
import { Task } from './taskStore';
const RECURRING_SCHEDULE_ROUTE_URL = `${API_PATH}/recurring-schedules`;

export interface RecurringSchedule {
  _id: number;
  titlePrefix: string;
  priority: string;
  frequency: string;
  completed: boolean;
  dependencies: Partial<Task>[];
  createdTasks: Partial<Task>[];
  createdAt: Date;
  nextRunningDate: Date;
  nextSuffixNumber: number;
}

interface RecurringScheduleStore {
  recurringSchedules: RecurringSchedule[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  itemsPerPage: number;
  total: number;
  totalPages: number;

  fetchAll: (page?: number) => Promise<void>;
  updateSchedule: (
    id: number,
    changes: {
      titlePrefix?: string;
      priority?: string;
      frequency?: string;
      dependencies?: string[];
    },
  ) => Promise<void>;
  removeSchedule: (id: number) => Promise<void>;
  changePage: (page: number) => Promise<void>;
}

// Create store for recurring schedules
const recurringScheduleStore = create<RecurringScheduleStore>((set, get) => ({
  recurringSchedules: [],
  loading: false,
  error: null,
  currentPage: 1,
  itemsPerPage: 5,
  total: 0,
  totalPages: 0,

  changePage: async (page: number) => {
    await get().fetchAll(page);
  },

  fetchAll: async (page = 1) => {
    const { itemsPerPage } = get();
    set({ loading: true, error: null });
    try {
      const queryParams = { page, limit: itemsPerPage };
      const response = await axios.get<{
        schedules: RecurringSchedule[];
        total: number;
        totalPages: number;
      }>(
        `${RECURRING_SCHEDULE_ROUTE_URL}?${new URLSearchParams({
          page: page.toString(),
          limit: itemsPerPage.toString(),
        }).toString()}`,
      );

      // Handle both formats - paginated or non-paginated response
      if (response.data.schedules) {
        // Paginated response
        const { schedules, total, totalPages } = response.data;
        set({
          recurringSchedules: schedules,
          total,
          totalPages,
          currentPage: page,
          loading: false,
        });
      } else {
        // Non-paginated response (fallback)
        const schedules = response.data as unknown as RecurringSchedule[];
        set({
          recurringSchedules: schedules,
          total: schedules.length,
          totalPages: 1,
          currentPage: 1,
          loading: false,
        });
      }
    } catch (error) {
      set({ error: 'Failed to fetch recurring schedules', loading: false });
    }
  },
  updateSchedule: async (id, changes) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.put<RecurringSchedule>(
        `${RECURRING_SCHEDULE_ROUTE_URL}/${id}`,
        changes,
      );
      const updatedRec = response.data;
      set((state) => {
        //Note that the record is removed from the local store, in order to prevent additional http calls
        const fnMap = (rec: RecurringSchedule) =>
          rec._id === id ? updatedRec : rec;
        return {
          recurringSchedules: state.recurringSchedules.map(fnMap),
          loading: false,
        };
      });
    } catch (error) {
      set({ error: 'Failed to update recurring schedule', loading: false });
    }
  },
  removeSchedule: async (id) => {
    set({ loading: true, error: null });
    try {
      await axios.delete(`${RECURRING_SCHEDULE_ROUTE_URL}/${id}`);
      set((state) => {
        //Note that the record is updated in the local store, in order to prevent additional http calls
        const fnFilter = (rec: RecurringSchedule) => rec._id !== id;
        return {
          recurringSchedules: state.recurringSchedules.filter(fnFilter),
          loading: false,
        };
      });
    } catch (error) {
      set({ error: 'Failed to remove recurring schedule', loading: false });
    }
  },
}));

export default recurringScheduleStore;
