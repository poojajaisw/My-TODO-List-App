import React, { useEffect, useState } from 'react';
import './App.css'


function TaskList() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);


  const getdata = async () => {
    try {
      const response = await fetch('http://localhost:4400/tasks')
      const data = await response.json()
      setTasks(data)
      console.log(data)
    } catch (err) {
      console.log(err)
    }
  }

  const handleDeleteTask = async (taskId) => {
    try {
      const response = await fetch(`http://localhost:4400/tasks/${taskId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete the to-do item');
      }
      // Remove the item from the state
      setTasks(tasks.filter((task) => task.taskId !== taskId));
    } catch (error) {
      console.error('Error deleting to-do item:', error);
    }
  };

  

  const handleAddTask = async () => {

    try {
      const response = await fetch('http://localhost:4400/addtasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ taskText: task }),
      })
      const data = await response
      if (response.status === 201) {
        setTask('');
        alert('Task added successfully.');
        getdata(data)
      } else {
        alert('Failed to add task. Please try again.');
      }
    } catch (err) {
      console.log(err)
    }
    // Send a POST request to add the task to the backend API

  };

  useEffect(() => {
    getdata();
  }, []);

  return (
    <div>

      <div>
        <h1 className="h1">To Do List App</h1>
        <input type="text" className="box" value={task} onChange={(e) => setTask(e.target.value)} placeholder="Enter task" />
        <button onClick={handleAddTask} className="btn1">Add Task</button>
      </div>

      <h3 className="h3">Task List</h3>
      <ul className="ul">
        {tasks.map((task) => (
          <li key={task.taskId} className="li">{task.taskText}<botton className="cross" onClick={() => handleDeleteTask(task.taskId)}>X</botton></li>
        ))}
      </ul>
    </div>
  );


}

export default TaskList;
