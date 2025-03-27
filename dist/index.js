"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var path_1 = __importDefault(require("path"));
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
require("./cronJobs");
var tasksRoute_1 = __importDefault(require("./routes/tasksRoute"));
var recurringSchedulesRoute_1 = __importDefault(require("./routes/recurringSchedulesRoute"));
var db_1 = __importDefault(require("./config/db"));
var app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.static(path_1.default.join(__dirname, "../public")));
app.use("/api/tasks", tasksRoute_1.default);
app.use("/api/recurring-schedules", recurringSchedulesRoute_1.default);
app.get("*", function (_req, res, next) {
    try {
        res.sendFile(path_1.default.join(__dirname, "../public", "index.html"));
    }
    catch (error) {
        next(error);
    }
});
var PORT = 3000;
(0, db_1.default)().then(function () {
    app.listen(PORT, function () {
        console.log("Mongo uri ".concat(process.env.MONGO_URI));
        console.log("App listening on port ".concat(PORT));
    });
});
