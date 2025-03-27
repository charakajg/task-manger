import express, { Request, Response } from "express";
import Task, { ITask } from "../models/Task";
import { Types } from "mongoose";
import RecurringSchedule, { IRecurringSchedule } from "../models/RecurringSchedule";
import moment from "moment";
import { mapFrequency } from "../utils";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
    const { query, priority, completed } = req.query;
    const filter: any = {};

    try {
        if (query) {
            filter.title = { $regex: query as string, $options: "i" };
        }

        if (priority) {
            filter.priority = priority;
        }

        if (completed) {
            filter.completed = completed;
        }

        const tasks = await Task.find(filter);
        res.json(tasks);
    } catch(error) {
        const errorMessage = error instanceof Error ? error.message : JSON.stringify(error)
        res.status(400).json({error: errorMessage})
    }
});

router.get("/:id", async (req: Request, res: Response) => {
    const task = await Task.findById(req.params.id);
    task ? res.json(task) :  res.status(404).json({message: "Task not found"});
});

router.post("/", async(req: Request, res: Response) => {
    const { title, priority, dependencies, recurring, recurringFrequency } = req.body;
    try {
        if (recurring) {
            const initialSuffixNumber = 1;
            const taskDependencies = dependencies.map((id: string) => new Types.ObjectId(id))
            const task: ITask = new Task({ title: `${title} - ${initialSuffixNumber}`, priority, dependencies: taskDependencies });
            await task.save();
            const nextRunningDate: Date = moment().add(1, mapFrequency(recurringFrequency)).toDate(); 
            const recurringSchedule: IRecurringSchedule = new RecurringSchedule({ titlePrefix: title, priority, frequency: recurringFrequency, createdTasks: [task._id], dependencies: taskDependencies, nextSuffixNumber: initialSuffixNumber + 1, nextRunningDate });
            await recurringSchedule.save();
            res.status(201).json(task);
        } else {
            const task: ITask = new Task({ title, priority, completed: false, dependencies: dependencies.map((id: string) => new Types.ObjectId(id)) });
            await task.save();
            res.status(201).json(task);
        }
    } catch(error) {
        const errorMessage = error instanceof Error ? error.message : JSON.stringify(error)
        res.status(400).json({error: errorMessage})
    }
});

router.put("/:id", async (req: Request, res: Response) => {
    const { completed, dependencies } = req.body;
    if (completed || dependencies) {
        const origTask = await Task.findById(req.params.id);
        if (completed && origTask?.dependencies) {
            const allTasks = await Task.find({});
            const incompleteDependantTask = origTask.dependencies.find((depId)=>!(allTasks.find((t) => t._id == depId)?.completed));
            if (incompleteDependantTask) {
                res.status(500).json({error: "Not allowed to mark the task as complete, before its dependencies"});
                return;
            }
        }

        if (dependencies && origTask?.completed) {
            res.status(500).json({error: "Not allowed to update dependencies of an already completed task"});
            return;
        }
    }
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    task ? res.json(task) : res.status(404).json({ message: "Task not found" });
});

router.delete("/:id", async (req: Request, res: Response) => {
    try {
        const taskId = req.params.id;

        // Remove the task from all RecurringSchedules
        await RecurringSchedule.updateMany(
            {
                $or: [
                    { createdTasks: taskId },
                    { dependencies: taskId }
                ]
            },
            {
                $pull: {
                    createdTasks: taskId,
                    dependencies: taskId
                }
            }
        );

        // Remove the task from dependencies in all other tasks
        await Task.updateMany(
            { dependencies: taskId },
            { $pull: { dependencies: taskId } }
        );

        const task = await Task.findByIdAndDelete(taskId);
        task
            ? res.json({ message: "Task deleted successfully" })
            : res.status(404).json({ message: "Task not found" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while deleting the task" });
    }
});


export default router;
