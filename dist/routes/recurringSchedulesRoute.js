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
var recurringScheduleService_1 = require("../services/recurringScheduleService");
var router = express_1.default.Router();
/**
 * @swagger
 * /api/recurring-schedules:
 *   get:
 *     summary: Get a paginated list of recurring schedules
 *     tags: [Schedules]
 *     description: Retrieves a paginated list of recurring schedules based on optional query parameters.
 *     parameters:
 *       - name: query
 *         in: query
 *         description: Search query to filter recurring schedules
 *         required: false
 *         schema:
 *           type: string
 *       - name: priority
 *         in: query
 *         description: Filter recurring schedules by priority
 *         required: false
 *         schema:
 *           type: string
 *       - name: page
 *         in: query
 *         description: Page number for pagination
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *       - name: limit
 *         in: query
 *         description: Number of items per page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       '200':
 *         description: A paginated list of recurring schedules
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 schedules:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       titlePrefix:
 *                         type: string
 *                       priority:
 *                         type: string
 *                       frequency:
 *                         type: string
 *                       nextRunningDate:
 *                         type: string
 *                         format: date-time
 *                       nextSuffixNumber:
 *                         type: integer
 *                 total:
 *                   type: integer
 *                   description: Total number of schedules matching the query
 *                 totalPages:
 *                   type: integer
 *                   description: Total number of pages available
 *       '400':
 *         description: Bad request due to invalid query or priority
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.get('/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, query, priority, page, limit, pageNum, limitNum, result, error_1, errorMessage;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.query, query = _a.query, priority = _a.priority, page = _a.page, limit = _a.limit;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                pageNum = page ? parseInt(page, 10) : 1;
                limitNum = limit ? parseInt(limit, 10) : 10;
                return [4 /*yield*/, (0, recurringScheduleService_1.getRecurringSchedules)(query, priority, pageNum, limitNum)];
            case 2:
                result = _b.sent();
                res.json(result);
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
/**
 * @swagger
 * /api/recurring-schedules/{id}:
 *   get:
 *     summary: Get a recurring schedule by ID
 *     tags: [Schedules]
 *     description: Retrieves a specific recurring schedule by its ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the recurring schedule to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: The recurring schedule
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 scheduleName:
 *                   type: string
 *                 priority:
 *                   type: string
 *                 startDate:
 *                   type: string
 *                   format: date
 *                 endDate:
 *                   type: string
 *                   format: date
 *       '404':
 *         description: Recurring schedule not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       '400':
 *         description: Bad request due to unknown error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.get('/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var recurringSchedule, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, recurringScheduleService_1.getRecurringScheduleById)(req.params.id)];
            case 1:
                recurringSchedule = _a.sent();
                recurringSchedule
                    ? res.json(recurringSchedule)
                    : res.status(404).json({ message: 'Recurring schedule not found' });
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                res.status(400).json({
                    error: error_2 instanceof Error ? error_2.message : 'Unknown error',
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/**
 * @swagger
 * /api/recurring-schedules/{id}:
 *   put:
 *     summary: Update a recurring schedule by ID
 *     tags: [Schedules]
 *     description: Updates an existing recurring schedule by its ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the recurring schedule to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               scheduleName:
 *                 type: string
 *               priority:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       '200':
 *         description: The updated recurring schedule
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 scheduleName:
 *                   type: string
 *                 priority:
 *                   type: string
 *                 startDate:
 *                   type: string
 *                   format: date
 *                 endDate:
 *                   type: string
 *                   format: date
 *       '404':
 *         description: Recurring schedule not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       '400':
 *         description: Bad request due to invalid input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.put('/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var recurringSchedule, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, recurringScheduleService_1.updateRecurringSchedule)(req.params.id, req.body)];
            case 1:
                recurringSchedule = _a.sent();
                recurringSchedule
                    ? res.json(recurringSchedule)
                    : res.status(404).json({ message: 'Recurring schedule not found' });
                return [3 /*break*/, 3];
            case 2:
                error_3 = _a.sent();
                res.status(400).json({
                    error: error_3 instanceof Error ? error_3.message : 'Unknown error',
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/**
 * @swagger
 * /api/recurring-schedules/{id}:
 *   delete:
 *     summary: Delete a recurring schedule by ID
 *     tags: [Schedules]
 *     description: Deletes a specific recurring schedule by its ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the recurring schedule to delete
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Recurring schedule deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       '404':
 *         description: Recurring schedule not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       '400':
 *         description: Bad request due to unknown error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.delete('/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var recurringSchedule, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, recurringScheduleService_1.deleteRecurringSchedule)(req.params.id)];
            case 1:
                recurringSchedule = _a.sent();
                recurringSchedule
                    ? res.json({ message: 'Recurring schedule deleted' })
                    : res.status(404).json({ message: 'Recurring schedule not found' });
                return [3 /*break*/, 3];
            case 2:
                error_4 = _a.sent();
                res.status(400).json({
                    error: error_4 instanceof Error ? error_4.message : 'Unknown error',
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
