import React from 'react';
import { CheckCircle2, Circle, Plus, Trash2 } from 'lucide-react';
import { Subtask } from '../types/todo';

interface SubtaskListProps {
  subtasks: Subtask[];
  onToggleSubtask: (id: string) => void;
  onAddSubtask: (title: string) => void;
  onDeleteSubtask: (id: string) => void;
}

export function SubtaskList({
  subtasks,
  onToggleSubtask,
  onAddSubtask,
  onDeleteSubtask,
}: SubtaskListProps) {
  const [newSubtask, setNewSubtask] = React.useState('');

  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSubtask.trim()) {
      onAddSubtask(newSubtask.trim());
      setNewSubtask('');
    }
  };

  return (
    <div className="mt-3 space-y-2">
      <h4 className="text-sm font-medium text-gray-700">Subtasks</h4>
      
      {subtasks.map((subtask) => (
        <div key={subtask.id} className="flex items-center gap-2 pl-4">
          <button
            onClick={() => onToggleSubtask(subtask.id)}
            className="text-gray-500 hover:text-blue-600 transition-colors"
          >
            {subtask.completed ? (
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            ) : (
              <Circle className="h-4 w-4" />
            )}
          </button>
          <span className={subtask.completed ? 'line-through text-gray-500' : ''}>
            {subtask.title}
          </span>
          <button
            onClick={() => onDeleteSubtask(subtask.id)}
            className="ml-auto text-gray-400 hover:text-red-600 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}

      <form onSubmit={handleAddSubtask} className="flex gap-2">
        <input
          type="text"
          value={newSubtask}
          onChange={(e) => setNewSubtask(e.target.value)}
          placeholder="Add subtask..."
          className="flex-1 px-3 py-1 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center gap-1"
        >
          <Plus className="h-4 w-4" />
          Add
        </button>
      </form>
    </div>
  );
}