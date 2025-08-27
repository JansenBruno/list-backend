import { Router } from 'express';
import { TaskController } from './controller';

export const tasksRouter = Router();

tasksRouter.get('/', TaskController.list);
tasksRouter.post('/', TaskController.create);
tasksRouter.put('/:id', TaskController.update);
tasksRouter.delete('/:id', TaskController.remove);
tasksRouter.post('/:id/move', TaskController.move);
tasksRouter.put('/reorder', TaskController.reorder);