import React, { useState,useEffect } from 'react'
import axios from 'axios'

import Create from './Create'



function Home() {
    const [todos,setTodos]=useState([])
     const fetchTodos = () => {
    axios.get('http://localhost:3001/get')
      .then(result => setTodos(result.data))
      .catch(err => console.log(err))
    }
    useEffect(() =>{
       fetchTodos()
    },[])
    const handleEdit = (id, oldTask) => {
    const newTask = prompt("Edit task:", oldTask); // simple prompt
    if (!newTask) return;
    axios.put(`http://localhost:3001/update/${id}`, { task: newTask })
      .then(() => fetchTodos()) // refresh list
      .catch(err => console.log(err));
    };
    const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/delete/${id}`);
      setTodos(todos.filter(todo => todo._id !== id)); // remove locally
    } catch (err) {
      console.log(err);
    }
    };
     const totalTasks = todos.length;
     const completedTasks = todos.filter(todo => todo.done).length;
     const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;


    return(
        <div className="home"> 
        <h2>Todo List</h2>
         <div className="progress-container">
           <p>{completedTasks}/{totalTasks} tasks completed
            ({progress}%)
           </p>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
         </div>
        <Create onAdd={fetchTodos} />
        {
            todos.length===0
            ?
            <div><h2>No Record</h2></div>
            :
            todos.map(todo =>(
            <div className="todo-item">
                <div className="todo-left">
                {/* {todo.task} */}
             <input type="checkbox" className="circle-checkbox"  checked={todo.done}   // ✅ reflect state from DB
              onChange={(e) =>
              axios.put(`http://localhost:3001/update/${todo._id}`, { done: e.target.checked })
              .then(() => fetchTodos())   // refresh list
              .catch(err => console.log(err))
              }
              />

            {/* Task text */}
            <span className={`task-text ${todo.done ? "completed" : ""}`}>
                {todo.task}
                </span>
                {todo.dueDate && (
               <small className="due-date">
          ⏰   {new Date(todo.dueDate).toLocaleDateString("en-GB")}
                </small>
      )}
                </div>
            <span
              className="edit-icon"
              onClick={() => handleEdit(todo._id, todo.task)}
            >
              
            </span>

            {/* Bin icon */}
            <button className="delete-icon" onClick={() => handleDelete(todo._id)}
            >🗑️
            </button>
            </div>
            ))
        }
        
        </div>
    )
}
export default Home