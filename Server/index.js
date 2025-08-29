const express=require('express')
const mongoose=require('mongoose')
const cors=require ('cors')
const TodoModel=require('./Models/Todo')


const app=express()
app.use(cors())
app.use(express.json())

mongoose.connect('mongodb://127.0.0.1:27017/test')

app.get('/get',(req,res)=>{
    TodoModel.find()
    .then(result=> res.json(result))
    .catch(err=>res.json(err))
})
app.put('/update/:id',(req,res) =>{
    const {id}=req.params;
    const { task, done } = req.body;
    TodoModel.findByIdAndUpdate(id,{task,done},{ new: true })
    .then(result=> res.json(result))
    .catch(err=>res.json(err))
})

app.post('/add',(req,res) =>{
    const {task,dueDate}=req.body;
     TodoModel.create({ task ,dueDate ,done: false})
      .then(result => {
          console.log("✅ Saved to DB:", result);  // log saved document
          res.json(result);
      })
      .catch(err => {
          console.error("❌ Error saving:", err);
          res.status(500).json(err);
      });
})
app.delete('/delete/:id', (req, res) => {
  const { id } = req.params;
  console.log("🗑️ Delete request received for ID:", id);  // log
  TodoModel.findByIdAndDelete(id)
    .then(result => {
      console.log("✅ Deleted:", result);
      res.json(result);
    })
    .catch(err => {
      console.error("❌ Error deleting:", err);
      res.json(err);
    });
});
app.use((req, res, next) => {
  console.log("➡️ Request received:", req.method, req.url);
  next();
});

app.listen(3001, () => {
    console.log("Server is running")
})

