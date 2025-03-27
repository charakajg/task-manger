import mongoose, { Schema, Document, Types } from "mongoose";

export interface ITask extends Document {
    title: string;
    priority: "low" | "medium" | "high";
    completed: boolean;
    createdAt: Date;
    dependencies: Types.ObjectId[];
}

const TaskSchema: Schema = new Schema(
    {
        title: { type: String, required: true },
        priority: { type: String, enum: ["low", "medium", "high"], required: true },
        completed: { type: Boolean, default: false },
        dependencies: [{ type: Schema.Types.ObjectId, ref: "Task" }],
    },
    {
        timestamps: true
    }
);

export default mongoose.model<ITask>("Task", TaskSchema);
