document.addEventListener('DOMContentLoaded', () => {
    fetchTasks(); // Carrega as tarefas quando a página é carregada
  
    // Adicionar tarefa
    document.querySelector('#addTaskForm').addEventListener('submit', function(event) {
      event.preventDefault();  // Impede o comportamento padrão do form
  
      const newTask = {
        title: document.querySelector('#nome').value,
        description: document.querySelector('#descricao').value,
        date: document.querySelector('#data').value,
        completed: false  // Tarefa começa como não concluída
      };
  
      // Enviar nova tarefa para o servidor
      fetch('/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newTask) 
      })
      .then(response => {
        if (response.ok) {
          alert('Tarefa adicionada com sucesso!');
          fetchTasks();
        } else {
          alert('Erro ao adicionar tarefa');
        }
      })
      .catch(error => {
        console.error('Erro ao salvar tarefa:', error);
      });
    });
  });
  
  // Função para buscar tarefas
  function fetchTasks() {
    fetch('/tasks')
      .then(response => response.json())
      .then(tasks => renderTasks(tasks))
      .catch(error => console.error('Erro ao buscar tarefas:', error));
  }
  
  // Função para renderizar as tarefas
  function renderTasks(tasks) {
    const taskList = document.querySelector('#taskList');
    taskList.innerHTML = '';
  
    tasks.forEach((task, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${task.title}</td>
        <td>${task.description || ''}</td>
        <td>${task.date}</td>
        <td>
          <button class="btn btn-success complete-btn" onclick="completeTask(${task.id})">Concluir</button>
          <button class="btn btn-warning" onclick="editTask(${task.id})">Editar</button>
          <button class="btn btn-danger" onclick="deleteTask(${task.id})">Excluir</button>
        </td>
      `;
      taskList.appendChild(row);
    });
  }
  
  // Função para deletar tarefa
  function deleteTask(id) {
    if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
      fetch(`/tasks/${id}`, {
        method: 'DELETE'
      })
      .then(response => {
        if (response.ok) {
          alert('Tarefa excluída com sucesso!');
          fetchTasks();
        } else {
          alert('Erro ao excluir tarefa');
        }
      })
      .catch(error => console.error('Erro ao excluir tarefa:', error));
    }
  }
  
  // Função para editar tarefa
  function editTask(id) {
    const newTitle = prompt('Novo título:');
    const newDescription = prompt('Nova descrição:');
  
    fetch(`/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title: newTitle, description: newDescription })
    })
    .then(response => {
      if (response.ok) {
        alert('Tarefa editada com sucesso!');
        fetchTasks();
      } else {
        alert('Erro ao editar tarefa');
      }
    })
    .catch(error => console.error('Erro ao editar tarefa:', error));
  }
  