export interface TaskEntity {
  id: number;
  name: string;
  cost: number;
  dueDate: string | null;
  displayOrder: number;
}