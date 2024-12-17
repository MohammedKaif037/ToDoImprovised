import React, { useState, useEffect } from 'react';
import { CheckSquare } from 'lucide-react';
import { Todo, Project } from './types/todo';
import { TodoForm } from './components/TodoForm';
import { TodoList } from './components/TodoList';
import { TodoFilters } from './components/TodoFilters';

function App() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem('todos');
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.map((todo: any) => ({
        ...todo,
        dueDate: todo.dueDate ? new Date(todo.dueDate) : undefined,
        reminder: todo.reminder ? new Date(todo.reminder) : undefined,
        createdAt: new Date(todo.createdAt),
        subtasks: todo.subtasks || [], // Ensure subtasks array exists
      }));
    }
    return [];
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('projects');
    return saved ? JSON.parse(saved) : [];
  });

  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const [projectFilter, setProjectFilter] = useState('');

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
    localStorage.setItem('projects', JSON.stringify(projects));

    // Check for reminders
    const checkReminders = () => {
      todos.forEach((todo) => {
        if (
          todo.reminder &&
          !todo.completed &&
          new Date(todo.reminder) <= new Date() &&
          new Date(todo.reminder).getTime() > new Date().getTime() - 60000
        ) {
          new Notification('Todo Reminder', {
            body: todo.title,
            icon: '/vite.svg',
          });
        }
      });
    };

    if ('Notification' in window && Notification.permission === 'granted') {
      const interval = setInterval(checkReminders, 60000);
      return () => clearInterval(interval);
    }
  }, [todos, projects]);

  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  };

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  const handleAddTodo = (newTodo: Omit<Todo, 'id' | 'createdAt'>) => {
    setTodos([
      {
        ...newTodo,
        id: crypto.randomUUID(),
        createdAt: new Date(),
        subtasks: [], // Initialize empty subtasks array
      },
      ...todos,
    ]);
  };

  const handleAddProject = (newProject: Omit<Project, 'id'>) => {
    setProjects([
      ...projects,
      {
        ...newProject,
        id: crypto.randomUUID(),
      },
    ]);
  };

  const handleToggleTodo = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const handleDeleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const handleToggleSubtask = (todoId: string, subtaskId: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === todoId
          ? {
              ...todo,
              subtasks: todo.subtasks.map((subtask) =>
                subtask.id === subtaskId
                  ? { ...subtask, completed: !subtask.completed }
                  : subtask
              ),
            }
          : todo
      )
    );
  };

  const handleAddSubtask = (todoId: string, title: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === todoId
          ? {
              ...todo,
              subtasks: [
                ...todo.subtasks,
                { id: crypto.randomUUID(), title, completed: false },
              ],
            }
          : todo
      )
    );
  };

  const handleDeleteSubtask = (todoId: string, subtaskId: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === todoId
          ? {
              ...todo,
              subtasks: todo.subtasks.filter((subtask) => subtask.id !== subtaskId),
            }
          : todo
      )
    );
  };

  const handleUpdateTodo = (updatedTodo: Todo) => {
    setTodos(
      todos.map((todo) =>
        todo.id === updatedTodo.id ? updatedTodo : todo
      )
    );
  };

  const filteredTodos = todos.filter((todo) => {
    const matchesSearch = todo.title
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesPriority = !priorityFilter || todo.priority === priorityFilter;
    const matchesTag =
      !tagFilter || todo.tags.some((tag) => tag === tagFilter);
    const matchesProject = !projectFilter || todo.projectId === projectFilter;
    return matchesSearch && matchesPriority && matchesTag && matchesProject;
  });

  const availableTags = Array.from(
    new Set(todos.flatMap((todo) => todo.tags))
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="flex items-center gap-3 mb-8">
          <CheckSquare className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Advanced Todo App</h1>
        </div>

        <div className="space-y-6">
          <TodoForm
            onSubmit={handleAddTodo}
            projects={projects}
            onAddProject={handleAddProject}
          />

          <TodoFilters
            search={search}
            onSearchChange={setSearch}
            priorityFilter={priorityFilter}
            onPriorityFilterChange={setPriorityFilter}
            tagFilter={tagFilter}
            onTagFilterChange={setTagFilter}
            availableTags={availableTags}
            projectFilter={projectFilter}
            onProjectFilterChange={setProjectFilter}
            projects={projects}
          />

          <TodoList
            todos={filteredTodos}
            projects={projects}
            onToggle={handleToggleTodo}
            onDelete={handleDeleteTodo}
            onToggleSubtask={handleToggleSubtask}
            onAddSubtask={handleAddSubtask}
            onDeleteSubtask={handleDeleteSubtask}
            onUpdateTodo={handleUpdateTodo}
          />
        </div>
      </div>
    </div>
  );
}

export default App;