import express, { Request, Response } from "express";
import { getTasks, getTaskById, createTask, updateTask, deleteTask } from "../services/taskService";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const tasks = await getTasks(req.query);
    res.json(tasks);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : JSON.stringify(error);
    res.status(400).json({ error: errorMessage });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const task = await getTaskById(req.params.id);
    task ? res.json(task) : res.status(404).json({ message: "Task not found" });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : JSON.stringify(error);
    res.status(400).json({ error: errorMessage });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const task = await createTask(req.body);
    res.status(201).json(task);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : JSON.stringify(error);
    res.status(400).json({ error: errorMessage });
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  try {
    const task = await updateTask(req.params.id, req.body);
    res.json(task);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : JSON.stringify(error);
    res.status(400).json({ error: errorMessage });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    await deleteTask(req.params.id);
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : JSON.stringify(error);
    res.status(400).json({ error: errorMessage });
  }
});

export default router;
