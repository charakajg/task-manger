import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} from './taskService';
import Task from '../models/Task';
import RecurringSchedule from '../models/RecurringSchedule';
import { mapFrequency } from '../utils';
import { Types } from 'mongoose';

jest.mock('../models/Task');
jest.mock('../models/RecurringSchedule');
jest.mock('moment', () => {
  return jest.fn(() => ({
    add: jest.fn().mockImplementation(() => ({
      toDate: jest.fn(() => new Date('2022-01-02T00:00:00Z')),
    })),
  }));
});
jest.mock('../utils', () => ({
  mapFrequency: jest.fn(),
}));

describe('taskService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getTasks', () => {
    it('should return paginated tasks', async () => {
      const queryParams = {
        query: 'test',
        priority: 'high',
        completed: true,
        page: 1,
        limit: 10,
      };
      const mockTasks = [
        {
          _id: new Types.ObjectId('60b8d295f6a4f4d8f8f1a9c1'),
          title: 'Task 1',
        },
        {
          _id: new Types.ObjectId('60b8d295f6a4f4d8f8f1a9c2'),
          title: 'Task 2',
        },
      ];

      // Mocking Task.find to return a chainable object with skip, limit, and populate methods
      const findMock = {
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        populate: jest.fn().mockResolvedValue(mockTasks), // Here populate resolves to mockTasks
      };

      (Task.find as jest.Mock).mockReturnValue(findMock); // Make Task.find return this mocked chainable object
      (Task.countDocuments as jest.Mock).mockResolvedValue(20);

      const result = await getTasks(queryParams);
      expect(result).toEqual({
        tasks: mockTasks,
        total: 20,
        limit: 10,
        page: 1,
        totalPages: 2,
      });
      expect(Task.find).toHaveBeenCalledWith({
        title: { $regex: 'test', $options: 'i' },
        priority: 'high',
        completed: true,
      });
    });
  });

  describe('getTaskById', () => {
    it('should return a task by ID', async () => {
      const taskId = new Types.ObjectId('60b8d295f6a4f4d8f8f1a9c1');
      const mockTask = { _id: taskId, title: 'Test Task' };
      (Task.findById as jest.Mock).mockResolvedValue(mockTask);

      const task = await getTaskById(taskId.toString());
      expect(task).toEqual(mockTask);
    });
  });

  describe('createTask', () => {
    it('should create a recurring task', async () => {
      const taskData = {
        title: 'Recurring Task',
        priority: 'high',
        dependencies: [
          new Types.ObjectId('60b8d295f6a4f4d8f8f1a9c1').toString(),
        ],
        recurring: true,
        recurringFrequency: 'daily' as const, // Correctly typed as 'daily'
      };
      const mockTask = {
        _id: new Types.ObjectId('60b8d295f6a4f4d8f8f1a9c2'),
        title: 'Recurring Task - 1',
      };
      (Task.prototype.save as jest.Mock).mockResolvedValue(mockTask);
      (RecurringSchedule.prototype.save as jest.Mock).mockResolvedValue({});
      (mapFrequency as jest.Mock).mockReturnValue('days');

      const task = await createTask(taskData);
      expect(task).toEqual(mockTask);
    });
  });

  describe('updateTask', () => {
    it('should not allow marking a task complete if dependencies are incomplete', async () => {
      // Define mock task and dependencies
      const taskId = new Types.ObjectId('60b8d295f6a4f4d8f8f1a9c1');
      const taskData = { completed: true };

      const mockTask = {
        _id: taskId,
        dependencies: [new Types.ObjectId('60b8d295f6a4f4d8f8f1a9c2')],
      };

      const allTasks = [
        {
          _id: new Types.ObjectId('60b8d295f6a4f4d8f8f1a9c2'),
          completed: false,
        },
      ];

      // Mock Task.findById to return the mock task
      (Task.findById as jest.Mock).mockResolvedValue(mockTask);
      // Mock Task.find to return all tasks (dependencies)
      (Task.find as jest.Mock).mockResolvedValue(allTasks);

      // Attempt to update the task
      try {
        await updateTask(taskId.toString(), taskData);
      } catch (error) {
        // Check if the error was correctly thrown
        expect((error as Error).message).toBe(
          'Not allowed to mark the task as complete, before its dependencies',
        );
      }

      // Check if the functions are being called properly
      expect(Task.findById).toHaveBeenCalledWith(taskId.toString());
      expect(Task.find).toHaveBeenCalled();
    });
  });

  it('should not allow updating dependencies of an already completed task', async () => {
    // Define mock task and dependencies
    const taskId = new Types.ObjectId('60b8d295f6a4f4d8f8f1a9c1');
    const taskData = { dependencies: ['60b8d295f6a4f4d8f8f1a9c3'] };

    const mockTask = {
      _id: taskId,
      completed: true, // Task is already marked as completed
      dependencies: [new Types.ObjectId('60b8d295f6a4f4d8f8f1a9c2')], // Current dependencies
    };

    // Mock Task.findById to return the mock task
    (Task.findById as jest.Mock).mockResolvedValue(mockTask);

    // Attempt to update the task (which should throw an error because it's completed)
    try {
      await updateTask(taskId.toString(), taskData);
    } catch (error) {
      // Check if the error was correctly thrown
      expect((error as Error).message).toBe(
        'Not allowed to update dependencies of an already completed task',
      );
    }

    // Check if the functions are being called properly
    expect(Task.findById).toHaveBeenCalledWith(taskId.toString());
  });

  describe('deleteTask', () => {
    it('should delete a task and remove it from dependencies', async () => {
      const taskId = new Types.ObjectId('60b8d295f6a4f4d8f8f1a9c1');
      const mockTask = { _id: taskId, title: 'Task to delete' };

      (Task.findByIdAndDelete as jest.Mock).mockResolvedValue(mockTask);
      (RecurringSchedule.updateMany as jest.Mock).mockResolvedValue({});
      (Task.updateMany as jest.Mock).mockResolvedValue({});

      const deletedTask = await deleteTask(taskId.toString());
      expect(deletedTask).toEqual(mockTask);
    });
  });
});
