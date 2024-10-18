const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const PORT = 3000;

// Nome do arquivo JSON
const FILE_NAME = 'tarefas.json';

app.use(bodyParser.json());
app.use(express.static('public')); // Para servir arquivos estáticos (HTML, CSS, JS)

// Função para carregar tarefas do arquivo JSON
function loadTasks() {
  try {
    const data = fs.readFileSync(FILE_NAME, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

// Função para salvar tarefas no arquivo JSON
function saveTasks(tasks) {
  fs.writeFileSync(FILE_NAME, JSON.stringify(tasks, null, 2));
}

// Rota para obter tarefas
app.get('/tasks', (req, res) => {
  const tasks = loadTasks();
  res.json(tasks);
});

// Rota para salvar tarefas
app.post('/tasks', (req, res) => {
  const tasks = req.body;
  saveTasks(tasks);
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
