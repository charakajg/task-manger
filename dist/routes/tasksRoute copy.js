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
var express_1 = __importDefault(require("express"));
var Task_1 = __importDefault(require("../models/Task"));
var mongoose_1 = require("mongoose");
var RecurringSchedule_1 = __importDefault(require("../models/RecurringSchedule"));
var moment_1 = __importDefault(require("moment"));
var utils_1 = require("../utils");
var router = express_1.default.Router();
router.get("/", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, query, priority, completed, filter, tasks, error_1, errorMessage;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.query, query = _a.query, priority = _a.priority, completed = _a.completed;
                filter = {};
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                if (query) {
                    filter.title = { $regex: query, $options: "i" };
                }
                if (priority) {
                    filter.priority = priority;
                }
                if (completed) {
                    filter.completed = completed;
                }
                return [4 /*yield*/, Task_1.default.find(filter)];
            case 2:
                tasks = _b.sent();
                res.json(tasks);
                return [3 /*break*/, 4];
            case 3:
                error_1 = _b.sent();
                errorMessage = error_1 instanceof Error ? error_1.message : JSON.stringify(error_1);
                res.status(400).json({ error: errorMessage });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.get("/:id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var task;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, Task_1.default.findById(req.params.id)];
            case 1:
                task = _a.sent();
                task ? res.json(task) : res.status(404).json({ message: "Task not found" });
                return [2 /*return*/];
        }
    });
}); });
router.post("/", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, title, priority, dependencies, recurring, recurringFrequency, initialSuffixNumber, taskDependencies, task, nextRunningDate, recurringSchedule, task, error_2, errorMessage;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, title = _a.title, priority = _a.priority, dependencies = _a.dependencies, recurring = _a.recurring, recurringFrequency = _a.recurringFrequency;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 7, , 8]);
                if (!recurring) return [3 /*break*/, 4];
                initialSuffixNumber = 1;
                taskDependencies = dependencies.map(function (id) { return new mongoose_1.Types.ObjectId(id); });
                task = new Task_1.default({ title: "".concat(title, " - ").concat(initialSuffixNumber), priority: priority, dependencies: taskDependencies });
                return [4 /*yield*/, task.save()];
            case 2:
                _b.sent();
                nextRunningDate = (0, moment_1.default)().add(1, (0, utils_1.mapFrequency)(recurringFrequency)).toDate();
                recurringSchedule = new RecurringSchedule_1.default({ titlePrefix: title, priority: priority, frequency: recurringFrequency, createdTasks: [task._id], dependencies: taskDependencies, nextSuffixNumber: initialSuffixNumber + 1, nextRunningDate: nextRunningDate });
                return [4 /*yield*/, recurringSchedule.save()];
            case 3:
                _b.sent();
                res.status(201).json(task);
                return [3 /*break*/, 6];
            case 4:
                task = new Task_1.default({ title: title, priority: priority, completed: false, dependencies: dependencies.map(function (id) { return new mongoose_1.Types.ObjectId(id); }) });
                return [4 /*yield*/, task.save()];
            case 5:
                _b.sent();
                res.status(201).json(task);
                _b.label = 6;
            case 6: return [3 /*break*/, 8];
            case 7:
                error_2 = _b.sent();
                errorMessage = error_2 instanceof Error ? error_2.message : JSON.stringify(error_2);
                res.status(400).json({ error: errorMessage });
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); });
router.put("/:id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, completed, dependencies, origTask, allTasks_1, incompleteDependantTask, task;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, completed = _a.completed, dependencies = _a.dependencies;
                if (!(completed || dependencies)) return [3 /*break*/, 4];
                return [4 /*yield*/, Task_1.default.findById(req.params.id)];
            case 1:
                origTask = _b.sent();
                if (!(completed && (origTask === null || origTask === void 0 ? void 0 : origTask.dependencies))) return [3 /*break*/, 3];
                return [4 /*yield*/, Task_1.default.find({})];
            case 2:
                allTasks_1 = _b.sent();
                incompleteDependantTask = origTask.dependencies.find(function (depId) { var _a; return !((_a = allTasks_1.find(function (t) { return t._id == depId; })) === null || _a === void 0 ? void 0 : _a.completed); });
                if (incompleteDependantTask) {
                    res.status(500).json({ error: "Not allowed to mark the task as complete, before its dependencies" });
                    return [2 /*return*/];
                }
                _b.label = 3;
            case 3:
                if (dependencies && (origTask === null || origTask === void 0 ? void 0 : origTask.completed)) {
                    res.status(500).json({ error: "Not allowed to update dependencies of an already completed task" });
                    return [2 /*return*/];
                }
                _b.label = 4;
            case 4: return [4 /*yield*/, Task_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true })];
            case 5:
                task = _b.sent();
                task ? res.json(task) : res.status(404).json({ message: "Task not found" });
                return [2 /*return*/];
        }
    });
}); });
router.delete("/:id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var taskId, task, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                taskId = req.params.id;
                // Remove the task from all RecurringSchedules
                return [4 /*yield*/, RecurringSchedule_1.default.updateMany({
                        $or: [
                            { createdTasks: taskId },
                            { dependencies: taskId }
                        ]
                    }, {
                        $pull: {
                            createdTasks: taskId,
                            dependencies: taskId
                        }
                    })];
            case 1:
                // Remove the task from all RecurringSchedules
                _a.sent();
                // Remove the task from dependencies in all other tasks
                return [4 /*yield*/, Task_1.default.updateMany({ dependencies: taskId }, { $pull: { dependencies: taskId } })];
            case 2:
                // Remove the task from dependencies in all other tasks
                _a.sent();
                return [4 /*yield*/, Task_1.default.findByIdAndDelete(taskId)];
            case 3:
                task = _a.sent();
                task
                    ? res.json({ message: "Task deleted successfully" })
                    : res.status(404).json({ message: "Task not found" });
                return [3 /*break*/, 5];
            case 4:
                error_3 = _a.sent();
                console.error(error_3);
                res.status(500).json({ message: "An error occurred while deleting the task" });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
