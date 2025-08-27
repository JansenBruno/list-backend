import { db } from '../../infra/db';
import type { TaskEntity } from './entity';

export class TaskRepository {
  list(): TaskEntity[] {
    return db.prepare('SELECT id, name, cost, dueDate, displayOrder FROM tasks ORDER BY displayOrder ASC').all() as TaskEntity[];
  }

  findById(id: number): TaskEntity | undefined {
    return db.prepare('SELECT id, name, cost, dueDate, displayOrder FROM tasks WHERE id = ?').get(id) as TaskEntity | undefined;
  }

  findByName(name: string): TaskEntity | undefined {
    return db.prepare('SELECT id, name, cost, dueDate, displayOrder FROM tasks WHERE name = ?').get(name) as TaskEntity | undefined;
  }

  maxOrder(): number {
    const row = db.prepare('SELECT MAX(displayOrder) as maxOrder FROM tasks').get() as { maxOrder: number | null };
    return row.maxOrder ?? 0;
  }

  insert(data: { name: string; cost: number; dueDate: string | null; displayOrder: number }): TaskEntity {
    const info = db.prepare('INSERT INTO tasks (name, cost, dueDate, displayOrder) VALUES (?, ?, ?, ?)')
      .run(data.name, data.cost, data.dueDate, data.displayOrder);
    return this.findById(Number(info.lastInsertRowid))!;
  }

  update(id: number, data: { name: string; cost: number; dueDate: string | null }): TaskEntity | undefined {
    const result = db.prepare('UPDATE tasks SET name = ?, cost = ?, dueDate = ? WHERE id = ?')
      .run(data.name, data.cost, data.dueDate, id);
    if (result.changes === 0) return undefined;
    return this.findById(id);
  }

  delete(id: number): boolean {
    const res = db.prepare('DELETE FROM tasks WHERE id = ?').run(id);
    return res.changes > 0;
  }

  swapOrder(a: TaskEntity, b: TaskEntity): void {
    const tx = db.transaction(() => {
      db.prepare('UPDATE tasks SET displayOrder = ? WHERE id = ?').run(b.displayOrder, a.id);
      db.prepare('UPDATE tasks SET displayOrder = ? WHERE id = ?').run(a.displayOrder, b.id);
    });
    tx();
  }

  previousByOrder(order: number): TaskEntity | undefined {
    return db.prepare('SELECT * FROM tasks WHERE displayOrder < ? ORDER BY displayOrder DESC LIMIT 1').get(order) as TaskEntity | undefined;
  }

  nextByOrder(order: number): TaskEntity | undefined {
    return db.prepare('SELECT * FROM tasks WHERE displayOrder > ? ORDER BY displayOrder ASC LIMIT 1').get(order) as TaskEntity | undefined;
  }

  reorderByIds(ids: number[]): void {
    const tx = db.transaction(() => {
      ids.forEach((id, idx) => {
        db.prepare('UPDATE tasks SET displayOrder = ? WHERE id = ?').run(idx + 1, id);
      });
    });
    tx();
  }
}