import {
  getRecurringSchedules,
  getRecurringScheduleById,
  updateRecurringSchedule,
  deleteRecurringSchedule,
} from './recurringScheduleService';
import RecurringSchedule from '../models/RecurringSchedule';
import { Types } from 'mongoose'; // Import Types from mongoose to generate valid ObjectIds

jest.mock('../models/RecurringSchedule');

describe('Recurring Schedule Logic Tests', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mock data after each test
  });

  test('getRecurringSchedules should return filtered schedules with pagination', async () => {
    const mockSchedules = [
      {
        _id: new Types.ObjectId('67e925469156a41f9f39c402'),
        titlePrefix: 'Test',
        priority: 'high',
      },
    ];
    
    const mockPaginatedResult = {
      schedules: mockSchedules,
      total: 1,
      totalPages: 1
    };

    // Create a mock query chain
    const mockQuery = {
      populate: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      sort: jest.fn().mockResolvedValue(mockSchedules),
    };

    // Mock the find method to return our mock query
    (RecurringSchedule.find as jest.Mock).mockReturnValue(mockQuery);
    
    // Mock countDocuments for pagination total
    (RecurringSchedule.countDocuments as jest.Mock).mockResolvedValue(1);

    // Call the function with test parameters (including pagination)
    const result = await getRecurringSchedules('Test', 'high', 1, 10);

    // Check if the methods were called with correct parameters
    expect(RecurringSchedule.find).toHaveBeenCalledWith({
      titlePrefix: { $regex: 'Test', $options: 'i' },
      priority: 'high',
    });
    expect(mockQuery.skip).toHaveBeenCalledWith(0); // (page-1)*limit = 0
    expect(mockQuery.limit).toHaveBeenCalledWith(10);
    expect(mockQuery.sort).toHaveBeenCalledWith({ createdAt: -1 });
    
    // The structure should match our expected pagination result
    expect(result).toEqual({
      schedules: mockSchedules,
      total: 1,
      totalPages: 1
    });
  });
  
  test('getRecurringSchedules should work with default pagination parameters', async () => {
    const mockSchedules = [
      {
        _id: new Types.ObjectId(),
        titlePrefix: 'Default',
        priority: 'medium',
      },
    ];

    // Create a mock query chain
    const mockQuery = {
      populate: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      sort: jest.fn().mockResolvedValue(mockSchedules),
    };

    // Mock the find method to return our mock query
    (RecurringSchedule.find as jest.Mock).mockReturnValue(mockQuery);
    
    // Mock countDocuments for pagination total
    (RecurringSchedule.countDocuments as jest.Mock).mockResolvedValue(1);

    // Call the function without explicit pagination parameters
    const result = await getRecurringSchedules('', '');

    // Verify default pagination values were used
    expect(mockQuery.skip).toHaveBeenCalledWith(0); // Default page 1 => (1-1)*10 = 0
    expect(mockQuery.limit).toHaveBeenCalledWith(10); // Default limit is 10
    
    // Verify the result structure
    expect(result).toEqual({
      schedules: mockSchedules,
      total: 1,
      totalPages: 1
    });
  });

  test('getRecurringScheduleById should return a schedule by ID', async () => {
    const mockData = {
      _id: new Types.ObjectId(),
      titlePrefix: 'Test',
      priority: 'high',
    };

    // Mock the RecurringSchedule.findById method to return the mock data
    (RecurringSchedule.findById as jest.Mock).mockResolvedValue(mockData);

    // Call the function with test ID
    const result = await getRecurringScheduleById(mockData._id.toString());

    // Check if the result is as expected and the findById method was called with the correct ID
    expect(result).toEqual(mockData);
    expect(RecurringSchedule.findById).toHaveBeenCalledWith(
      mockData._id.toString(),
    );
  });

  test('updateRecurringSchedule should return an updated schedule', async () => {
    const mockData = {
      _id: new Types.ObjectId(),
      titlePrefix: 'Updated',
      priority: 'low',
    };

    // Mock the RecurringSchedule.findByIdAndUpdate method
    (RecurringSchedule.findByIdAndUpdate as jest.Mock).mockResolvedValue(
      mockData,
    );

    // Call the function with test data
    const result = await updateRecurringSchedule(mockData._id.toString(), {
      titlePrefix: 'Updated',
      priority: 'low',
    });

    // Check if the result is as expected and the findByIdAndUpdate method was called with correct parameters
    expect(result).toEqual(mockData);
    expect(RecurringSchedule.findByIdAndUpdate).toHaveBeenCalledWith(
      mockData._id.toString(),
      { titlePrefix: 'Updated', priority: 'low' },
      { new: true },
    );
  });

  test('deleteRecurringSchedule should return the deleted schedule', async () => {
    const mockData = { _id: new Types.ObjectId() };

    // Mock the RecurringSchedule.findByIdAndDelete method
    (RecurringSchedule.findByIdAndDelete as jest.Mock).mockResolvedValue(
      mockData,
    );

    // Call the function with test ID
    const result = await deleteRecurringSchedule(mockData._id.toString());

    // Check if the result is as expected and the findByIdAndDelete method was called with the correct ID
    expect(result).toEqual(mockData);
    expect(RecurringSchedule.findByIdAndDelete).toHaveBeenCalledWith(
      mockData._id.toString(),
    );
  });
});
