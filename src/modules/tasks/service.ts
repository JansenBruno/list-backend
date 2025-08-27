import type { TaskEntity } from './entity';
import { TaskRepository } from './repository';

export class TaskService {
  private repo = new TaskRepository();

  list(): TaskEntity[] {
    return this.repo.list();
  }

  create(input: { name: string; cost: number; dueDate: string | null }): TaskEntity {
    // regra: nome único
    const dup = this.repo.findByName(input.name);
    if (dup) throw new Error('DUPLICATE_NAME');
    const order = this.repo.maxOrder() + 1;
    return this.repo.insert({ ...input, displayOrder: order });
  }

  update(id: number, input: { name: string; cost: number; dueDate: string | null }): TaskEntity {
    const entity = this.repo.findById(id);
    if (!entity) throw new Error('NOT_FOUND');
    const dup = this.repo.findByName(input.name);
    if (dup && dup.id !== id) throw new Error('DUPLICATE_NAME');
    const updated = this.repo.update(id, input);
    if (!updated) throw new Error('NOT_FOUND');
    return updated;
  }

  delete(id: number): boolean {
    return this.repo.delete(id);
  }

  move(id: number, direction: 'up' | 'down'): void {
    const entity = this.repo.findById(id);
    if (!entity) throw new Error('NOT_FOUND');
    if (direction === 'up') {
      const prev = this.repo.previousByOrder(entity.displayOrder);
      if (!prev) throw new Error('AT_TOP');
      this.repo.swapOrder(entity, prev);
      return;
    }
    if (direction === 'down') {
      const next = this.repo.nextByOrder(entity.displayOrder);
      if (!next) throw new Error('AT_BOTTOM');
      this.repo.swapOrder(entity, next);
      return;
    }
    throw new Error('INVALID_DIRECTION');
  }

  reorder(ids: number[]): void {
    this.repo.reorderByIds(ids);
  }
}