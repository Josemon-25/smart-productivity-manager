// Redirect to signin if no user
document.addEventListener("DOMContentLoaded", () => {
    const user = localStorage.getItem("username");
    const currentPage = window.location.pathname;
  
    if (currentPage.includes("index.html") && !user) {
      window.location.href = "signin.html";
    }
  
    if (document.getElementById("signinForm")) {
      document.getElementById("signinForm").addEventListener("submit", (e) => {
        e.preventDefault();
        const username = document.getElementById("username").value.trim();
        if (username) {
          localStorage.setItem("username", username);
          window.location.href = "index.html";
        }
      });
    }
  });
  // Animations for fade and slide in
document.addEventListener("DOMContentLoaded", function() {
    const elements = document.querySelectorAll(".fade-in, .slide-in, .feature-card");
    elements.forEach((element, index) => {
      setTimeout(() => {
        element.style.opacity = "1";
        element.style.transform = "translateY(0)";
      }, index * 300);
    });
  });
  
  // Sign In System using Local Storage
  function showLogin() {
    document.getElementById("loginPopup").style.display = "block";
  }
  
  function loginUser() {
    const username = document.getElementById("username").value.trim();
    if (username) {
      localStorage.setItem("username", username);
      alert("Welcome, " + username + "!");
      document.getElementById("loginPopup").style.display = "none";
      location.reload();
    }
  }
  
  // Greet user if already signed in
  document.addEventListener("DOMContentLoaded", () => {
    const savedUser = localStorage.getItem("username");
    if (savedUser && document.querySelector(".hero-content")) {
      const hero = document.querySelector(".hero-content h2");
      hero.textContent = `Welcome back, ${savedUser}`;
    }
  });
  
  // Load tasks on page load
  document.addEventListener("DOMContentLoaded", loadTasks);
  
  // Add task
    function addTask() {
        const taskName = document.getElementById('taskName').value;
        const date = document.getElementById('taskDate').value;
        const time = document.getElementById('taskTime').value;
      
        if (!taskName || !date || !time) {
          alert('Please fill in all fields!');
          return;
        }
      
        const task = {
          name: taskName,
          date,
          time,
          completed: false,
          timestamp: new Date(`${date}T${time}`).getTime()
        };
      
        // Save to localStorage
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
      
        // Schedule reminders 👇
        scheduleReminders(taskName, `${date}T${time}`);
      
        // Re-render task list
        renderTasks();
      }
      function removeTask(button) {
    button.parentElement.remove();
    saveTasks();
  }
  
  function completeTask(button) {
    const task = button.parentElement;
    task.classList.add("completed");
    document.getElementById("completedTasks").appendChild(task);
    button.remove();
    updateProductivity();
    saveTasks();
  }
  
  function getPriorityClass(taskDate, taskTime) {
    const now = new Date();
    const taskDeadline = new Date(`${taskDate}T${taskTime}`);
    const diff = (taskDeadline - now) / (1000 * 60 * 60);
    if (diff < 3) return "urgent";
    if (diff < 24) return "moderate";
    return "low";
  }
  
  function saveTasks() {
    const tasks = [];
    document.querySelectorAll("#taskList .task-item").forEach(task => {
      tasks.push({
        text: task.textContent.trim(),
        class: task.className,
        deadline: task.dataset.deadline
      });
    });
  
    const completedTasks = [];
    document.querySelectorAll("#completedTasks .task-item").forEach(task => {
      completedTasks.push(task.textContent.trim());
    });
  
    localStorage.setItem("tasks", JSON.stringify(tasks));
    localStorage.setItem("completedTasks", JSON.stringify(completedTasks));
  }
  
  function loadTasks() {
    const taskList = document.getElementById("taskList");
    const completedTasksList = document.getElementById("completedTasks");
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const completedTasks = JSON.parse(localStorage.getItem("completedTasks")) || [];
  
    tasks.forEach(task => {
      const li = document.createElement("li");
      li.className = task.class;
      li.dataset.deadline = task.deadline;
      li.innerHTML = `
        ${task.text}
        <button class="complete-btn" onclick="completeTask(this)">✔</button>
        <button class="delete-btn" onclick="removeTask(this)">✖</button>
      `;
      taskList.appendChild(li);
      scheduleReminders(task.text, task.deadline);
    });
  
    completedTasks.forEach(taskText => {
      const li = document.createElement("li");
      li.className = "task-item completed";
      li.textContent = taskText;
      completedTasksList.appendChild(li);
    });
  
    updateProductivity();
  }
  
  function updateProductivity() {
    const completedTasks = document.querySelectorAll("#completedTasks .task-item").length;
    const score = Math.min(completedTasks * 2, 10);
    const display = document.getElementById("productivityScore");
    if (display) display.textContent = score;
  }
  
  function scheduleReminders(taskName, deadlineStr) {
    const deadline = new Date(deadlineStr);
    const now = new Date();
  
    const reminders = [
      { time: 60 * 60 * 1000, msg: `Reminder: "${taskName}" is due in 1 hour!` },
      { time: 30 * 60 * 1000, msg: `Reminder: "${taskName}" is due in 30 minutes!` },
      { time: 10 * 60 * 1000, msg: `Reminder: "${taskName}" is due in 10 minutes!` }
    ];
  
    reminders.forEach(reminder => {
      const reminderTime = deadline.getTime() - reminder.time;
      const delay = reminderTime - now.getTime();
  
      if (delay > 0) {
        setTimeout(() => {
          alert(reminder.msg);
        }, delay);
      }
    });
  }
  // Contact Form Save to Local Storage
document.addEventListener("DOMContentLoaded", () => {
    const contactForm = document.getElementById("contactForm");
    const successMessage = document.getElementById("contactSuccess");
  
    if (contactForm) {
      contactForm.addEventListener("submit", function (e) {
        e.preventDefault();
  
        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const message = document.getElementById("message").value.trim();
  
        if (name && email && message) {
          const contactData = { name, email, message, time: new Date().toISOString() };
  
          // Save messages array in localStorage
          const existing = JSON.parse(localStorage.getItem("contactMessages")) || [];
          existing.push(contactData);
          localStorage.setItem("contactMessages", JSON.stringify(existing));
  
          contactForm.reset();
          successMessage.style.display = "block";
          setTimeout(() => (successMessage.style.display = "none"), 3000);
        }
      });
    }
  });
  // Show username on homepage
const greetingEl = document.getElementById("userGreeting");
const username = localStorage.getItem("username");

if (greetingEl && username) {
  greetingEl.innerHTML = `<h2>Welcome back, <span style="color: #ffeb3b">${username}</span>!</h2>`;
}
function signOut() {
    localStorage.removeItem("username");
    window.location.href = "signin.html";
  }
  function scheduleReminders(taskName, dueDateTime) {
    const now = new Date().getTime();
    const taskTime = new Date(dueDateTime).getTime();
  
    const timeDiff = taskTime - now;
    if (timeDiff <= 0) return; // Task already due
  
    const reminders = [
      { offset: 60 * 60 * 1000, label: "1 hour" },        // 1 hour before
      { offset: 30 * 60 * 1000, label: "30 minutes" },    // 30 min before
      { offset: 5 * 60 * 1000, label: "5 minutes" },      // 5 min before
    ];
  
    reminders.forEach(reminder => {
      const reminderTime = taskTime - reminder.offset;
      const timeout = reminderTime - now;
  
      if (timeout > 0) {
        setTimeout(() => {
          alert(`🔔 Reminder: "${taskName}" is due in ${reminder.label}!`);
        }, timeout);
      }
    });
  }
    
  