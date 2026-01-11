import React, { useState } from "react";

function Create({ onAdd }) {
  const [task, setTask] = useState("");
  const [dueDate, setDueDate] = useState("");

  const handleAdd = () => {
    if (!task.trim()) return;

    const newTask = {
      task,
      dueDate,
      completed: false
    };

    const existingTasks =
      JSON.parse(localStorage.getItem("todos")) || [];

    localStorage.setItem(
      "todos",
      JSON.stringify([...existingTasks, newTask])
    );

    setTask("");
    setDueDate("");
    onAdd(); // 🔥 tells parent to reload
  };

  return (
    <div className="create_form">
      <input
        type="text"
        placeholder="Enter text"
        value={task}
        onChange={(e) => setTask(e.target.value)}
      />

      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />

      <button type="button" onClick={handleAdd}>
        Add
      </button>
    </div>
  );
}

export default Create;
