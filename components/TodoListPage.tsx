import React, { useState, useEffect, useMemo } from 'react';

interface TodoListPageProps {
  goToHome: () => void;
}

interface Todo {
  text: string;
  completed: boolean;
}

const TODO_STORAGE_KEY = 'wellness-todos';

const TodoListPage: React.FC<TodoListPageProps> = ({ goToHome }) => {
  const [todos, setTodos] = useState<Todo[]>(() => {
    try {
      const storedTodos = localStorage.getItem(TODO_STORAGE_KEY);
      return storedTodos ? JSON.parse(storedTodos) : [
        { text: 'Drink 8 glasses of water', completed: true },
        { text: 'Eat a salad for lunch', completed: false },
        { text: 'Go for a 30-minute walk', completed: false },
      ];
    } catch (error) {
      console.error("Failed to parse todos from localStorage", error);
      return [];
    }
  });
  const [inputValue, setInputValue] = useState<string>('');

  useEffect(() => {
    try {
      localStorage.setItem(TODO_STORAGE_KEY, JSON.stringify(todos));
    } catch (error) {
      console.error("Failed to save todos to localStorage", error);
    }
  }, [todos]);

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      const newTodo: Todo = { text: inputValue.trim(), completed: false };
      setTodos([...todos, newTodo]);
      setInputValue('');
    }
  };

  const handleRemoveTodo = (indexToRemove: number) => {
    setTodos(todos.filter((_, index) => index !== indexToRemove));
  };

  const handleToggleTodo = (indexToToggle: number) => {
    const newTodos = todos.map((todo, index) => {
      if (index === indexToToggle) {
        return { ...todo, completed: !todo.completed };
      }
      return todo;
    });
    setTodos(newTodos);
  };

  const { completedCount, progressPercentage } = useMemo(() => {
    const completedCount = todos.filter(todo => todo.completed).length;
    const progressPercentage = todos.length > 0 ? (completedCount / todos.length) * 100 : 0;
    return { completedCount, progressPercentage };
  }, [todos]);

  return (
    <div className="container mx-auto p-4 py-16 lg:py-20 animate-fade-in">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <button 
            onClick={goToHome}
            className="flex items-center text-cyan-600 hover:text-cyan-800 transition-colors duration-300 group font-semibold"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </button>
        </div>
        <div className="bg-white/40 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 p-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-700 text-center mb-4">My Wellness To-Do List</h2>
          
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-gray-600">Daily Progress</span>
              <span className="text-sm font-bold text-emerald-600">{completedCount} / {todos.length} Completed</span>
            </div>
            <div className="w-full bg-gray-200/70 rounded-full h-2.5">
              <div 
                className="bg-gradient-to-r from-emerald-500 to-cyan-500 h-2.5 rounded-full transition-all duration-500" 
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>

          <form onSubmit={handleAddTodo} className="flex gap-4 mb-8">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="e.g., Prepare healthy snacks"
              className="flex-grow bg-transparent border-b-2 py-2 px-1 text-gray-800 focus:outline-none transition-colors duration-300 border-gray-300/70 hover:border-gray-500/80 focus:border-emerald-500"
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold py-2 px-5 rounded-lg focus:outline-none focus:ring-4 focus:ring-emerald-300 transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 hover:shadow-lg"
            >
              Add
            </button>
          </form>
          <ul className="space-y-4">
            {todos.map((todo, index) => (
              <li
                key={index}
                className="flex items-center justify-between bg-white/50 p-4 rounded-lg shadow-sm animate-fade-in group"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => handleToggleTodo(index)}
                    className="h-5 w-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                  <span className={`ml-4 text-gray-700 break-all transition-colors ${todo.completed ? 'line-through text-gray-400' : ''}`}>
                    {todo.text}
                  </span>
                </div>
                <button
                  onClick={() => handleRemoveTodo(index)}
                  className="text-red-400 hover:text-red-600 transition-colors ml-4 opacity-0 group-hover:opacity-100"
                  aria-label={`Remove ${todo.text}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </li>
            ))}
            {todos.length === 0 && (
              <p className="text-center text-gray-500 py-4">Your to-do list is empty. Add a task to get started!</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TodoListPage;
