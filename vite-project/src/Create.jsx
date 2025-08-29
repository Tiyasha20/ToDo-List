import React,{useState} from 'react'
import axios from 'axios'


function Create({onAdd}) {
    const [task, setTask]=useState("")
    const [dueDate, setDueDate] = useState("");
    const handleAdd =() => {
    axios.post('http://localhost:3001/add',{task, dueDate})
    // .then(result =>console.log(result))
    // .catch(err =>console.log(err))
      .then(() => {
        setTask("");
        setDueDate("");      // clear input
        onAdd();          // ✅ refresh todos in Home

      })
      .catch(err => console.log(err))
    }
    return(
        <div className="create_form">
            <input type="text" placeholder="Enter text"  value={task} onChange={(e)=> setTask(e.target.value)} />
            <input
            type="date"
             value={dueDate}
             onChange={(e) => setDueDate(e.target.value)}   // 🔹 update date
            />
            <button type="button" onClick={handleAdd}>Add</button>
        </div>
    )
}
export default  Create