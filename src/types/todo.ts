export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  reminder?: Date;
  tags: string[];
  createdAt: Date;
  projectId?: string;
  subtasks: Subtask[];
}

export interface Project {
  id: string;
  name: string;
  color: string;
}