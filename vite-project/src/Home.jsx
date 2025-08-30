import React, { useState,useEffect } from 'react'
import axios from 'axios'

import Create from './Create'



function Home() {
    const [todos,setTodos]=useState([])
     const [isDarkMode, setIsDarkMode] = useState(false)
     const fetchTodos = () => {
    axios.get('http://localhost:3001/get')
      .then(result => setTodos(result.data))
      .catch(err => console.log(err))
    }
    useEffect(() =>{
       fetchTodos()
    },[])
     useEffect(() => {
        // Load saved theme preference or use system preference
        const savedTheme = localStorage.getItem('theme')
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        
        const shouldUseDark = savedTheme === 'dark' || (!savedTheme && prefersDark)
        setIsDarkMode(shouldUseDark)
        
        if (shouldUseDark) {
            document.body.classList.add('dark-mode')
        }
    }, [])
    
    // ADD: Dark mode toggle function with smooth transition
    const toggleDarkMode = () => {
        // Add switching class for smooth transition
        document.body.classList.add('switching-theme')
        
        // Toggle dark mode after brief delay for smooth effect
        setTimeout(() => {
            const newMode = !isDarkMode
            setIsDarkMode(newMode)
            document.body.classList.toggle('dark-mode')
            document.body.classList.remove('switching-theme')
            
            // Save preference to localStorage
            localStorage.setItem('theme', newMode ? 'dark' : 'light')
        }, 50)
    }
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
      setTodos(todos.filter(todo => todo._id !== id)); 
    } catch (err) {
      console.log(err);
    }
    };
     const totalTasks = todos.length;
     const completedTasks = todos.filter(todo => todo.done).length;
     const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;


    return(
        <div className="home"> 
        <button 
                onClick={toggleDarkMode}
                className="theme-toggle"
                style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    background: 'none',
                    border: `2px solid ${isDarkMode ? '#cbd5e0' : '#667eea'}`,
                    borderRadius: '50%',
                    width: '50px',
                    height: '50px',
                    cursor: 'pointer',
                    fontSize: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s ease',
                    zIndex: 10
                }}
                title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
                {isDarkMode ? '☀️' : '🌙'}
            </button>
        <h2>My Tasks</h2>
         <div className="progress-container">
           <p>{completedTasks}/{totalTasks} tasks completed
            ({Math.round(progress)}%)
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
             <input type="checkbox" className="circle-checkbox"  checked={todo.done}   
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