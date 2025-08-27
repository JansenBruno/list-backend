import type { Request, Response } from 'express';
import { TaskService } from './service';
import { CreateTaskDTO, UpdateTaskDTO, MoveTaskDTO } from './dto';

const service = new TaskService();

export class TaskController {
  static list(_req: Request, res: Response) {
    const data = service.list();
    res.json(data);
  }

  static create(req: Request, res: Response) {
    const parsed = CreateTaskDTO.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0].message });
    try {
      const data = service.create(parsed.data);
      res.status(201).json(data);
    } catch (err: any) {
      if (err.message === 'DUPLICATE_NAME') return res.status(409).json({ error: 'Já existe uma tarefa com esse nome' });
      return res.status(500).json({ error: 'Erro ao criar' });
    }
  }

  static update(req: Request, res: Response) {
    const id = Number(req.params.id);
    const parsed = UpdateTaskDTO.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0].message });
    try {
      const data = service.update(id, parsed.data);
      res.json(data);
    } catch (err: any) {
      if (err.message === 'NOT_FOUND') return res.status(404).json({ error: 'Tarefa não encontrada' });
      if (err.message === 'DUPLICATE_NAME') return res.status(409).json({ error: 'Já existe uma tarefa com esse nome' });
      return res.status(500).json({ error: 'Erro ao atualizar' });
    }
  }

  static remove(req: Request, res: Response) {
    const id = Number(req.params.id);
    const ok = service.delete(id);
    res.json({ deleted: ok });
  }

  static move(req: Request, res: Response) {
    const id = Number(req.params.id);
    const parsed = MoveTaskDTO.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Direção inválida' });
    try {
      service.move(id, parsed.data.direction);
      res.json({ ok: true });
    } catch (err: any) {
      if (err.message === 'NOT_FOUND') return res.status(404).json({ error: 'Tarefa não encontrada' });
      if (err.message === 'AT_TOP') return res.status(400).json({ error: 'Já está no topo' });
      if (err.message === 'AT_BOTTOM') return res.status(400).json({ error: 'Já está na última posição' });
      return res.status(500).json({ error: 'Erro ao mover' });
    }
  }

  static reorder(req: Request, res: Response) {
    const ids = req.body?.ids as number[];
    if (!Array.isArray(ids)) return res.status(400).json({ error: 'Array de ids esperado' });
    service.reorder(ids.map(Number));
    res.json({ ok: true });
  }
}