import express from 'express';
import cors from 'cors';
import { tasksRouter } from './modules/tasks/routes';

export const app = express();
app.use(cors());
app.use(express.json());

app.use('/tasks', tasksRouter);

app.get('/health', (_req, res) => res.json({ ok: true }));
