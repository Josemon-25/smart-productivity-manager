// script.js - Smart Productivity Manager

// ===== User Sign-In Check =====
window.addEventListener("DOMContentLoaded", () => {
  const currentPage = window.location.pathname.split("/").pop();
  const user = localStorage.getItem("spmUser");

  if (!user && currentPage !== "signin.html") {
    window.location.href = "signin.html";
  } else if (user && currentPage === "signin.html") {
    window.location.href = "task_manager.html";
  }

  if (document.getElementById("taskName")) {
    renderTasks();
    notifyUpcomingTasks();
  }
});

// ===== Task Variables =====
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// ===== Save Tasks =====
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// ===== Add Task =====
function addTask() {
  const nameInput = document.getElementById("taskName");
  const dateInput = document.getElementById("taskDate");
  const timeInput = document.getElementById("taskTime");

  const name = nameInput.value.trim();
  const date = dateInput.value;
  const time = timeInput.value;

  if (!name || !date || !time) {
    alert("Please fill in all fields.");
    return;
  }

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

  nameInput.value = "";
  dateInput.value = "";
  timeInput.value = "";
}

// ===== Render Tasks =====
function renderTasks() {
  const pendingList = document.getElementById("pendingList");
  const completedList = document.getElementById("completedList");
  const productivityScore = document.getElementById("productivityScore");

  if (!pendingList || !completedList) return;

  pendingList.innerHTML = "";
  completedList.innerHTML = "";

  const sortedTasks = [...tasks].sort((a, b) => {
    return new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`);
  });

  let completedToday = 0;
  const today = new Date().toISOString().split("T")[0];

  sortedTasks.forEach(task => {
    const taskBox = document.createElement("div");
    taskBox.className = "task-item";

    const now = new Date();
    const taskTime = new Date(`${task.date}T${task.time}`);
    const diff = taskTime - now;

    if (task.completed) {
      taskBox.classList.add("completed");
    } else if (diff < 3600000) {
      taskBox.classList.add("urgent");
    } else if (diff < 86400000) {
      taskBox.classList.add("moderate");
    } else {
      taskBox.classList.add("low");
    }

    taskBox.innerHTML = `
      <span>${task.name} - ${task.time} (${task.date})</span>
      <div>
        <button class="complete-btn" onclick="completeTask(${task.id})">✓</button>
        <button class="delete-btn" onclick="deleteTask(${task.id})">🗑</button>
      </div>
    `;

    if (task.completed) {
      completedList.appendChild(taskBox);
      if (task.date === today) completedToday++;
    } else {
      pendingList.appendChild(taskBox);
    }
  });

  if (productivityScore) {
    productivityScore.textContent = `Today’s Productivity: ${completedToday} task(s) completed.`;
  }
}

// ===== Complete Task =====
function completeTask(id) {
  const index = tasks.findIndex(t => t.id === id);
  if (index !== -1) {
    tasks[index].completed = true;
    saveTasks();
    renderTasks();
  }
}

// ===== Delete Task =====
function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  renderTasks();
}

// ===== Notification for Upcoming Tasks =====
function notifyUpcomingTasks() {
  const now = new Date();
  tasks.forEach(task => {
    if (task.completed) return;
    const taskTime = new Date(`${task.date}T${task.time}`);
    const timeLeft = taskTime - now;
    if (timeLeft > 0 && timeLeft <= 3600000) {
      alert(`Upcoming Task: "${task.name}" at ${task.time}`);
    }
  });
}





    
  
