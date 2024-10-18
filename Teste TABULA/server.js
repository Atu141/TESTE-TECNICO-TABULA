const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

// Caminho completo para o arquivo tarefas.json (usando path para evitar problemas de caminho)
// Problemas com o caminho usnado o path
// const FILE_PATH = path.join(__dirname, 'tarefas.json');

const FILE_PATH = './tarefas.json';


// Middleware para parsear o corpo da requisição como JSON
app.use(bodyParser.json());
app.use(express.static('public')); // Servir arquivos estáticos (HTML, CSS, JS)

// Função para carregar tarefas do arquivo JSON
function loadTasks() {
  try {
    if (fs.existsSync(FILE_PATH)) { // Verificar se o arquivo existe
      const data = fs.readFileSync(FILE_PATH, 'utf8');
      return JSON.parse(data);
    } else {
      return []; // Retornar array vazio se o arquivo não existir
    }
  } catch (err) {
    console.error('Erro ao carregar tarefas:', err);
    return [];
  }
}

// Função para salvar tarefas no arquivo JSON
function saveTasks(tasks) {
  try {
    // Verifica se tasks é um array antes de tentar salvar
    if (Array.isArray(tasks)) {
      fs.writeFileSync(FILE_PATH, JSON.stringify(tasks, null, 2), 'utf8');
    } else {
      console.error('Formato de tarefas inválido. Deve ser um array.');
    }
  } catch (err) {
    console.error('Erro ao salvar tarefas:', err);
  }
}

// Rota para obter tarefas
app.get('/tasks', (req, res) => {
  const tasks = loadTasks();
  res.json(tasks);
});

// Rota para salvar as tarefas
app.post('/tasks', (req, res) => {
  const tasks = req.body;

  // Verifica se o body contém um array válido
  if (Array.isArray(tasks)) {
    saveTasks(tasks); // Salvar no arquivo tarefas.json
    res.sendStatus(200);
  } else {
    res.status(400).send('Dados inválidos. Esperado um array de tarefas.');
  }
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
