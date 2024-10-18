let tasks = [];
let editingTaskId = null;

// Carregar tarefas do servidor
async function loadTasks() {
  const response = await fetch('/tasks');
  tasks = await response.json();
  displayTasks();
}

// Função para salvar tarefa
async function saveTask() {
  const nome = document.getElementById('nome').value;
  const descricao = document.getElementById('descricao').value;

  if (!nome) {
    alert('O título é obrigatório.');
    return;
  }

  const task = {
    nome: nome,
    descricao: descricao,
    status: 'Pendente'
  };

  if (editingTaskId !== null) {
    tasks[editingTaskId] = task;
    editingTaskId = null;
  } else {
    tasks.push(task);
  }

  await fetch('/tasks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(tasks)
  });

  document.getElementById('taskForm').reset();
  $('#addActivityModal').modal('hide');
  displayTasks();
}

// Função para exibir as tarefas na lista
function displayTasks() {
  const taskList = document.getElementById('taskList');
  taskList.innerHTML = '';

  // Ordenar tarefas: pendentes primeiro
  tasks.sort((a, b) => a.status === 'Concluída' ? 1 : -1);

  tasks.forEach((task, index) => {
    taskList.innerHTML += `
      <tr class="${task.status === 'Concluída' ? 'completed' : ''}">
        <td>${index + 1}</td>
        <td>${task.nome}</td>
        <td>${task.descricao}</td>
        <td>${task.status}</td>
        <td>
          <button class="btn btn-success" onclick="toggleTaskStatus(${index})">${task.status === 'Pendente' ? 'Concluir' : 'Reabrir'}</button>
          <button class="btn btn-warning" onclick="editTask(${index})">Editar</button>
          <button class="btn btn-danger" onclick="deleteTask(${index})">Excluir</button>
        </td>
      </tr>
    `;
  });
}

// Função para alternar o status da tarefa (Concluída/Pendente)
async function toggleTaskStatus(index) {
  tasks[index].status = tasks[index].status === 'Pendente' ? 'Concluída' : 'Pendente';

  await fetch('/tasks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(tasks)
  });

  displayTasks();
}

// Função para editar uma tarefa
function editTask(index) {
  document.getElementById('nome').value = tasks[index].nome;
  document.getElementById('descricao').value = tasks[index].descricao;
  editingTaskId = index;
  $('#addActivityModal').modal('show');
}

// Função para deletar uma tarefa
async function deleteTask(index) {
  if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
    tasks.splice(index, 1);

    await fetch('/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(tasks)
    });

    displayTasks();
  }
}

// Carregar tarefas ao iniciar
window.onload = loadTasks;
