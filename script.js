// ===== User Sign-In Management =====
function saveUser() {
  const username = document.getElementById("username").value.trim();
  if (username) {
    localStorage.setItem("spm_user", username);
    window.location.href = "index.html";
  } else {
    alert("Please enter your name to sign in.");
  }
}

function checkUser() {
  const username = localStorage.getItem("spm_user");
  if (!username && !window.location.href.includes("signin.html")) {
    window.location.href = "signin.html";
  }
}

if (!window.location.href.includes("signin.html")) {
  checkUser();
}

// ===== Task Manager Logic =====
const taskInput = document.getElementById("taskInput");
const dateInput = document.getElementById("taskDate");
const timeInput = document.getElementById("taskTime");
const addTaskBtn = document.getElementById("addTaskBtn");
const pendingTasksContainer = document.getElementById("pendingTasks");
const completedTasksContainer = document.getElementById("completedTasks");
const productivityScore = document.getElementById("productivityScore");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let completedTasks = JSON.parse(localStorage.getItem("completedTasks")) || [];

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  localStorage.setItem("completedTasks", JSON.stringify(completedTasks));
}

function addTask() {
  const name = taskInput.value.trim();
  const date = dateInput.value;
  const time = timeInput.value;

  if (name && date && time) {
    const newTask = {
      id: Date.now(),
      name,
      date,
      time,
      completed: false
    };
    tasks.push(newTask);
    saveTasks();
    renderTasks();
    taskInput.value = "";
    dateInput.value = "";
    timeInput.value = "";
  } else {
    alert("Please fill in all fields.");
  }
}

function renderTasks() {
  if (pendingTasksContainer) pendingTasksContainer.innerHTML = "";
  if (completedTasksContainer) completedTasksContainer.innerHTML = "";

  tasks.sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`));

  tasks.forEach(task => {
    const taskEl = document.createElement("div");
    taskEl.classList.add("task-item");
    const now = new Date();
    const taskTime = new Date(`${task.date}T${task.time}`);
    const diff = taskTime - now;

    if (task.completed) {
      taskEl.classList.add("completed");
    } else if (diff < 3600000) {
      taskEl.classList.add("urgent");
    } else if (diff < 86400000) {
      taskEl.classList.add("moderate");
    } else {
      taskEl.classList.add("low");
    }

    taskEl.innerHTML = `
      <span>${task.name} - ${task.time} (${task.date})</span>
      <div>
        <button class="complete-btn" onclick="completeTask(${task.id})">✓</button>
        <button class="delete-btn" onclick="deleteTask(${task.id})">🗑</button>
      </div>
    `;

    if (task.completed && completedTasksContainer) {
      completedTasksContainer.appendChild(taskEl);
    } else if (!task.completed && pendingTasksContainer) {
      pendingTasksContainer.appendChild(taskEl);
    }
  });

  updateProductivity();
}

function completeTask(id) {
  const index = tasks.findIndex(t => t.id === id);
  if (index !== -1) {
    tasks[index].completed = true;
    completedTasks.push(tasks[index]);
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
  }
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  completedTasks = completedTasks.filter(t => t.id !== id);
  saveTasks();
  renderTasks();
}

function updateProductivity() {
  const today = new Date().toISOString().split("T")[0];
  const todayTasks = completedTasks.filter(t => t.date === today);
  const score = todayTasks.length;
  if (productivityScore) {
    productivityScore.textContent = `Today’s Productivity: ${score} task(s) completed.`;
  }
}

function notifyUpcomingTasks() {
  const now = new Date();
  const upcoming = tasks.filter(task => {
    const taskTime = new Date(`${task.date}T${task.time}`);
    const timeLeft = taskTime - now;
    return !task.completed && timeLeft > 0 && timeLeft <= 3600000;
  });

  if (upcoming.length > 0) {
    upcoming.forEach(task => {
      alert(`Upcoming Task: "${task.name}" at ${task.time}`);
    });
  }
}

if (addTaskBtn) {
  addTaskBtn.addEventListener("click", addTask);
}

window.onload = function () {
  renderTasks();
  notifyUpcomingTasks();
};


    
  
