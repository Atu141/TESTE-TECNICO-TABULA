const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;
const tasksFilePath = path.join(__dirname, 'tarefas.json');

// Middleware para processar JSON
app.use(express.json());
app.use(express.static('public')); // Servir arquivos estáticos

// Função auxiliar para ler as tarefas do arquivo JSON
const readTasksFromFile = () => {
    if (!fs.existsSync(tasksFilePath)) {
        return [];
    }
    const data = fs.readFileSync(tasksFilePath, 'utf-8');
    return JSON.parse(data);
};

// Função auxiliar para escrever as tarefas no arquivo JSON
const writeTasksToFile = (tasks) => {
    fs.writeFileSync(tasksFilePath, JSON.stringify(tasks, null, 2), 'utf-8');
};

// Rota para obter todas as tarefas
app.get('/tasks', (req, res) => {
    const tasks = readTasksFromFile();
    res.json(tasks);
});

// Rota para adicionar uma nova tarefa
app.post('/tasks', (req, res) => {
    const newTask = req.body;  // Recebe a nova tarefa do cliente
    const tasks = readTasksFromFile();
    
    // Definir ID para a nova tarefa
    newTask.id = tasks.length ? tasks[tasks.length - 1].id + 1 : 1;
    newTask.completed = false;  // Inicialmente, a tarefa não está concluída

    tasks.push(newTask);
    writeTasksToFile(tasks);
    res.status(201).json({ message: 'Tarefa adicionada com sucesso!' });
});

// Rota para editar uma tarefa existente
app.put('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id, 10);
    const updatedTask = req.body;  // Tarefa atualizada vinda do front-end
    const tasks = readTasksFromFile();

    const taskIndex = tasks.findIndex(task => task.id === taskId);
    if (taskIndex !== -1) {
        tasks[taskIndex] = { ...tasks[taskIndex], ...updatedTask };  // Atualizando a tarefa
        writeTasksToFile(tasks);
        res.json({ message: 'Tarefa atualizada com sucesso!' });
    } else {
        res.status(404).json({ message: 'Tarefa não encontrada' });
    }
});

// Rota para deletar uma tarefa
app.delete('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id, 10);
    let tasks = readTasksFromFile();

    tasks = tasks.filter(task => task.id !== taskId);  // Remove a tarefa
    writeTasksToFile(tasks);
    res.status(200).json({ message: 'Tarefa excluída com sucesso!' });
});

// Rota para marcar uma tarefa como concluída ou não
app.put('/tasks/:id/completed', (req, res) => {
    const taskId = parseInt(req.params.id, 10);
    const tasks = readTasksFromFile();

    const task = tasks.find(task => task.id === taskId);
    if (task) {
        task.completed = !task.completed;  // Alternar entre concluído e não concluído
        writeTasksToFile(tasks);
        res.json({ message: 'Tarefa atualizada com sucesso!' });
    } else {
        res.status(404).json({ message: 'Tarefa não encontrada' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
