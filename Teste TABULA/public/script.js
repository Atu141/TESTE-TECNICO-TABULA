document.addEventListener('DOMContentLoaded', function () {
  // Função para buscar e renderizar as tarefas
  const fetchTasks = () => {
      fetch('/tasks')
          .then(response => response.json())
          .then(tasks => renderTasks(tasks))
          .catch(error => console.error('Erro ao buscar tarefas:', error));
  };

  // Função para renderizar tarefas no DOM
  const renderTasks = (tasks) => {
      const taskList = document.querySelector('#taskList');
      taskList.innerHTML = '';

      // Ordenar as tarefas (pendentes primeiro)
      tasks.sort((a, b) => a.completed - b.completed);

      tasks.forEach((task, index) => {
          const taskRow = `
              <tr>
                  <td>${index + 1}</td>
                  <td>${task.title}</td>
                  <td>${task.description}</td>
                  <td>${task.date}</td>
                  <td>${task.completed ? 'Concluída' : 'Pendente'}</td>
                  <td>
                      <button class="btn btn-success btn-sm" onclick="toggleComplete(${task.id})">${task.completed ? 'Desmarcar' : 'Concluir'}</button>
                      <button class="btn btn-warning btn-sm" onclick="editTask(${task.id})">Editar</button>
                      <button class="btn btn-danger btn-sm" onclick="deleteTask(${task.id})">Excluir</button>
                  </td>
              </tr>
          `;
          taskList.insertAdjacentHTML('beforeend', taskRow);
      });
  };

  // Função para adicionar tarefa
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
          body: JSON.stringify([newTask]) // Backend espera um array
      })
      .then(response => {
          if (response.ok) {
              alert('Tarefa adicionada com sucesso!');
              fetchTasks();
          } else {
              alert('Erro ao adicionar tarefa');
          }
      })
      .catch(error => console.error('Erro ao salvar tarefa:', error));
  });

  // Função para deletar tarefa
  const deleteTask = (id) => {
      fetch(`/tasks/${id}`, {
          method: 'DELETE'
      })
      .then(response => {
          if (response.ok) {
              fetchTasks();
          } else {
              alert('Erro ao deletar tarefa');
          }
      })
      .catch(error => console.error('Erro ao excluir tarefa:', error));
  };

  // Função para editar tarefa
  const editTask = (id) => {
      const newTitle = prompt('Novo título da tarefa:');
      const newDescription = prompt('Nova descrição da tarefa:');
      const newDate = prompt('Nova data da tarefa (YYYY-MM-DD):');

      fetch(`/tasks/${id}`, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ title: newTitle, description: newDescription, date: newDate })
      })
      .then(response => {
          if (response.ok) {
              fetchTasks();
          } else {
              alert('Erro ao editar tarefa');
          }
      })
      .catch(error => console.error('Erro ao editar tarefa:', error));
  };

  // Função para marcar como concluído ou desmarcar
  const toggleComplete = (id) => {
      fetch(`/tasks/${id}`)
          .then(response => response.json())
          .then(task => {
              task.completed = !task.completed;
              return fetch(`/tasks/${id}`, {
                  method: 'PUT',
                  headers: {
                      'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(task)
              });
          })
          .then(response => {
              if (response.ok) {
                  fetchTasks();
              }
          })
          .catch(error => console.error('Erro ao atualizar status da tarefa:', error));
  };

  // Função de busca
  document.querySelector('#searchTaskInput').addEventListener('input', function () {
      const searchTerm = this.value.toLowerCase();
      fetch('/tasks')
          .then(response => response.json())
          .then(tasks => {
              const filteredTasks = tasks.filter(task => task.title.toLowerCase().includes(searchTerm));
              renderTasks(filteredTasks);
          })
          .catch(error => console.error('Erro ao buscar tarefas:', error));
  });

  // Inicializar com as tarefas
  fetchTasks();
});
