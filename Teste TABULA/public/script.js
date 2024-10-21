document.addEventListener('DOMContentLoaded', loadTasks);

const taskForm = document.getElementById('task-form');
const taskList = document.getElementById('task-list');
const searchInput = document.getElementById('search');

taskForm.addEventListener('submit', addTask);
searchInput.addEventListener('input', searchTasks);

function loadTasks() {
    const tasks = getTasksFromStorage();
    renderTasks(tasks);
}

function addTask(e) {
    e.preventDefault();
    const titulo = document.getElementById('titulo').value;
    const descricao = document.getElementById('descricao').value;

    const task = {
        id: Date.now(),
        titulo,
        descricao,
        concluida: false
    };

    addTaskToStorage(task);
    addTaskToDOM(task, true); // Adiciona a nova tarefa no topo
    taskForm.reset();
}

function addTaskToDOM(task, isNew = false) {
    const li = document.createElement('li');
    li.className = 'list-group-item';
    li.innerHTML = `
        <strong>${task.titulo}</strong>
        <p>${task.descricao}</p>
        <button class="btn btn-success btn-sm" onclick="toggleConcluded(${task.id})">
            ${task.concluida ? 'Desmarcar' : 'Concluir'}
        </button>
        <button class="btn btn-warning btn-sm" onclick="editTask(${task.id})">Editar</button>
        <button class="btn btn-danger btn-sm" onclick="deleteTask(${task.id})">Deletar</button>
    `;
    if (task.concluida) {
        li.classList.add('list-group-item-success');
    }
    
    if (isNew) {
        taskList.prepend(li); // Adiciona a nova tarefa no topo
    } else {
        taskList.appendChild(li); // Para tarefas carregadas inicialmente
    }
}

function toggleConcluded(id) {
    let tasks = getTasksFromStorage();
    tasks = tasks.map(task => {
        if (task.id === id) {
            task.concluida = !task.concluida;
        }
        return task;
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks(tasks);
}

function editTask(id) {
    let tasks = getTasksFromStorage();
    const task = tasks.find(task => task.id === id);
    document.getElementById('titulo').value = task.titulo;
    document.getElementById('descricao').value = task.descricao;

    deleteTask(id); // Remove the task so we can re-add it after editing
}

function deleteTask(id) {
    let tasks = getTasksFromStorage();
    tasks = tasks.filter(task => task.id !== id);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks(tasks);
}

function searchTasks() {
    const query = searchInput.value.toLowerCase();
    const tasks = getTasksFromStorage();
    const filteredTasks = tasks.filter(task => task.titulo.toLowerCase().includes(query));
    renderTasks(filteredTasks);
}

function renderTasks(tasks) {
    // Ordena as tarefas: não concluídas primeiro
    tasks.sort((a, b) => a.concluida - b.concluida);

    taskList.innerHTML = '';
    tasks.forEach(task => addTaskToDOM(task));
}

function addTaskToStorage(task) {
    const tasks = getTasksFromStorage();
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function getTasksFromStorage() {
    const tasks = localStorage.getItem('tasks');
    return tasks ? JSON.parse(tasks) : [];
}
