import { z } from 'zod';

export const CreateTaskDTO = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  cost: z.number().nonnegative(),
  dueDate: z.string().refine(v => !v || !Number.isNaN(Date.parse(v)), 'Data inválida').optional().nullable().transform(v => v ?? null),
});

export const UpdateTaskDTO = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  cost: z.number().nonnegative(),
  dueDate: z.string().refine(v => !v || !Number.isNaN(Date.parse(v)), 'Data inválida').optional().nullable().transform(v => v ?? null),
});

export const MoveTaskDTO = z.object({
  direction: z.enum(['up', 'down']),
});

export type CreateTaskInput = z.infer<typeof CreateTaskDTO>;
export type UpdateTaskInput = z.infer<typeof UpdateTaskDTO>;
export type MoveTaskInput = z.infer<typeof MoveTaskDTO>;