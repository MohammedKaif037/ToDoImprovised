import React from 'react';
import { Folder, Plus } from 'lucide-react';
import { Project } from '../types/todo';

interface ProjectSelectorProps {
  projects: Project[];
  selectedProject?: string;
  onSelectProject: (projectId?: string) => void;
  onAddProject: (project: Omit<Project, 'id'>) => void;
}

export function ProjectSelector({
  projects,
  selectedProject,
  onSelectProject,
  onAddProject,
}: ProjectSelectorProps) {
  const [isAdding, setIsAdding] = React.useState(false);
  const [newProjectName, setNewProjectName] = React.useState('');
  const [newProjectColor, setNewProjectColor] = React.useState('#3B82F6');

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProjectName.trim()) {
      onAddProject({
        name: newProjectName.trim(),
        color: newProjectColor,
      });
      setNewProjectName('');
      setIsAdding(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          <Folder className="inline h-4 w-4 mr-1" />
          Project
        </label>
        <button
          type="button"
          onClick={() => setIsAdding(!isAdding)}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {isAdding ? (
        <form onSubmit={handleAddProject} className="space-y-2">
          <input
            type="text"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            placeholder="Project name"
            className="w-full px-3 py-1 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex gap-2">
            <input
              type="color"
              value={newProjectColor}
              onChange={(e) => setNewProjectColor(e.target.value)}
              className="h-8 w-8 rounded cursor-pointer"
            />
            <button
              type="submit"
              className="flex-1 px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Add Project
            </button>
          </div>
        </form>
      ) : (
        <select
          value={selectedProject || ''}
          onChange={(e) => onSelectProject(e.target.value || undefined)}
          className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">No Project</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}