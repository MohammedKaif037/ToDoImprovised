import React, { useState } from 'react';
import { CheckCircle2, Circle, Clock, Tag, Trash2, AlertCircle, Folder, Edit2 } from 'lucide-react';
import { Todo, Project } from '../types/todo';
import { SubtaskList } from './SubtaskList';

interface TodoListProps {
  todos: Todo[];
  projects: Project[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleSubtask: (todoId: string, subtaskId: string) => void;
  onAddSubtask: (todoId: string, title: string) => void;
  onDeleteSubtask: (todoId: string, subtaskId: string) => void;
  onUpdateTodo: (todo: Todo) => void;
}

export function TodoList({
  todos,
  projects,
  onToggle,
  onDelete,
  onToggleSubtask,
  onAddSubtask,
  onDeleteSubtask,
  onUpdateTodo,
}: TodoListProps) {
  const [editingTodo, setEditingTodo] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const getPriorityColor = (priority: Todo['priority']) => {
    switch (priority) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-green-600';
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString();
  };

  const isOverdue = (date?: Date) => {
    if (!date) return false;
    return new Date(date) < new Date();
  };

  const getProject = (projectId?: string) => {
    return projects.find((p) => p.id === projectId);
  };

  const handleEdit = (todo: Todo) => {
    setEditingTodo(todo.id);
    setEditTitle(todo.title);
    setEditDescription(todo.description || '');
  };

  const handleSaveEdit = (todo: Todo) => {
    onUpdateTodo({
      ...todo,
      title: editTitle,
      description: editDescription
    });
    setEditingTodo(null);
  };

  return (
    <div className="space-y-4">
      {todos.map((todo) => {
        const project = getProject(todo.projectId);
        const isEditing = editingTodo === todo.id;
        
        return (
          <div
            key={todo.id}
            className={`bg-white p-4 rounded-lg shadow-md transition-all ${
              todo.completed ? 'opacity-75' : ''
            }`}
          >
            <div className="flex items-start gap-4">
              <button
                onClick={() => onToggle(todo.id)}
                className="mt-1 text-gray-500 hover:text-blue-600 transition-colors"
              >
                {todo.completed ? (
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                ) : (
                  <Circle className="h-6 w-6" />
                )}
              </button>

              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {isEditing ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <textarea
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          rows={3}
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleSaveEdit(todo)}
                            className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingTodo(null)}
                            className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <h3
                          className={`text-lg font-medium ${
                            todo.completed ? 'line-through text-gray-500' : ''
                          }`}
                        >
                          {todo.title}
                        </h3>
                        {todo.description && (
                          <p className="text-gray-600 mt-1">{todo.description}</p>
                        )}
                      </>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {!isEditing && (
                      <button
                        onClick={() => handleEdit(todo)}
                        className="text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <Edit2 className="h-5 w-5" />
                      </button>
                    )}
                    <button
                      onClick={() => onDelete(todo.id)}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-3 text-sm">
                  <span className={`flex items-center gap-1 ${getPriorityColor(todo.priority)}`}>
                    <AlertCircle className="h-4 w-4" />
                    {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)} Priority
                  </span>

                  {project && (
                    <span
                      className="flex items-center gap-1 px-2 py-0.5 rounded-full text-white"
                      style={{ backgroundColor: project.color }}
                    >
                      <Folder className="h-4 w-4" />
                      {project.name}
                    </span>
                  )}

                  {todo.dueDate && (
                    <span
                      className={`flex items-center gap-1 ${
                        isOverdue(todo.dueDate) ? 'text-red-600' : 'text-gray-600'
                      }`}
                    >
                      <Clock className="h-4 w-4" />
                      Due: {formatDate(todo.dueDate)}
                    </span>
                  )}

                  {todo.reminder && (
                    <span className="flex items-center gap-1 text-purple-600">
                      <Clock className="h-4 w-4" />
                      Reminder: {formatDate(todo.reminder)}
                    </span>
                  )}
                </div>

                {todo.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {todo.tags.map((tag) => (
                      <span
                        key={tag}
                        className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-sm"
                      >
                        <Tag className="h-3 w-3" />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {!isEditing && (
                  <SubtaskList
                    subtasks={todo.subtasks}
                    onToggleSubtask={(subtaskId) => onToggleSubtask(todo.id, subtaskId)}
                    onAddSubtask={(title) => onAddSubtask(todo.id, title)}
                    onDeleteSubtask={(subtaskId) => onDeleteSubtask(todo.id, subtaskId)}
                  />
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}