import React, { useState, useEffect } from "react";
import Create from "./Create";

function Home() {
  const [todos, setTodos] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // 🔥 LOAD TODOS FROM LOCALSTORAGE
  const loadTodos = () => {
    const savedTodos =
      JSON.parse(localStorage.getItem("todos")) || [];
    setTodos(savedTodos);
  };

  useEffect(() => {
    loadTodos();
  }, []);

  // 🌙 DARK MODE (unchanged – already correct)
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldUseDark = savedTheme === "dark" || (!savedTheme && prefersDark);
    setIsDarkMode(shouldUseDark);

    if (shouldUseDark) {
      document.body.classList.add("dark-mode");
    }
  }, []);

  const toggleDarkMode = () => {
    document.body.classList.add("switching-theme");

    setTimeout(() => {
      const newMode = !isDarkMode;
      setIsDarkMode(newMode);
      document.body.classList.toggle("dark-mode");
      document.body.classList.remove("switching-theme");
      localStorage.setItem("theme", newMode ? "dark" : "light");
    }, 50);
  };

  // ✏️ EDIT TASK
  const handleEdit = (index) => {
    const newTask = prompt("Edit task:", todos[index].task);
    if (!newTask) return;

    const updated = [...todos];
    updated[index].task = newTask;

    localStorage.setItem("todos", JSON.stringify(updated));
    setTodos(updated);
  };

  // 🗑️ DELETE TASK
  const handleDelete = (index) => {
    const updated = todos.filter((_, i) => i !== index);
    localStorage.setItem("todos", JSON.stringify(updated));
    setTodos(updated);
  };

  // ✅ TOGGLE COMPLETE
  const toggleDone = (index) => {
    const updated = [...todos];
    updated[index].completed = !updated[index].completed;

    localStorage.setItem("todos", JSON.stringify(updated));
    setTodos(updated);
  };

  const totalTasks = todos.length;
  const completedTasks = todos.filter(t => t.completed).length;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <div className="home">
      <button
        onClick={toggleDarkMode}
        className="theme-toggle"
        title={isDarkMode ? "Light Mode" : "Dark Mode"}
      >
        {isDarkMode ? "☀️" : "🌙"}
      </button>

      <h2>My Tasks</h2>

      <div className="progress-container">
        <p>{completedTasks}/{totalTasks} tasks completed ({Math.round(progress)}%)</p>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      {/* 🔥 THIS IS CORRECT NOW */}
      <Create onAdd={loadTodos} />

      {todos.length === 0 ? (
        <h3>No Record</h3>
      ) : (
        todos.map((todo, index) => (
          <div className="todo-item" key={index}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleDone(index)}
            />

            <span className={todo.completed ? "completed" : ""}>
              {todo.task}
            </span>

            {todo.dueDate && (
              <small>
                ⏰ {new Date(todo.dueDate).toLocaleDateString("en-GB")}
              </small>
            )}

            <button onClick={() => handleEdit(index)}>✏️</button>
            <button onClick={() => handleDelete(index)}>🗑️</button>
          </div>
        ))
      )}
    </div>
  );
}

export default Home;
