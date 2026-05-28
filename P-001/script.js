const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const filterBtns = document.querySelectorAll('.filter-btn');
const totalTasksSpan = document.getElementById('totalTasks');
const completedTasksSpan = document.getElementById('completedTasks');
const pendingTasksSpan = document.getElementById('pendingTasks');

let tasks = [];
let currentFilter = 'all';

function loadTasksFromStorage() {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
    }
    renderTasks();
}

function saveTasksToStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText === '') {
        alert('لطفاً یک وظیفه وارد کنید!');
        return;
    }

    const newTask = {
        id: Date.now(),
        text: taskText,
        completed: false
    };

    tasks.push(newTask);
    taskInput.value = '';
    saveTasksToStorage();
    renderTasks();
}

function deleteTask(taskId) {
    tasks = tasks.filter(task => task.id !== taskId);
    saveTasksToStorage();
    renderTasks();
}

function toggleTaskStatus(taskId) {
    const task = tasks.find(task => task.id === taskId);
    if (task) {
        task.completed = !task.completed;
        saveTasksToStorage();
        renderTasks();
    }
}

function getFilteredTasks() {
    if (currentFilter === 'completed') {
        return tasks.filter(task => task.completed === true);
    } else if (currentFilter === 'pending') {
        return tasks.filter(task => task.completed === false);
    }
    return tasks;
}

function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const pending = total - completed;

    totalTasksSpan.textContent = total;
    completedTasksSpan.textContent = completed;
    pendingTasksSpan.textContent = pending;
}

function renderTasks() {
    taskList.innerHTML = '';

    const filteredTasks = getFilteredTasks();

    if (filteredTasks.length === 0) {
        const emptyMessage = document.createElement('li');
        emptyMessage.textContent = '✨ هیچ وظیفه‌ای وجود ندارد!';
        emptyMessage.style.textAlign = 'center';
        emptyMessage.style.color = '#999';
        emptyMessage.style.padding = '20px';
        taskList.appendChild(emptyMessage);
    } else {
        filteredTasks.forEach(task => {
            const li = document.createElement('li');
            li.className = 'task-item';
            li.style.animation = 'fadeIn 0.3s ease';

            const taskTextSpan = document.createElement('span');
            taskTextSpan.className = 'task-text';
            if (task.completed) {
                taskTextSpan.classList.add('completed');
            }
            taskTextSpan.textContent = task.text;
            taskTextSpan.onclick = () => toggleTaskStatus(task.id);

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = '🗑️ حذف';
            deleteBtn.className = 'delete-btn';
            deleteBtn.onclick = () => deleteTask(task.id);

            li.appendChild(taskTextSpan);
            li.appendChild(deleteBtn);
            taskList.appendChild(li);
        });
    }

    updateStats();
}

function setFilter(filter) {
    currentFilter = filter;
    
    filterBtns.forEach(btn => {
        if (btn.dataset.filter === filter) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    renderTasks();
}

addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        setFilter(btn.dataset.filter);
    });
});

loadTasksFromStorage();