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
var mongoose_1 = require("mongoose");
jest.mock('../models/Task');
jest.mock('../models/RecurringSchedule');
jest.mock('moment', function () {
    return jest.fn(function () { return ({
        add: jest.fn().mockImplementation(function (amount, unit) { return ({
            toDate: jest.fn(function () { return new Date('2022-01-02T00:00:00Z'); }),
        }); }),
    }); });
});
jest.mock('../utils', function () { return ({
    mapFrequency: jest.fn(),
}); });
describe('taskService', function () {
    beforeEach(function () {
        jest.clearAllMocks();
    });
    describe('getTasks', function () {
        it('should return paginated tasks', function () { return __awaiter(void 0, void 0, void 0, function () {
            var queryParams, mockTasks, findMock, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        queryParams = {
                            query: 'test',
                            priority: 'high',
                            completed: true,
                            page: 1,
                            limit: 10,
                        };
                        mockTasks = [
                            {
                                _id: new mongoose_1.Types.ObjectId('60b8d295f6a4f4d8f8f1a9c1'),
                                title: 'Task 1',
                            },
                            {
                                _id: new mongoose_1.Types.ObjectId('60b8d295f6a4f4d8f8f1a9c2'),
                                title: 'Task 2',
                            },
                        ];
                        findMock = {
                            skip: jest.fn().mockReturnThis(),
                            limit: jest.fn().mockReturnThis(),
                            populate: jest.fn().mockResolvedValue(mockTasks), // Here populate resolves to mockTasks
                        };
                        Task_1.default.find.mockReturnValue(findMock); // Make Task.find return this mocked chainable object
                        Task_1.default.countDocuments.mockResolvedValue(20);
                        return [4 /*yield*/, (0, taskService_1.getTasks)(queryParams)];
                    case 1:
                        result = _a.sent();
                        expect(result).toEqual({
                            tasks: mockTasks,
                            total: 20,
                            limit: 10,
                            page: 1,
                            totalPages: 2,
                        });
                        expect(Task_1.default.find).toHaveBeenCalledWith({
                            title: { $regex: 'test', $options: 'i' },
                            priority: 'high',
                            completed: true,
                        });
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getTaskById', function () {
        it('should return a task by ID', function () { return __awaiter(void 0, void 0, void 0, function () {
            var taskId, mockTask, task;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        taskId = new mongoose_1.Types.ObjectId('60b8d295f6a4f4d8f8f1a9c1');
                        mockTask = { _id: taskId, title: 'Test Task' };
                        Task_1.default.findById.mockResolvedValue(mockTask);
                        return [4 /*yield*/, (0, taskService_1.getTaskById)(taskId.toString())];
                    case 1:
                        task = _a.sent();
                        expect(task).toEqual(mockTask);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('createTask', function () {
        it('should create a recurring task', function () { return __awaiter(void 0, void 0, void 0, function () {
            var taskData, mockTask, task;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        taskData = {
                            title: 'Recurring Task',
                            priority: 'high',
                            dependencies: [
                                new mongoose_1.Types.ObjectId('60b8d295f6a4f4d8f8f1a9c1').toString(),
                            ],
                            recurring: true,
                            recurringFrequency: 'daily', // Correctly typed as 'daily'
                        };
                        mockTask = {
                            _id: new mongoose_1.Types.ObjectId('60b8d295f6a4f4d8f8f1a9c2'),
                            title: 'Recurring Task - 1',
                        };
                        Task_1.default.prototype.save.mockResolvedValue(mockTask);
                        RecurringSchedule_1.default.prototype.save.mockResolvedValue({});
                        utils_1.mapFrequency.mockReturnValue('days');
                        return [4 /*yield*/, (0, taskService_1.createTask)(taskData)];
                    case 1:
                        task = _a.sent();
                        expect(task).toEqual(mockTask);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('updateTask', function () {
        it('should not allow marking a task complete if dependencies are incomplete', function () { return __awaiter(void 0, void 0, void 0, function () {
            var taskId, taskData, mockTask, allTasks, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        taskId = new mongoose_1.Types.ObjectId('60b8d295f6a4f4d8f8f1a9c1');
                        taskData = { completed: true };
                        mockTask = {
                            _id: taskId,
                            dependencies: [new mongoose_1.Types.ObjectId('60b8d295f6a4f4d8f8f1a9c2')],
                        };
                        allTasks = [
                            {
                                _id: new mongoose_1.Types.ObjectId('60b8d295f6a4f4d8f8f1a9c2'),
                                completed: false,
                            },
                        ];
                        // Mock Task.findById to return the mock task
                        Task_1.default.findById.mockResolvedValue(mockTask);
                        // Mock Task.find to return all tasks (dependencies)
                        Task_1.default.find.mockResolvedValue(allTasks);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, (0, taskService_1.updateTask)(taskId.toString(), taskData)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        // Check if the error was correctly thrown
                        expect(error_1.message).toBe('Not allowed to mark the task as complete, before its dependencies');
                        return [3 /*break*/, 4];
                    case 4:
                        // Check if the functions are being called properly
                        expect(Task_1.default.findById).toHaveBeenCalledWith(taskId.toString());
                        expect(Task_1.default.find).toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    it('should not allow updating dependencies of an already completed task', function () { return __awaiter(void 0, void 0, void 0, function () {
        var taskId, taskData, mockTask, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    taskId = new mongoose_1.Types.ObjectId('60b8d295f6a4f4d8f8f1a9c1');
                    taskData = { dependencies: ['60b8d295f6a4f4d8f8f1a9c3'] };
                    mockTask = {
                        _id: taskId,
                        completed: true, // Task is already marked as completed
                        dependencies: [new mongoose_1.Types.ObjectId('60b8d295f6a4f4d8f8f1a9c2')], // Current dependencies
                    };
                    // Mock Task.findById to return the mock task
                    Task_1.default.findById.mockResolvedValue(mockTask);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, (0, taskService_1.updateTask)(taskId.toString(), taskData)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    // Check if the error was correctly thrown
                    expect(error_2.message).toBe('Not allowed to update dependencies of an already completed task');
                    return [3 /*break*/, 4];
                case 4:
                    // Check if the functions are being called properly
                    expect(Task_1.default.findById).toHaveBeenCalledWith(taskId.toString());
                    return [2 /*return*/];
            }
        });
    }); });
    describe('deleteTask', function () {
        it('should delete a task and remove it from dependencies', function () { return __awaiter(void 0, void 0, void 0, function () {
            var taskId, mockTask, deletedTask;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        taskId = new mongoose_1.Types.ObjectId('60b8d295f6a4f4d8f8f1a9c1');
                        mockTask = { _id: taskId, title: 'Task to delete' };
                        Task_1.default.findByIdAndDelete.mockResolvedValue(mockTask);
                        RecurringSchedule_1.default.updateMany.mockResolvedValue({});
                        Task_1.default.updateMany.mockResolvedValue({});
                        return [4 /*yield*/, (0, taskService_1.deleteTask)(taskId.toString())];
                    case 1:
                        deletedTask = _a.sent();
                        expect(deletedTask).toEqual(mockTask);
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
