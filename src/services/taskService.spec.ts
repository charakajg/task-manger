import { getTasks, getTaskById, createTask, updateTask, deleteTask } from './taskService';
import Task from '../models/Task';
import RecurringSchedule from '../models/RecurringSchedule';
import { mapFrequency } from '../utils';

jest.mock('../models/Task');
jest.mock('../models/RecurringSchedule');
jest.mock("moment", () => {
    const mockMoment = jest.fn();
  
    mockMoment.mockReturnValue({
      add: jest.fn().mockImplementationOnce((amount, unit) => {
        const date = new Date('2022-01-01T00:00:00Z'); // Fixed date
        if (unit === 'days') {
          date.setDate(date.getDate() + amount); // Add days
        }
        return {
          toDate: jest.fn(() => date), // Return the updated date
        };
      }),
    });
  
    return mockMoment;
});
jest.mock('../utils', () => ({
  mapFrequency: jest.fn(),
}));

describe('taskService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getTasks', () => {
    it('should return tasks based on query params', async () => {
      const queryParams = { query: 'test', priority: 'high', completed: true };
      const mockTasks = [{ title: 'Task 1' }, { title: 'Task 2' }];
      (Task.find as jest.Mock).mockResolvedValue(mockTasks);

      const tasks = await getTasks(queryParams);
      expect(Task.find).toHaveBeenCalledWith({
        title: { $regex: 'test', $options: 'i' },
        priority: 'high',
        completed: true,
      });
      expect(tasks).toEqual(mockTasks);
    });
  });

  describe('getTaskById', () => {
    it('should return a task by id', async () => {
      const taskId = '123a9b4bff8f9b87e4f3b7c9';
      const mockTask = { title: 'Test Task' };
      (Task.findById as jest.Mock).mockResolvedValue(mockTask);

      const task = await getTaskById(taskId);
      expect(Task.findById).toHaveBeenCalledWith(taskId);
      expect(task).toEqual(mockTask);
    });

    it('should return null if task not found', async () => {
      const taskId = '123a9b4bff8f9b87e4f3b7c9';
      (Task.findById as jest.Mock).mockResolvedValue(null);

      const task = await getTaskById(taskId);
      expect(task).toBeNull();
    });
  });

  describe('createTask', () => {
    it('should create a recurring task and a recurring schedule', async () => {
      const taskData = {
        title: 'Recurring Task',
        priority: 'high',
        dependencies: ['123a9b4bff8f9b87e4f3b7c9'],
        recurring: true,
        recurringFrequency: 'daily' as const,
      };
      const mockTask = { _id: '123a9b4bff8f9b87e4f3b7c9', title: 'Recurring Task' };
      const mockRecurringSchedule = { _id: '456a9b4bff8f9b87e4f3b7c9', titlePrefix: 'Recurring Task' };

      (Task.prototype.save as jest.Mock).mockResolvedValue(mockTask);
      (RecurringSchedule.prototype.save as jest.Mock).mockResolvedValue(mockRecurringSchedule);
      (mapFrequency as jest.Mock).mockReturnValue('1 day');

      const task = await createTask(taskData);
      expect(Task.prototype.save).toHaveBeenCalled();
      expect(RecurringSchedule.prototype.save).toHaveBeenCalled();
      expect(task).toEqual(mockTask);
    });

    it('should create a non-recurring task', async () => {
      const taskData = {
        title: 'Simple Task',
        priority: 'low',
        dependencies: [],
        recurring: false,
      };
      const mockTask = { _id: '640a9b4bff8f9b87e4f3b7c9', title: 'Simple Task' };

      (Task.prototype.save as jest.Mock).mockResolvedValue(mockTask);

      const task = await createTask(taskData);
      expect(Task.prototype.save).toHaveBeenCalled();
      expect(task).toEqual(mockTask);
    });
  });

  describe('updateTask', () => {
    it('should update a task successfully', async () => {
      const taskId = '123a9b4bff8f9b87e4f3b7c9';
      const taskData = { title: 'Updated Task' };
      const mockTask = { _id: '123a9b4bff8f9b87e4f3b7c9', title: 'Updated Task' };

      (Task.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockTask);

      const updatedTask = await updateTask(taskId, taskData);
      expect(Task.findByIdAndUpdate).toHaveBeenCalledWith(taskId, taskData, { new: true });
      expect(updatedTask).toEqual(mockTask);
    });

    it('should throw error if trying to complete a task with incomplete dependencies', async () => {
      const taskId = '123a9b4bff8f9b87e4f3b7c9';
      const taskData = { completed: true };
      const mockTask = { _id: '123a9b4bff8f9b87e4f3b7c9', dependencies: ['456'] };
      const allTasks = [{ _id: '456a9b4bff8f9b87e4f3b7c9', completed: false }];
      
      (Task.findById as jest.Mock).mockResolvedValue(mockTask);
      (Task.find as jest.Mock).mockResolvedValue(allTasks);

      await expect(updateTask(taskId, taskData)).rejects.toThrow(
        'Not allowed to mark the task as complete, before its dependencies'
      );
    });
  });

  describe('deleteTask', () => {
    it('should delete a task and remove it from recurring schedules and other tasks dependencies', async () => {
      const taskId = '123a9b4bff8f9b87e4f3b7c9';
      const mockTask = { _id: taskId, title: 'Task to delete' };

      (Task.findByIdAndDelete as jest.Mock).mockResolvedValue(mockTask);
      (RecurringSchedule.updateMany as jest.Mock).mockResolvedValue({});
      (Task.updateMany as jest.Mock).mockResolvedValue({});

      const deletedTask = await deleteTask(taskId);

      expect(Task.findByIdAndDelete).toHaveBeenCalledWith(taskId);
      expect(RecurringSchedule.updateMany).toHaveBeenCalled();
      expect(Task.updateMany).toHaveBeenCalled();
      expect(deletedTask).toEqual(mockTask);
    });
  });
});
