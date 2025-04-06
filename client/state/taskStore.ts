import { create } from 'zustand';
import axios from 'axios';
import { API_PATH, Frequency } from '../constants';

const TASK_ROUTE_URL = `${API_PATH}/tasks`;

export interface Task {
  _id: number;
  title: string;
  priority: string;
  completed: boolean;
  dependencies: Partial<Task>[];
}

interface TaskStore {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  searchQuery?: string;
  filterCompleted?: boolean;
  filterPriority?: string;
  currentPage: number; // Track current page
  itemsPerPage: number; // Track items per page
  total: number; // Total number of tasks available
  totalPages: number; // Total number of pages

  addTask: (newTodo: {
    title: string;
    priority: string;
    dependencies: string[];
    recurring: boolean;
    recurringFrequency?: Frequency;
  }) => Promise<void>;
  updateTask: (
    id: number,
    changes: {
      title?: string;
      priority?: string;
      completed?: boolean;
      dependencies?: string[];
    },
  ) => Promise<void>;
  removeTask: (id: number) => Promise<void>;
  fetchTasks: (params: {
    query?: string;
    completed?: boolean;
    priority?: string;
    page?: number;
    limit?: number;
  }) => Promise<void>;
  refreshTasks: (page?: number) => Promise<void>;
}

// Create store for tasks
const createTaskStore = () =>
  create<TaskStore>((set, get) => ({
    tasks: [],
    loading: false,
    error: null,
    searchQuery: undefined,
    filterCompleted: undefined,
    filterPriority: undefined,
    currentPage: 1,
    itemsPerPage: 10,
    total: 0,
    totalPages: 0,

    refreshTasks: async (page) => {
      const {
        currentPage,
        itemsPerPage,
        searchQuery,
        filterCompleted,
        filterPriority,
        fetchTasks,
      } = get();
      await fetchTasks({
        query: searchQuery,
        priority: filterPriority,
        completed: filterCompleted,
        page: page || currentPage,
        limit: itemsPerPage,
      });
    },
    // Add a new task
    addTask: async (newTask) => {
      set({ loading: true, error: null });
      try {
        await axios.post<Task>(TASK_ROUTE_URL, newTask);
        await get().refreshTasks();
      } catch (error) {
        set({ error: 'Failed to add task', loading: false });
      }
    },

    // Update a task
    updateTask: async (id, changes) => {
      set({ loading: true, error: null });
      try {
        await axios.put<Task>(`${TASK_ROUTE_URL}/${id}`, changes);
        await get().refreshTasks();
      } catch (error) {
        set({ error: 'Failed to update task', loading: false });
      }
    },

    // Remove a task
    removeTask: async (id) => {
      set({ loading: true, error: null });
      try {
        await axios.delete(`${TASK_ROUTE_URL}/${id}`);
        set((state) => {
          const fnFilter = (task: Task) => task._id !== id;
          return {
            tasks: state.tasks.filter(fnFilter),
            tasksForSelection: [],
            loading: false,
          };
        });
      } catch (error) {
        set({ error: 'Failed to remove task', loading: false });
      }
    },

    // Search tasks with filtering and pagination
    fetchTasks: async ({
      query,
      completed,
      priority,
      page = 1,
      limit = 10,
    }) => {
      set({ loading: true, error: null });
      try {
        const queryParams: any = { page, limit };
        if (query) {
          queryParams.query = query;
        }
        if (completed !== undefined) {
          queryParams.completed = String(completed);
        }
        if (priority) {
          queryParams.priority = priority;
        }
        const response = await axios.get<{
          tasks: Task[];
          total: number;
          totalPages: number;
        }>(`${TASK_ROUTE_URL}?${new URLSearchParams(queryParams).toString()}`);
        const { tasks, total, totalPages } = response.data;
        set({
          tasks,
          searchQuery: query,
          filterCompleted: completed,
          filterPriority: priority,
          currentPage: page,
          itemsPerPage: limit,
          total,
          totalPages,
          loading: false,
        });
      } catch (error) {
        set({ error: 'Failed to fetch tasks', loading: false });
      }
    },
  }));

export const usePrimaryTaskStore = createTaskStore();
export const useSelectionTaskStore = createTaskStore();
