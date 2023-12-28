const express = require('express');
const mysql = require('mysql')
const cors = require('cors')

const app = express();
app.use(cors());
app.use(express.json());


const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "todo"
});

db.connect((err) => {
  if (err) {
    console.error('Error Connecting to the database:' + err);
    return;
  }
  console.log('Connected to the database');
});

//db.query('CREATE TABLE IF NOT EXISTS todolist (taskId INT AUTO_INCREMENT PRIMARY KEY, task)')


app.get('/tasks', async (req, res) => {
  console.log('this api is running')
  await db.query('SELECT * FROM todolist', (err, rows) => {
    if (err) {
      res.status(500).json({ error: 'Error fetching tasks from the database' });
      return;
    }
    res.json(rows);
  });
});


app.post('/addtasks', async (req, res) => {
  try {
    const { taskText } = req.body
    await db.query('INSERT INTO todolist (taskText) VALUES(?)', [taskText], (err, result) => {
      if (err) throw err;
      res.status(201).send("Task Added")
    })

  } catch (err) {
    console.log(err)
  }
});

//  deleting a task (DELETE)
app.delete('/tasks/:taskId', (req, res) => {
  const taskId = req.params.taskId;
  const sql = 'DELETE FROM todolist WHERE taskId = ?';

  db.query(sql, [taskId], (err, result) => {
    if (err) {
      console.error('Error deleting task: ' + err);
      res.status(500).json({ error: 'Error deleting task' });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Task not found' });
    } else {
      res.status(200).json({ message: 'Task deleted successfully' });
    }
  });
});

const port = 4400;
app.listen(port, () => {
  console.log('Server Started on port ${port}');
});






