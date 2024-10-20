const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;
const tasksFilePath = path.join(__dirname, 'tarefas.json');

app.use(express.static('public'));
app.use(express.json());

// Função para ler tarefas do arquivo JSON
const readTasks = () => {
  const data = fs.readFileSync(tasksFilePath, 'utf-8');
  return JSON.parse(data);
};

// Função para escrever tarefas no arquivo JSON
const writeTasks = (tasks) => {
  fs.writeFileSync(tasksFilePath, JSON.stringify(tasks, null, 2));
};

// Listar todas as tarefas
app.get('/tasks', (req, res) => {
  const tasks = readTasks();
  res.json(tasks);
});

// Adicionar nova tarefa
app.post('/tasks', (req, res) => {
  const tasks = readTasks();
  const newTask = { id: Date.now(), ...req.body[0] };
  tasks.push(newTask);
  writeTasks(tasks);
  res.status(201).json(newTask);
});

// Editar tarefa existente
app.put('/tasks/:id', (req, res) => {
  const tasks = readTasks();
  const taskIndex = tasks.findIndex(task => task.id == req.params.id);
  if (taskIndex !== -1) {
    tasks[taskIndex] = { ...tasks[taskIndex], ...req.body };
    writeTasks(tasks);
    res.json(tasks[taskIndex]);
  } else {
    res.status(404).json({ message: 'Tarefa não encontrada' });
  }
});

// Deletar tarefa
app.delete('/tasks/:id', (req, res) => {
  const tasks = readTasks();
  const updatedTasks = tasks.filter(task => task.id != req.params.id);
  writeTasks(updatedTasks);
  res.status(200).json({ message: 'Tarefa excluída com sucesso' });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
