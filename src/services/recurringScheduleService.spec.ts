import { getRecurringSchedules, getRecurringScheduleById, updateRecurringSchedule, deleteRecurringSchedule } from "./recurringScheduleService";
import RecurringSchedule from "../models/RecurringSchedule";

jest.mock("../models/RecurringSchedule");

describe("Recurring Schedule Logic Tests", () => {
  
  afterEach(() => {
    jest.clearAllMocks(); // Clear mock data after each test
  });

  test("getRecurringSchedules should return filtered schedules", async () => {
    const mockData = [{ _id: "1", titlePrefix: "Test", priority: "high" }];
    
    // Mock the RecurringSchedule.find method
    (RecurringSchedule.find as jest.Mock).mockResolvedValue(mockData);

    // Call the function with test parameters
    const result = await getRecurringSchedules("Test", "high");
    
    // Check if the result is as expected and the find method was called with the correct filter
    expect(result).toEqual(mockData);
    expect(RecurringSchedule.find).toHaveBeenCalledWith({
      titlePrefix: { $regex: "Test", $options: "i" },
      priority: "high",
    });
  });

  test("getRecurringScheduleById should return a schedule by ID", async () => {
    const mockData = { _id: "1", titlePrefix: "Test", priority: "high" };
    
    // Mock the RecurringSchedule.findById method
    (RecurringSchedule.findById as jest.Mock).mockResolvedValue(mockData);

    // Call the function with test ID
    const result = await getRecurringScheduleById("1");
    
    // Check if the result is as expected and the findById method was called with the correct ID
    expect(result).toEqual(mockData);
    expect(RecurringSchedule.findById).toHaveBeenCalledWith("1");
  });

  test("updateRecurringSchedule should return an updated schedule", async () => {
    const mockData = { _id: "1", titlePrefix: "Updated", priority: "low" };
    
    // Mock the RecurringSchedule.findByIdAndUpdate method
    (RecurringSchedule.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockData);

    // Call the function with test data
    const result = await updateRecurringSchedule("1", { titlePrefix: "Updated", priority: "low" });
    
    // Check if the result is as expected and the findByIdAndUpdate method was called with correct parameters
    expect(result).toEqual(mockData);
    expect(RecurringSchedule.findByIdAndUpdate).toHaveBeenCalledWith("1", { titlePrefix: "Updated", priority: "low" }, { new: true });
  });

  test("deleteRecurringSchedule should return the deleted schedule", async () => {
    const mockData = { _id: "1" };
    
    // Mock the RecurringSchedule.findByIdAndDelete method
    (RecurringSchedule.findByIdAndDelete as jest.Mock).mockResolvedValue(mockData);

    // Call the function with test ID
    const result = await deleteRecurringSchedule("1");
    
    // Check if the result is as expected and the findByIdAndDelete method was called with the correct ID
    expect(result).toEqual(mockData);
    expect(RecurringSchedule.findByIdAndDelete).toHaveBeenCalledWith("1");
  });

});
