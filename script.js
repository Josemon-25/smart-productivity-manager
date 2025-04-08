// ===== USER SESSION CHECK =====
function checkUser() {
  const username = localStorage.getItem("spmUser");
  if (!username && !location.href.includes("signin.html")) {
    window.location.href = "signin.html";
  }
}
if (!location.href.includes("signin.html")) {
  checkUser();
}

// ===== TASK MANAGER =====
const taskInput = document.getElementById("taskInput");
const dateInput = document.getElementById("taskDate");
const timeInput = document.getElementById("taskTime");
const addTaskBtn = document.getElementById("addTaskBtn");
const pendingTasksContainer = document.getElementById("pendingTasks");
const completedTasksContainer = document.getElementById("completedTasks");
const productivityScore = document.getElementById("productivityScore");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addTask() {
  const name = taskInput.value.trim();
  const date = dateInput.value;
  const time = timeInput.value;

  if (!name || !date || !time) {
    alert("Please fill in all fields.");
    return;
  }

  const task = {
    id: Date.now(),
    name,
    date,
    time,
    completed: false
  };

  tasks.push(task);
  saveTasks();
  renderTasks();

  // Clear inputs
  taskInput.value = "";
  dateInput.value = "";
  timeInput.value = "";
}

function renderTasks() {
  pendingTasksContainer.innerHTML = "";
  completedTasksContainer.innerHTML = "";

  tasks.sort((a, b) => new Date(a.date + 'T' + a.time) - new Date(b.date + 'T' + b.time));

  const now = new Date();

  tasks.forEach(task => {
    const taskEl = document.createElement("div");
    taskEl.classList.add("task-item");

    const taskTime = new Date(task.date + 'T' + task.time);
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

    if (task.completed) {
      completedTasksContainer.appendChild(taskEl);
    } else {
      pendingTasksContainer.appendChild(taskEl);
    }
  });

  updateProductivity();
}

function completeTask(id) {
  const task = tasks.find(t => t.id === id);
  if (task) {
    task.completed = true;
    saveTasks();
    renderTasks();
  }
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  renderTasks();
}

function updateProductivity() {
  const today = new Date().toISOString().split("T")[0];
  const completedToday = tasks.filter(t => t.completed && t.date === today).length;
  if (productivityScore) {
    productivityScore.textContent = `Today’s Productivity: ${completedToday} task(s) completed.`;
  }
}

function notifyUpcomingTasks() {
  const now = new Date();
  tasks.forEach(task => {
    if (!task.completed) {
      const taskTime = new Date(task.date + 'T' + task.time);
      const diff = taskTime - now;
      if (diff > 0 && diff <= 3600000) {
        alert(`Upcoming Task: "${task.name}" at ${task.time}`);
      }
    }
  });
}

if (addTaskBtn) {
  addTaskBtn.addEventListener("click", addTask);
}

window.onload = () => {
  renderTasks();
  notifyUpcomingTasks();
};







    
  
