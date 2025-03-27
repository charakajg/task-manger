"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var taskService_1 = require("./taskService");
var Task_1 = __importDefault(require("../models/Task"));
var RecurringSchedule_1 = __importDefault(require("../models/RecurringSchedule"));
var utils_1 = require("../utils");
jest.mock('../models/Task');
jest.mock('../models/RecurringSchedule');
jest.mock("moment", function () {
    var mockMoment = jest.fn();
    mockMoment.mockReturnValue({
        add: jest.fn().mockImplementationOnce(function (amount, unit) {
            var date = new Date('2022-01-01T00:00:00Z'); // Fixed date
            if (unit === 'days') {
                date.setDate(date.getDate() + amount); // Add days
            }
            return {
                toDate: jest.fn(function () { return date; }), // Return the updated date
            };
        }),
    });
    return mockMoment;
});
jest.mock('../utils', function () { return ({
    mapFrequency: jest.fn(),
}); });
describe('taskService', function () {
    beforeEach(function () {
        jest.clearAllMocks();
    });
    describe('getTasks', function () {
        it('should return tasks based on query params', function () { return __awaiter(void 0, void 0, void 0, function () {
            var queryParams, mockTasks, tasks;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        queryParams = { query: 'test', priority: 'high', completed: true };
                        mockTasks = [{ title: 'Task 1' }, { title: 'Task 2' }];
                        Task_1.default.find.mockResolvedValue(mockTasks);
                        return [4 /*yield*/, (0, taskService_1.getTasks)(queryParams)];
                    case 1:
                        tasks = _a.sent();
                        expect(Task_1.default.find).toHaveBeenCalledWith({
                            title: { $regex: 'test', $options: 'i' },
                            priority: 'high',
                            completed: true,
                        });
                        expect(tasks).toEqual(mockTasks);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getTaskById', function () {
        it('should return a task by id', function () { return __awaiter(void 0, void 0, void 0, function () {
            var taskId, mockTask, task;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        taskId = '123a9b4bff8f9b87e4f3b7c9';
                        mockTask = { title: 'Test Task' };
                        Task_1.default.findById.mockResolvedValue(mockTask);
                        return [4 /*yield*/, (0, taskService_1.getTaskById)(taskId)];
                    case 1:
                        task = _a.sent();
                        expect(Task_1.default.findById).toHaveBeenCalledWith(taskId);
                        expect(task).toEqual(mockTask);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should return null if task not found', function () { return __awaiter(void 0, void 0, void 0, function () {
            var taskId, task;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        taskId = '123a9b4bff8f9b87e4f3b7c9';
                        Task_1.default.findById.mockResolvedValue(null);
                        return [4 /*yield*/, (0, taskService_1.getTaskById)(taskId)];
                    case 1:
                        task = _a.sent();
                        expect(task).toBeNull();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('createTask', function () {
        it('should create a recurring task and a recurring schedule', function () { return __awaiter(void 0, void 0, void 0, function () {
            var taskData, mockTask, mockRecurringSchedule, task;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        taskData = {
                            title: 'Recurring Task',
                            priority: 'high',
                            dependencies: ['123a9b4bff8f9b87e4f3b7c9'],
                            recurring: true,
                            recurringFrequency: 'daily',
                        };
                        mockTask = { _id: '123a9b4bff8f9b87e4f3b7c9', title: 'Recurring Task' };
                        mockRecurringSchedule = { _id: '456a9b4bff8f9b87e4f3b7c9', titlePrefix: 'Recurring Task' };
                        Task_1.default.prototype.save.mockResolvedValue(mockTask);
                        RecurringSchedule_1.default.prototype.save.mockResolvedValue(mockRecurringSchedule);
                        utils_1.mapFrequency.mockReturnValue('1 day');
                        return [4 /*yield*/, (0, taskService_1.createTask)(taskData)];
                    case 1:
                        task = _a.sent();
                        expect(Task_1.default.prototype.save).toHaveBeenCalled();
                        expect(RecurringSchedule_1.default.prototype.save).toHaveBeenCalled();
                        expect(task).toEqual(mockTask);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should create a non-recurring task', function () { return __awaiter(void 0, void 0, void 0, function () {
            var taskData, mockTask, task;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        taskData = {
                            title: 'Simple Task',
                            priority: 'low',
                            dependencies: [],
                            recurring: false,
                        };
                        mockTask = { _id: '640a9b4bff8f9b87e4f3b7c9', title: 'Simple Task' };
                        Task_1.default.prototype.save.mockResolvedValue(mockTask);
                        return [4 /*yield*/, (0, taskService_1.createTask)(taskData)];
                    case 1:
                        task = _a.sent();
                        expect(Task_1.default.prototype.save).toHaveBeenCalled();
                        expect(task).toEqual(mockTask);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('updateTask', function () {
        it('should update a task successfully', function () { return __awaiter(void 0, void 0, void 0, function () {
            var taskId, taskData, mockTask, updatedTask;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        taskId = '123a9b4bff8f9b87e4f3b7c9';
                        taskData = { title: 'Updated Task' };
                        mockTask = { _id: '123a9b4bff8f9b87e4f3b7c9', title: 'Updated Task' };
                        Task_1.default.findByIdAndUpdate.mockResolvedValue(mockTask);
                        return [4 /*yield*/, (0, taskService_1.updateTask)(taskId, taskData)];
                    case 1:
                        updatedTask = _a.sent();
                        expect(Task_1.default.findByIdAndUpdate).toHaveBeenCalledWith(taskId, taskData, { new: true });
                        expect(updatedTask).toEqual(mockTask);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should throw error if trying to complete a task with incomplete dependencies', function () { return __awaiter(void 0, void 0, void 0, function () {
            var taskId, taskData, mockTask, allTasks;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        taskId = '123a9b4bff8f9b87e4f3b7c9';
                        taskData = { completed: true };
                        mockTask = { _id: '123a9b4bff8f9b87e4f3b7c9', dependencies: ['456'] };
                        allTasks = [{ _id: '456a9b4bff8f9b87e4f3b7c9', completed: false }];
                        Task_1.default.findById.mockResolvedValue(mockTask);
                        Task_1.default.find.mockResolvedValue(allTasks);
                        return [4 /*yield*/, expect((0, taskService_1.updateTask)(taskId, taskData)).rejects.toThrow('Not allowed to mark the task as complete, before its dependencies')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('deleteTask', function () {
        it('should delete a task and remove it from recurring schedules and other tasks dependencies', function () { return __awaiter(void 0, void 0, void 0, function () {
            var taskId, mockTask, deletedTask;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        taskId = '123a9b4bff8f9b87e4f3b7c9';
                        mockTask = { _id: taskId, title: 'Task to delete' };
                        Task_1.default.findByIdAndDelete.mockResolvedValue(mockTask);
                        RecurringSchedule_1.default.updateMany.mockResolvedValue({});
                        Task_1.default.updateMany.mockResolvedValue({});
                        return [4 /*yield*/, (0, taskService_1.deleteTask)(taskId)];
                    case 1:
                        deletedTask = _a.sent();
                        expect(Task_1.default.findByIdAndDelete).toHaveBeenCalledWith(taskId);
                        expect(RecurringSchedule_1.default.updateMany).toHaveBeenCalled();
                        expect(Task_1.default.updateMany).toHaveBeenCalled();
                        expect(deletedTask).toEqual(mockTask);
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
