import { create } from 'zustand';
import axios from 'axios';
import { API_PATH, Frequency } from '../constants';
const TASK_ROUTE_URL = `${API_PATH}/tasks`;

export interface Task {
    _id: number;
    title: string;
    priority: string;
    completed: boolean;
    dependencies: string[];
}

interface TaskStore {
    tasks: Task[];
    filteredTasks: Task[];
    loading: boolean;
    error: string | null;
    searchQuery?: string;
    filterCompleted?: boolean;
    filterPriority?: string;

    fetchTasks: () => Promise<void>;
    addTask: (newTodo: { title: string, priority: string, dependencies: string[], recurring: boolean, recurringFrequency?: Frequency }) => Promise<void>;
    updateTask: (id: number, changes: { title?: string, priority?: string, completed?: boolean }) => Promise<void>;
    removeTask: (id: number) => Promise<void>;
    searchTasks: (params: { query: string, completed?: boolean, priority?: string}) => Promise<void>;
}

// Create store for tasks
const taskStore = create<TaskStore>((set) => ({
  tasks: [],
  filteredTasks: [],
  loading: false,
  error: null,
  searchQuery: undefined,
  filterCompleted: undefined,
  filterPriority: undefined,
  fetchTasks: async() => {
    set({loading: true, error: null});
    try {
        const response = await axios.get<Task[]>(TASK_ROUTE_URL);
        const tasks = response.data;
        set({ tasks: tasks, filteredTasks: tasks, searchQuery: undefined, filterCompleted: undefined, filterPriority: undefined, loading: false });
    } catch (error) {
        set({ error: 'Failed to fetch tasks', loading: false});
    }
  },
  addTask: async(newTask) => {
    set({loading: true, error: null});
    try {
        const response = await axios.post<Task>(TASK_ROUTE_URL, newTask);
        const newEntry = response.data;
        set((state) => {
            const tasks = [...state.tasks, newEntry];
            return { tasks: tasks, filteredTasks: tasks, searchQuery: undefined, filterCompleted: undefined, filterPriority: undefined, loading: false };
        });
    } catch (error) {
        set({ error: 'Failed to fetch tasks', loading: false});
    }
  },
  updateTask: async(id, changes) => {
    set({loading: true, error: null});
    try {
        const response = await axios.put<Task>(`${TASK_ROUTE_URL}/${id}`, changes);
        const updatedTask = response.data;
        set((state) => {
            //Note that the task is removed from the local store, in order to prevent additional http calls
            const fnMap = (task: Task) => task._id === id ? updatedTask : task;
            return { tasks: state.tasks.map(fnMap), filteredTasks: state.filteredTasks.map(fnMap), loading: false};
        });
    } catch (error) {
        set({ error: 'Failed to fetch tasks', loading: false});
    }
  },
  removeTask: async(id) => {
    set({loading: true, error: null});
    try {
        await axios.delete(`${TASK_ROUTE_URL}/${id}`);
        set((state) => {
            //Note that the task is updated in the local store, in order to prevent additional http calls
            const fnFilter = (task: Task) => task._id !== id;
            return { tasks: state.tasks.filter(fnFilter), filteredTasks: state.filteredTasks.filter(fnFilter), loading: false};
        });
    } catch (error) {
        set({ error: 'Failed to fetch tasks', loading: false});
    }
  },
  searchTasks: async({ query, completed, priority }) => {
    set({loading: true, error: null});
    try {
        const queryParams: any = {};
        if (query) {
            queryParams.query = query;
        }
        if (completed !== undefined) {
            queryParams.completed = String(completed);
        }
        if (priority) {
            queryParams.priority = priority;
        }
        const response = await axios.get<Task[]>(`${TASK_ROUTE_URL}?${new URLSearchParams(queryParams).toString()}`);
        const tasks = response.data;
        set({ filteredTasks: tasks, searchQuery: query, filterCompleted: completed, filterPriority: priority, loading: false});
    } catch (error) {
        set({ error: 'Failed to fetch tasks', loading: false});
    }
  }
}));

export default taskStore;
