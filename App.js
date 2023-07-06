//import React from 'react'
import {BrowserRouter as Router, Route} from 'react-router-dm'
import Header from './components/Header'
import Tasks from './components/Tasks'
import { useEffect, useState } from 'react'
import AddTask from './components/AddTask'
import Footer from './components/Footer'
import About from './components/About'


const App = () => {
const [showAddTask, setShowAddTask] = useState(false)
const [tasks, setTasks] = useState([])

useEffect (() => {

  const getTasks = async () => {
    const tasksFromServer = await fetchTasks() 
    setTasks(tasksFromServer)

  }

  getTasks() 
}, [])

const fetchTasks  = async() => {
  const rest =  await fetch ('http://localhost:5000/tasks')
  const data = await rest.json()
  return data
}

const fetchTask  = async(id) => {
  const rest =  await fetch (`http://localhost:5000/tasks/${id}`)
  const data = await rest.json()
  return data
}


const addTask = async (task) => {
  const res = await fetch('http://localhost:5000/tasks' , {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify(task)
  })
   const data = await res.json()

   setTasks([...tasks, data])
// const id = Math.floor(Math.random() * 10000) +1
// const newTask = {id, ...task}
// setTasks([...tasks, newTask])
}

const deleteTask = async (id) => {
  await  fetch(`http://localhost:5000/tasks/${id}`,{
    method: 'DELETE',
  })

  setTasks(tasks.filter((task) => task.id !== id))
}

const toggleReminder = async (id) => {
  const taskToToggle = await fetchTask(id)
  const updateTask = { ...taskToToggle, reminder: !taskToToggle.reminder}
  const res = await fetch(`http://localhost:5000/tasks/${id}`, {
    method: 'PUT',
    headers: {
      'Content-type' : 'application/json'
    },
    body: JSON.stringify(updateTask)
  })

  const data = await res.json()
  setTasks(tasks.map((task) => task.id === id ? {...task, reminder:data.reminder}: task))
}
 
  return (
    <Router>
    <div className="Container" >
      <Header onAdd = {() => setShowAddTask(!showAddTask)}
      showAdd = {showAddTask}/>
      {showAddTask && <AddTask onAdd = {addTask}/>}
      {tasks.length > 0 ? <Tasks tasks={tasks} onDelete={deleteTask} 
      onToggle= {toggleReminder}/>:
      'No tasks to show'}
      <Route path='/about' component = {About}/>
      <Footer/>
    </div>

    </Router>
  );
}


// class App extends React.Component{
//   render(){
//     return <h1>Hello from class</h1>
//   }
// }

export default App;
