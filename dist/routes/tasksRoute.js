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
var taskService_1 = require("../services/taskService");
var router = express_1.default.Router();
router.get("/", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var tasks, error_1, errorMessage;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, taskService_1.getTasks)(req.query)];
            case 1:
                tasks = _a.sent();
                res.json(tasks);
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                errorMessage = error_1 instanceof Error ? error_1.message : JSON.stringify(error_1);
                res.status(400).json({ error: errorMessage });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.get("/:id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var task, error_2, errorMessage;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, taskService_1.getTaskById)(req.params.id)];
            case 1:
                task = _a.sent();
                task ? res.json(task) : res.status(404).json({ message: "Task not found" });
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                errorMessage = error_2 instanceof Error ? error_2.message : JSON.stringify(error_2);
                res.status(400).json({ error: errorMessage });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post("/", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var task, error_3, errorMessage;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, taskService_1.createTask)(req.body)];
            case 1:
                task = _a.sent();
                res.status(201).json(task);
                return [3 /*break*/, 3];
            case 2:
                error_3 = _a.sent();
                errorMessage = error_3 instanceof Error ? error_3.message : JSON.stringify(error_3);
                res.status(400).json({ error: errorMessage });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.put("/:id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var task, error_4, errorMessage;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, taskService_1.updateTask)(req.params.id, req.body)];
            case 1:
                task = _a.sent();
                res.json(task);
                return [3 /*break*/, 3];
            case 2:
                error_4 = _a.sent();
                errorMessage = error_4 instanceof Error ? error_4.message : JSON.stringify(error_4);
                res.status(400).json({ error: errorMessage });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.delete("/:id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var error_5, errorMessage;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, taskService_1.deleteTask)(req.params.id)];
            case 1:
                _a.sent();
                res.json({ message: "Task deleted successfully" });
                return [3 /*break*/, 3];
            case 2:
                error_5 = _a.sent();
                errorMessage = error_5 instanceof Error ? error_5.message : JSON.stringify(error_5);
                res.status(400).json({ error: errorMessage });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
