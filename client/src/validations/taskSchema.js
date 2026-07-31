import { z } from 'zod';

export const taskSchema = z.object({
  title: z
    .string()
    .min(1, 'Task title is required')
    .max(200, 'Task title cannot exceed 200 characters'),
  description: z
    .string()
    .max(2000, 'Description cannot exceed 2000 characters')
    .optional(),
  status: z
    .enum(['To Do', 'In Progress', 'Done'])
    .default('To Do'),
  priority: z
    .enum(['Low', 'Medium', 'High'])
    .default('Medium'),
  dueDate: z
    .string()
    .optional()
    .nullable(),
  assignee: z
    .string()
    .optional()
    .nullable()
    .transform(val => val === '' ? null : val)
});