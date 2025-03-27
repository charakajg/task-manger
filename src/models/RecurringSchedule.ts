import mongoose, { Schema, Document, Types } from "mongoose";

export interface IRecurringSchedule extends Document {
    titlePrefix: string;
    priority: "low" | "medium" | "high";
    frequency: "daily" | "weekly" | "monthly"
    createdAt: Date;
    nextRunningDate: Date;
    nextSuffixNumber: number;
    createdTasks: Types.ObjectId[];
    dependencies: Types.ObjectId[];
}

const RecurringScheduleSchema: Schema = new Schema(
    {
        titlePrefix: { type: String, required: true },
        priority: { type: String, enum: ["low", "medium", "high"], required: true },
        frequency: { type: String, enum: ["daily", "weekly", "monthly"], required: true },
        nextRunningDate: { type: Date, required: true },
        nextSuffixNumber: { type: Number, required: true },
        createdTasks: [{ type: Schema.Types.ObjectId, ref: "Task" }],
        dependencies: [{ type: Schema.Types.ObjectId, ref: "Task" }],
    },
    {
        timestamps: true
    }
);

export default mongoose.model<IRecurringSchedule>("RecurringSchedule", RecurringScheduleSchema);
