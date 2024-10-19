const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;
const tasksFilePath = path.join(__dirname, 'tarefas.json');

// Middleware para processar JSON
app.use(express.json());

// Função auxiliar para ler as tarefas do arquivo JSON
const readTasksFromFile = () => {
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
    const newTask = req.body[0];  // Pegando a primeira tarefa do array (formato esperado)
    const tasks = readTasksFromFile();

    newTask.id = tasks.length ? tasks[tasks.length - 1].id + 1 : 1;  // Geração de ID
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

// Servir arquivos estáticos (HTML, JS, CSS)
app.use(express.static('public'));

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
