import express, { Request, Response } from 'express';
import {
  getRecurringSchedules,
  getRecurringScheduleById,
  updateRecurringSchedule,
  deleteRecurringSchedule,
} from '../services/recurringScheduleService';

const router = express.Router();

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
router.get('/', async (req: Request, res: Response) => {
  const { query, priority, page, limit } = req.query;

  try {
    // Convert page and limit to numbers with defaults
    const pageNum = page ? parseInt(page as string, 10) : 1;
    const limitNum = limit ? parseInt(limit as string, 10) : 10;

    const result = await getRecurringSchedules(
      query as string,
      priority as string,
      pageNum,
      limitNum,
    );
    res.json(result);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : JSON.stringify(error);
    res.status(400).json({ error: errorMessage });
  }
});

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
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const recurringSchedule = await getRecurringScheduleById(req.params.id);
    recurringSchedule
      ? res.json(recurringSchedule)
      : res.status(404).json({ message: 'Recurring schedule not found' });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

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
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const recurringSchedule = await updateRecurringSchedule(
      req.params.id,
      req.body,
    );
    recurringSchedule
      ? res.json(recurringSchedule)
      : res.status(404).json({ message: 'Recurring schedule not found' });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

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
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const recurringSchedule = await deleteRecurringSchedule(req.params.id);
    recurringSchedule
      ? res.json({ message: 'Recurring schedule deleted' })
      : res.status(404).json({ message: 'Recurring schedule not found' });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
