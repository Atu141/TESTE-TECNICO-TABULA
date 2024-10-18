document.addEventListener('DOMContentLoaded', function () {
  // Verificar se o formulário existe antes de adicionar o event listener
  const form = document.querySelector('#addTaskForm');
  if (form) {
      form.addEventListener('submit', function (event) {
          event.preventDefault();  // Impede o comportamento padrão do form

          // Selecionar os campos do formulário
          const nomeInput = document.querySelector('#nome');
          const descricaoInput = document.querySelector('#descricao');
          const dataInput = document.querySelector('#data');

          // Verificar se os campos existem
          if (!nomeInput || !dataInput) {
              console.error('Campo "nome" ou "data" não encontrado no formulário');
              return;
          }

          // Criar o objeto da nova tarefa
          const newTask = {
              title: nomeInput.value,
              description: descricaoInput ? descricaoInput.value : '',  // Descrição opcional
              date: dataInput.value,
              completed: false  // Tarefa começa como não concluída
          };

          // Enviar nova tarefa para o servidor via POST
          fetch('/tasks', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify([newTask])  // O backend espera um array de tarefas
          })
          .then(response => {
              if (response.ok) {
                  alert('Tarefa adicionada com sucesso!');
                  // Limpar o formulário e atualizar a lista de tarefas
                  form.reset();
                  fetchTasks();  // Função para buscar e renderizar as tarefas atualizadas
              } else {
                  alert('Erro ao adicionar tarefa');
              }
          })
          .catch(error => {
              console.error('Erro ao salvar tarefa:', error);
          });
      });
  } else {
      console.error('Formulário não encontrado na página');
  }

  // Função para buscar e renderizar as tarefas
  function fetchTasks() {
      fetch('/tasks')
          .then(response => response.json())
          .then(tasks => {
              renderTasks(tasks);
          })
          .catch(error => {
              console.error('Erro ao carregar tarefas:', error);
          });
  }

  // Função para renderizar as tarefas na tabela
  function renderTasks(tasks) {
      const taskList = document.querySelector('#taskList');
      taskList.innerHTML = ''; // Limpar lista antes de renderizar

      tasks.forEach((task, index) => {
          const row = document.createElement('tr');
          row.innerHTML = `
              <td>${index + 1}</td>
              <td>${task.title}</td>
              <td>${task.description || ''}</td>
              <td>${task.date}</td>
              <td>
                  <button class="btn btn-success">Concluir</button>
                  <button class="btn btn-danger">Excluir</button>
              </td>
          `;
          taskList.appendChild(row);
      });
  }

  // Inicializar a lista de tarefas ao carregar a página
  fetchTasks();
});
