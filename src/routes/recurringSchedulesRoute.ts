import express, { Request, Response } from "express";
import {
    getRecurringSchedules,
    getRecurringScheduleById,
    updateRecurringSchedule,
    deleteRecurringSchedule
} from "../services/recurringScheduleService";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
    const { query, priority } = req.query;

    try {
        const recurringSchedules = await getRecurringSchedules(query as string, priority as string);
        res.json(recurringSchedules);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : JSON.stringify(error);
        res.status(400).json({ error: errorMessage });
    }
});

router.get("/:id", async (req: Request, res: Response) => {
    try {
        const recurringSchedule = await getRecurringScheduleById(req.params.id);
        recurringSchedule
            ? res.json(recurringSchedule)
            : res.status(404).json({ message: "Recurring schedule not found" });
    } catch (error) {
        res.status(400).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
});

router.put("/:id", async (req: Request, res: Response) => {
    try {
        const recurringSchedule = await updateRecurringSchedule(req.params.id, req.body);
        recurringSchedule
            ? res.json(recurringSchedule)
            : res.status(404).json({ message: "Recurring schedule not found" });
    } catch (error) {
        res.status(400).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
});

router.delete("/:id", async (req: Request, res: Response) => {
    try {
        const recurringSchedule = await deleteRecurringSchedule(req.params.id);
        recurringSchedule
            ? res.json({ message: "Recurring schedule deleted" })
            : res.status(404).json({ message: "Recurring schedule not found" });
    } catch (error) {
        res.status(400).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
});

export default router;
