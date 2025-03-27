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
exports.deleteTask = exports.updateTask = exports.createTask = exports.getTaskById = exports.getTasks = void 0;
var Task_1 = __importDefault(require("../models/Task"));
var RecurringSchedule_1 = __importDefault(require("../models/RecurringSchedule"));
var moment_1 = __importDefault(require("moment"));
var mongoose_1 = require("mongoose");
var utils_1 = require("../utils");
var getTasks = function (queryParams) { return __awaiter(void 0, void 0, void 0, function () {
    var query, priority, completed, filter;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                query = queryParams.query, priority = queryParams.priority, completed = queryParams.completed;
                filter = {};
                if (query) {
                    filter.title = { $regex: query, $options: "i" };
                }
                if (priority) {
                    filter.priority = priority;
                }
                if (completed !== undefined) {
                    filter.completed = completed;
                }
                return [4 /*yield*/, Task_1.default.find(filter)];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.getTasks = getTasks;
var getTaskById = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, Task_1.default.findById(id)];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.getTaskById = getTaskById;
var createTask = function (taskData) { return __awaiter(void 0, void 0, void 0, function () {
    var title, priority, dependencies, recurring, recurringFrequency, initialSuffixNumber, taskDependencies, task, nextRunningDate, recurringSchedule, task;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                title = taskData.title, priority = taskData.priority, dependencies = taskData.dependencies, recurring = taskData.recurring, recurringFrequency = taskData.recurringFrequency;
                if (!recurring) return [3 /*break*/, 3];
                initialSuffixNumber = 1;
                taskDependencies = dependencies.map(function (id) { return new mongoose_1.Types.ObjectId(id); });
                task = new Task_1.default({
                    title: "".concat(title, " - ").concat(initialSuffixNumber),
                    priority: priority,
                    dependencies: taskDependencies,
                });
                return [4 /*yield*/, task.save()];
            case 1:
                task = _a.sent();
                nextRunningDate = (0, moment_1.default)().add(1, (0, utils_1.mapFrequency)(recurringFrequency)).toDate();
                recurringSchedule = new RecurringSchedule_1.default({
                    titlePrefix: title,
                    priority: priority,
                    frequency: recurringFrequency,
                    createdTasks: [task._id],
                    dependencies: taskDependencies,
                    nextSuffixNumber: initialSuffixNumber + 1,
                    nextRunningDate: nextRunningDate,
                });
                return [4 /*yield*/, recurringSchedule.save()];
            case 2:
                _a.sent();
                return [2 /*return*/, task];
            case 3:
                task = new Task_1.default({
                    title: title,
                    priority: priority,
                    completed: false,
                    dependencies: dependencies.map(function (id) { return new mongoose_1.Types.ObjectId(id); }),
                });
                return [4 /*yield*/, task.save()];
            case 4:
                task = _a.sent();
                return [2 /*return*/, task];
        }
    });
}); };
exports.createTask = createTask;
var updateTask = function (id, taskData) { return __awaiter(void 0, void 0, void 0, function () {
    var completed, dependencies, origTask, allTasks_1, incompleteDependantTask;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                completed = taskData.completed, dependencies = taskData.dependencies;
                if (!(completed || dependencies)) return [3 /*break*/, 4];
                return [4 /*yield*/, Task_1.default.findById(id)];
            case 1:
                origTask = _a.sent();
                if (!(completed && (origTask === null || origTask === void 0 ? void 0 : origTask.dependencies))) return [3 /*break*/, 3];
                return [4 /*yield*/, Task_1.default.find({})];
            case 2:
                allTasks_1 = _a.sent();
                incompleteDependantTask = origTask.dependencies.find(function (depId) {
                    var depTask = allTasks_1.find(function (t) { return t._id == depId; });
                    return depTask && !depTask.completed;
                });
                if (incompleteDependantTask) {
                    throw new Error("Not allowed to mark the task as complete, before its dependencies");
                }
                _a.label = 3;
            case 3:
                if (dependencies && (origTask === null || origTask === void 0 ? void 0 : origTask.completed)) {
                    throw new Error("Not allowed to update dependencies of an already completed task");
                }
                _a.label = 4;
            case 4: return [4 /*yield*/, Task_1.default.findByIdAndUpdate(id, taskData, { new: true })];
            case 5: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.updateTask = updateTask;
var deleteTask = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: 
            // Remove the task from all RecurringSchedules
            return [4 /*yield*/, RecurringSchedule_1.default.updateMany({
                    $or: [
                        { createdTasks: id },
                        { dependencies: id },
                    ],
                }, {
                    $pull: {
                        createdTasks: id,
                        dependencies: id,
                    },
                })];
            case 1:
                // Remove the task from all RecurringSchedules
                _a.sent();
                // Remove the task from dependencies in all other tasks
                return [4 /*yield*/, Task_1.default.updateMany({ dependencies: id }, { $pull: { dependencies: id } })];
            case 2:
                // Remove the task from dependencies in all other tasks
                _a.sent();
                return [4 /*yield*/, Task_1.default.findByIdAndDelete(id)];
            case 3: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.deleteTask = deleteTask;
