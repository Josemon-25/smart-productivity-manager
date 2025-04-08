// script.js

document.addEventListener("DOMContentLoaded", function () {
  const addTaskBtn = document.getElementById("addTaskBtn");
  const taskInput = document.getElementById("taskInput");
  const taskDate = document.getElementById("taskDate");
  const taskTime = document.getElementById("taskTime");
  const pendingTasksDiv = document.getElementById("pendingTasks");

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  function renderTasks() {
    pendingTasksDiv.innerHTML = "";

    tasks.forEach((task, index) => {
      if (!task.completed) {
        const taskDiv = document.createElement("div");
        taskDiv.className = "task-item";
        taskDiv.innerHTML = `
          ${task.name} - ${task.date} ${task.time}
          <button class="complete-btn" data-index="${index}">✓</button>
          <button class="delete-btn" data-index="${index}">🗑</button>
        `;
        pendingTasksDiv.appendChild(taskDiv);
      }
    });

    document.querySelectorAll(".complete-btn").forEach(btn => {
      btn.addEventListener("click", function () {
        const index = this.getAttribute("data-index");
        completeTask(index);
      });
    });

    document.querySelectorAll(".delete-btn").forEach(btn => {
      btn.addEventListener("click", function () {
        const index = this.getAttribute("data-index");
        deleteTask(index);
      });
    });
  }

  function addTask() {
    const name = taskInput.value.trim();
    const date = taskDate.value;
    const time = taskTime.value;

    if (!name || !date || !time) {
      alert("Please fill all fields.");
      return;
    }

    tasks.push({ name, date, time, completed: false });
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks();

    taskInput.value = "";
    taskDate.value = "";
    taskTime.value = "";
  }

  function completeTask(index) {
    tasks[index].completed = true;
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks();
  }

  function deleteTask(index) {
    tasks.splice(index, 1);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks();
  }

  addTaskBtn.addEventListener("click", addTask);

  renderTasks();
});
