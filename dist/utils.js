"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapFrequency = mapFrequency;
var frequencyMapper = {
    daily: "days",
    weekly: "weeks",
    monthly: "months",
};
// Function to map frequency values
function mapFrequency(frequency) {
    return frequencyMapper[frequency];
}
