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
var node_cron_1 = __importDefault(require("node-cron"));
var RecurringSchedule_1 = __importDefault(require("./models/RecurringSchedule"));
var Task_1 = __importDefault(require("./models/Task"));
var moment_1 = __importDefault(require("moment"));
var utils_1 = require("./utils");
// Note: This runs every hour, however
// Since our tasks runs only on daily/weekly/monthly basis, we could run it only once or twice a day
node_cron_1.default.schedule("0 * * * *", function () { return __awaiter(void 0, void 0, void 0, function () {
    var now, schedules, _i, schedules_1, schedule, newTask, newNextRunningDate, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("Running scheduled task check...");
                _a.label = 1;
            case 1:
                _a.trys.push([1, 8, , 9]);
                now = new Date();
                return [4 /*yield*/, RecurringSchedule_1.default.find({ nextRunningDate: { $lte: now } })];
            case 2:
                schedules = _a.sent();
                if (schedules.length === 0) {
                    console.log("No scheduled tasks to create.");
                    return [2 /*return*/];
                }
                _i = 0, schedules_1 = schedules;
                _a.label = 3;
            case 3:
                if (!(_i < schedules_1.length)) return [3 /*break*/, 7];
                schedule = schedules_1[_i];
                console.log("Processing schedule: ".concat(schedule.titlePrefix));
                return [4 /*yield*/, Task_1.default.create({
                        title: "".concat(schedule.titlePrefix, " - ").concat(schedule.nextSuffixNumber),
                        priority: schedule.priority,
                        completed: false,
                        dependencies: schedule.dependencies,
                    })];
            case 4:
                newTask = _a.sent();
                console.log("Created new task: ".concat(newTask.title));
                newNextRunningDate = (0, moment_1.default)(schedule.nextRunningDate).add(1, (0, utils_1.mapFrequency)(schedule.frequency)).toDate();
                // Update schedule with new values
                return [4 /*yield*/, RecurringSchedule_1.default.findByIdAndUpdate(schedule._id, {
                        nextRunningDate: newNextRunningDate,
                        nextSuffixNumber: schedule.nextSuffixNumber + 1,
                        $push: { createdTasks: newTask._id },
                    })];
            case 5:
                // Update schedule with new values
                _a.sent();
                console.log("Updated schedule: ".concat(schedule.titlePrefix));
                _a.label = 6;
            case 6:
                _i++;
                return [3 /*break*/, 3];
            case 7:
                console.log("All due tasks processed successfully.");
                return [3 /*break*/, 9];
            case 8:
                error_1 = _a.sent();
                console.error("Error running scheduled task:", error_1);
                return [3 /*break*/, 9];
            case 9: return [2 /*return*/];
        }
    });
}); });
