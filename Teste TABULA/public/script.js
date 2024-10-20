document.addEventListener('DOMContentLoaded', () => {
  fetchTasks();

  // Adicionar nova tarefa
  document.querySelector('#addTaskForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const newTask = {
      title: document.querySelector('#nome').value,
      description: document.querySelector('#descricao').value,
      date: document.querySelector('#data').value,
      completed: false
    };

    fetch('/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify([newTask])
    })
    .then(response => response.json())
    .then(() => {
      fetchTasks();
      document.querySelector('#addTaskForm').reset();
    });
  });

  // Função para buscar e renderizar as tarefas
  function fetchTasks() {
    fetch('/tasks')
      .then(response => response.json())
      .then(tasks => renderTasks(tasks));
  }

  // Renderiza as tarefas no HTML
  function renderTasks(tasks) {
    const taskList = document.querySelector('#taskList');
    taskList.innerHTML = '';

    tasks.forEach(task => {
      const taskRow = document.createElement('tr');
      taskRow.innerHTML = `
        <td>${task.id}</td>
        <td>${task.title}</td>
        <td>${task.description}</td>
        <td>${task.date}</td>
        <td>${task.completed ? 'Concluída' : 'Pendente'}</td>
        <td>
          <button class="btn btn-success btn-sm complete-btn" data-id="${task.id}">Concluir</button>
          <button class="btn btn-warning btn-sm edit-btn" data-id="${task.id}" data-bs-toggle="modal" data-bs-target="#editTaskModal">Editar</button>
          <button class="btn btn-danger btn-sm delete-btn" data-id="${task.id}">Excluir</button>
        </td>
      `;
      taskList.appendChild(taskRow);
    });

    // Event listeners para cada botão
    document.querySelectorAll('.complete-btn').forEach(button => {
      button.addEventListener('click', markAsComplete);
    });
    document.querySelectorAll('.edit-btn').forEach(button => {
      button.addEventListener('click', showEditModal);
    });
    document.querySelectorAll('.delete-btn').forEach(button => {
      button.addEventListener('click', deleteTask);
    });
  }

  // Função para marcar tarefa como concluída
  function markAsComplete(event) {
    const taskId = event.target.getAttribute('data-id');
    fetch(`/tasks/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ completed: true })
    })
    .then(() => fetchTasks());
  }

  // Função para mostrar modal de edição e carregar os dados da tarefa no modal
  function showEditModal(event) {
    const taskId = event.target.getAttribute('data-id');
    
    // Buscar os dados da tarefa para edição
    fetch(`/tasks`)
      .then(response => response.json())
      .then(tasks => {
        const task = tasks.find(t => t.id == taskId);
        
        // Preencher os campos do modal com os dados da tarefa
        document.querySelector('#editNome').value = task.title;
        document.querySelector('#editDescricao').value = task.description;
        document.querySelector('#editData').value = task.date;
        document.querySelector('#editTaskForm').setAttribute('data-id', taskId);
        
        // Abrir o modal de edição manualmente se não estiver abrindo
        const editModal = new bootstrap.Modal(document.querySelector('#editTaskModal'));
        editModal.show();
      });
  }

  // Função para editar tarefa
  document.querySelector('#editTaskForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const taskId = this.getAttribute('data-id');
    const updatedTask = {
      title: document.querySelector('#editNome').value,
      description: document.querySelector('#editDescricao').value,
      date: document.querySelector('#editData').value
    };

    fetch(`/tasks/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedTask)
    })
    .then(() => {
      fetchTasks();
      new bootstrap.Modal(document.querySelector('#editTaskModal')).hide();
    });
  });

  // Função para deletar tarefa
  function deleteTask(event) {
    const taskId = event.target.getAttribute('data-id');
    fetch(`/tasks/${taskId}`, {
      method: 'DELETE'
    })
    .then(() => fetchTasks());
  }

  // Função para buscar tarefas pelo nome
  window.searchTasks = function() {
    const searchInput = document.querySelector('#searchInput').value.toLowerCase();
    fetch('/tasks')
      .then(response => response.json())
      .then(tasks => {
        const filteredTasks = tasks.filter(task => task.title.toLowerCase().includes(searchInput));
        renderTasks(filteredTasks);
      });
  };
});
