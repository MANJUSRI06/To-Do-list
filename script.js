document.addEventListener('DOMContentLoaded', function() {
  const toggleBtn = document.getElementById('columnToggleBtn');
  const mobileList = document.getElementById('mobileColumnList');
  const closeBtn = mobileList ? mobileList.querySelector('.close-mobile-list') : null;
  const colBtns = mobileList ? mobileList.querySelectorAll('.mobile-col-btn') : [];
  const columns = document.querySelectorAll('.task-column');
  const logoutBtn = document.getElementById('logoutBtn');
  const mobileLogoutBtn = document.getElementById('mobileLogoutBtn');

  function showMobileList() {
    // Hide all columns when opening the mobile menu
    columns.forEach(col => {
      col.classList.remove('active');
      col.style.display = 'none';
    });
    mobileList.style.display = 'flex';
    mobileList.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    // Hide quote rotator
    const quoteRotatorBg = document.querySelector('.quote-rotator-bg');
    if (quoteRotatorBg) quoteRotatorBg.style.display = 'none';
    // Hide main header (logo, title, logout)
    const mainHeader = document.querySelector('.main-header');
    if (mainHeader) mainHeader.style.display = 'none';
  }
  function hideMobileList() {
    mobileList.style.display = 'none';
    mobileList.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    // Show quote rotator
    const quoteRotatorBg = document.querySelector('.quote-rotator-bg');
    if (quoteRotatorBg) quoteRotatorBg.style.display = '';
    // Show main header (logo, title, logout)
    const mainHeader = document.querySelector('.main-header');
    if (mainHeader) mainHeader.style.display = '';
  }
  function showColumn(idx) {
    if (window.matchMedia('(max-width: 700px)').matches) {
      columns.forEach((col, i) => {
        if (i === idx) {
          col.classList.add('active');
          col.style.display = 'flex';
        } else {
          col.classList.remove('active');
          col.style.display = 'none';
        }
      });
      hideMobileList();
    } else {
      columns.forEach(col => {
        col.classList.remove('active');
        col.style.display = '';
      });
    }
  }
  function updateToggleBtnVisibility() {
    const isMobile = window.matchMedia('(max-width: 700px)').matches;
    if (isMobile) {
      toggleBtn.style.display = 'flex';
      if (![...columns].some(col => col.classList.contains('active'))) {
        showColumn(0);
      }
    } else {
      toggleBtn.style.display = 'none';
      columns.forEach(col => {
        col.classList.remove('active');
        col.style.display = '';
      });
      hideMobileList();
    }
  }
  // Logout logic
  function doLogout() {
    document.body.innerHTML = `<div style='display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;'><span class='logo' style='font-size:2.5rem;'>📝</span><h2 style='color:var(--primary);margin:18px 0 0 0;'>Logged out!</h2><div style='margin-top:18px;color:var(--text-light);font-size:1.1rem;'>Redirecting to login...</div></div>`;
    setTimeout(()=>{ window.location.href = 'login.html'; }, 1200);
  }
  if (logoutBtn) logoutBtn.onclick = doLogout;
  if (mobileLogoutBtn) mobileLogoutBtn.onclick = doLogout;
  // Show/hide logout only when menu is open on mobile
  function updateMobileLogoutVisibility(show) {
    if (!logoutBtn) return;
    if (window.matchMedia('(max-width: 700px)').matches) {
      if (show) {
        logoutBtn.classList.add('show-logout');
        logoutBtn.style.display = 'flex';
      } else {
        logoutBtn.classList.remove('show-logout');
        logoutBtn.style.display = 'none';
      }
    } else {
      logoutBtn.classList.remove('show-logout');
      logoutBtn.style.display = 'flex';
    }
  }
  if (toggleBtn && mobileList) {
    toggleBtn.addEventListener('click', () => {
      // Only work on mobile view
      if (window.matchMedia('(max-width: 700px)').matches) {
        showMobileList();
        updateMobileLogoutVisibility(true);
      }
    });
    if (closeBtn) closeBtn.addEventListener('click', () => {
      hideMobileList();
      updateMobileLogoutVisibility(false);
    });
    colBtns.forEach((btn, idx) => {
      btn.addEventListener('click', () => {
        showColumn(idx);
        updateMobileLogoutVisibility(false);
        // Show quote rotator and main header when menu is closed
        const quoteRotatorBg = document.querySelector('.quote-rotator-bg');
        if (quoteRotatorBg) quoteRotatorBg.style.display = '';
        const mainHeader = document.querySelector('.main-header');
        if (mainHeader) mainHeader.style.display = '';
      });
    });
    // Hide logout on resize/orientationchange
    window.addEventListener('resize', () => {
      if (!window.matchMedia('(max-width: 700px)').matches) {
        updateMobileLogoutVisibility(false);
      }
      updateToggleBtnVisibility();
      // Show quote rotator and main header on desktop
      const quoteRotatorBg = document.querySelector('.quote-rotator-bg');
      if (quoteRotatorBg) quoteRotatorBg.style.display = '';
      const mainHeader = document.querySelector('.main-header');
      if (mainHeader) mainHeader.style.display = '';
    });
    window.addEventListener('orientationchange', () => {
      if (!window.matchMedia('(max-width: 700px)').matches) {
        updateMobileLogoutVisibility(false);
      }
      updateToggleBtnVisibility();
      // Show quote rotator and main header on desktop
      const quoteRotatorBg = document.querySelector('.quote-rotator-bg');
      if (quoteRotatorBg) quoteRotatorBg.style.display = '';
      const mainHeader = document.querySelector('.main-header');
      if (mainHeader) mainHeader.style.display = '';
    });
    // Hide logout by default on mobile
    updateMobileLogoutVisibility(false);
    updateToggleBtnVisibility();
  }
});
function addTask() {
  // Edit icon (pencil for Add Task)
  const editIcon = document.createElement("span");
  editIcon.className = "icon edit";
  editIcon.title = "Edit task";
  editIcon.textContent = "✏️";
  editIcon.onclick = function (e) {
    e.stopPropagation();
    const newText = prompt("Edit your task:", taskSpan.textContent);
    if (newText !== null && newText.trim() !== "") {
      taskSpan.textContent = newText.trim();
    }
  };
  const input = document.getElementById("taskInput");
  const taskText = input.value.trim();
  if (taskText === "") {
    alert("Please enter a task!");
    return;
  }
  const li = document.createElement("li");

  // Get the current number for this task
  const taskList = document.getElementById("taskList");
  const taskNumber = taskList.children.length + 1;

  // Numbered label
  const numberSpan = document.createElement("span");
  numberSpan.textContent = taskNumber + ". ";
  numberSpan.style.fontWeight = "bold";
  numberSpan.style.marginRight = "6px";

  // Task text
  const taskSpan = document.createElement("span");
  taskSpan.textContent = taskText;
  taskSpan.style.flex = "1";

  // Icons container (right side)
  const iconsDiv = document.createElement("span");
  iconsDiv.style.display = "flex";
  iconsDiv.style.gap = "8px";
  iconsDiv.style.alignItems = "center";

  // Progress icon (clock)
  const progressIcon = document.createElement("span");
  progressIcon.className = "icon progress";
  progressIcon.title = "Move to progress";
  progressIcon.textContent = "⏳";
  progressIcon.onclick = function (e) {
    e.stopPropagation();
    copyToProgress(taskText);
    progressIcon.style.pointerEvents = 'none';
    completeIcon.style.pointerEvents = 'none';
    progressIcon.style.opacity = '0.5';
    completeIcon.style.opacity = '0.5';
  };

  // Complete icon (tick)
  const completeIcon = document.createElement("span");
  completeIcon.className = "icon complete";
  completeIcon.title = "Mark as completed";
  completeIcon.textContent = "✅";
  completeIcon.onclick = function (e) {
    e.stopPropagation();
    copyToCompleted(taskText);
    progressIcon.style.pointerEvents = 'none';
    completeIcon.style.pointerEvents = 'none';
    progressIcon.style.opacity = '0.5';
    completeIcon.style.opacity = '0.5';
  };

  // Delete icon (cross)
  const deleteIcon = document.createElement("span");
  deleteIcon.className = "icon delete";
  deleteIcon.title = "Delete task";
  deleteIcon.textContent = "🗑️";
  deleteIcon.onclick = function (e) {
    e.stopPropagation();
    li.remove();
    // Renumber remaining tasks
    Array.from(taskList.children).forEach((item, idx) => {
      const num = item.querySelector('.task-number');
      if (num) num.textContent = (idx + 1) + ". ";
    });
  };

  numberSpan.className = "task-number";
  li.appendChild(numberSpan);
  li.appendChild(taskSpan);
  iconsDiv.appendChild(editIcon);
  iconsDiv.appendChild(progressIcon);
  iconsDiv.appendChild(completeIcon);
  iconsDiv.appendChild(deleteIcon);
  li.appendChild(iconsDiv);

  taskList.appendChild(li);
  input.value = "";
}

function copyToProgress(text) {
  const progressLi = document.createElement("li");

  // Get the current number for this task
  const progressList = document.getElementById("progressList");
  const taskNumber = progressList.children.length + 1;

  // Numbered label
  const numberSpan = document.createElement("span");
  numberSpan.textContent = taskNumber + ". ";
  numberSpan.style.fontWeight = "bold";
  numberSpan.style.marginRight = "6px";
  numberSpan.className = "task-number";

  // Task text
  const taskSpan = document.createElement("span");
  taskSpan.textContent = text;
  taskSpan.style.flex = "1";

  // Icons container (right side)
  const iconsDiv = document.createElement("span");
  iconsDiv.style.display = "flex";
  iconsDiv.style.gap = "8px";
  iconsDiv.style.alignItems = "center";

  // Edit icon (pencil for Progress)
  const editIcon = document.createElement("span");
  editIcon.className = "icon edit";
  editIcon.title = "Edit task";
  editIcon.textContent = "✏️";
  editIcon.onclick = function (e) {
    e.stopPropagation();
    const newText = prompt("Edit your task:", taskSpan.textContent);
    if (newText !== null && newText.trim() !== "") {
      taskSpan.textContent = newText.trim();
    }
  };

  // Progress icon (clock)
  const progressIcon = document.createElement("span");
  progressIcon.className = "icon progress";
  progressIcon.title = "Move to progress";
  progressIcon.textContent = "⏳";
  progressIcon.style.opacity = '0.5';
  progressIcon.style.pointerEvents = 'none';

  // Complete icon (tick)
  const completeIcon = document.createElement("span");
  completeIcon.className = "icon complete";
  completeIcon.title = "Mark as completed";
  completeIcon.textContent = "✅";
  completeIcon.onclick = function (e) {
    e.stopPropagation();
    copyToCompleted(text);
    progressLi.remove();
  };

  // Delete icon (cross)
  const deleteIcon = document.createElement("span");
  deleteIcon.className = "icon delete";
  deleteIcon.title = "Delete task";
  deleteIcon.textContent = "🗑️";
  deleteIcon.onclick = function (e) {
    e.stopPropagation();
    progressLi.remove();
    // Renumber remaining tasks
    Array.from(progressList.children).forEach((item, idx) => {
      const num = item.querySelector('.task-number');
      if (num) num.textContent = (idx + 1) + ". ";
    });
  };

  progressLi.appendChild(numberSpan);
  progressLi.appendChild(taskSpan);
  iconsDiv.appendChild(editIcon);
  iconsDiv.appendChild(progressIcon);
  iconsDiv.appendChild(completeIcon);
  iconsDiv.appendChild(deleteIcon);
  progressLi.appendChild(iconsDiv);

  progressList.appendChild(progressLi);
}

function copyToCompleted(text) {
  const completedLi = document.createElement("li");
  completedLi.classList.add("completed");

  // Get the current number for this task
  const completedList = document.getElementById("completedList");
  const taskNumber = completedList.children.length + 1;

  // Numbered label
  const numberSpan = document.createElement("span");
  numberSpan.textContent = taskNumber + ". ";
  numberSpan.style.fontWeight = "bold";
  numberSpan.style.marginRight = "6px";
  numberSpan.className = "task-number";

  // Task text
  const taskSpan = document.createElement("span");
  taskSpan.textContent = text;
  taskSpan.style.flex = "1";

  // Icons container (right side)
  const iconsDiv = document.createElement("span");
  iconsDiv.style.display = "flex";
  iconsDiv.style.gap = "8px";
  iconsDiv.style.alignItems = "center";

  // Progress icon (clock)
  const progressIcon = document.createElement("span");
  progressIcon.className = "icon progress";
  progressIcon.title = "Move to progress";
  progressIcon.textContent = "⏳";
  progressIcon.style.opacity = '0.5';
  progressIcon.style.pointerEvents = 'none';

  // Complete icon (tick)
  const completeIcon = document.createElement("span");
  completeIcon.className = "icon complete";
  completeIcon.title = "Mark as completed";
  completeIcon.textContent = "✅";
  completeIcon.style.opacity = '0.5';
  completeIcon.style.pointerEvents = 'none';

  // Delete icon (cross)
  const deleteIcon = document.createElement("span");
  deleteIcon.className = "icon delete";
  deleteIcon.title = "Delete task";
  deleteIcon.textContent = "🗑️";
  deleteIcon.onclick = function (e) {
    e.stopPropagation();
    completedLi.remove();
    // Renumber remaining tasks
    Array.from(completedList.children).forEach((item, idx) => {
      const num = item.querySelector('.task-number');
      if (num) num.textContent = (idx + 1) + ". ";
    });
  };

  completedLi.appendChild(numberSpan);
  completedLi.appendChild(taskSpan);
  iconsDiv.appendChild(progressIcon);
  iconsDiv.appendChild(completeIcon);
  iconsDiv.appendChild(deleteIcon);
  completedLi.appendChild(iconsDiv);

  completedList.appendChild(completedLi);
}

function moveToProgress(li, text) {
  li.remove();
  const progressLi = document.createElement("li");

  // Complete icon (move to completed)
  const completeIcon = document.createElement("span");
  completeIcon.className = "icon complete";
  completeIcon.textContent = "✔️";
  completeIcon.title = "Mark as completed";
  completeIcon.onclick = function (e) {
    e.stopPropagation();
    moveToCompleted(progressLi, text);
  };

  // Task text
  const taskSpan = document.createElement("span");
  taskSpan.textContent = text;
  taskSpan.style.flex = "1";

  // Edit icon (allow editing in progress)
  const editIcon = document.createElement("span");
  editIcon.className = "icon edit";
  editIcon.textContent = "✏️";
  editIcon.title = "Edit task";
  editIcon.onclick = function (e) {
    e.stopPropagation();
    const newText = prompt("Edit your task:", taskSpan.textContent);
    if (newText !== null && newText.trim() !== "") {
      taskSpan.textContent = newText.trim();
    }
  };

  // Delete icon
  const deleteIcon = document.createElement("span");
  deleteIcon.className = "icon delete";
  deleteIcon.textContent = "✖️";
  deleteIcon.title = "Delete task";
  deleteIcon.onclick = function (e) {
    e.stopPropagation();
    progressLi.remove();
  };

  progressLi.appendChild(completeIcon);
  progressLi.appendChild(taskSpan);
  progressLi.appendChild(editIcon);
  progressLi.appendChild(deleteIcon);

  document.getElementById("progressList").appendChild(progressLi);
}

function moveToCompleted(li, text) {
  li.remove();
  const completedLi = document.createElement("li");
  completedLi.classList.add("completed");

  // Task text
  const taskSpan = document.createElement("span");
  taskSpan.textContent = text;
  taskSpan.style.flex = "1";

  // Delete icon
  const deleteIcon = document.createElement("span");
  deleteIcon.className = "icon delete";
  deleteIcon.textContent = "✖️";
  deleteIcon.title = "Delete task";
  deleteIcon.onclick = function (e) {
    e.stopPropagation();
    completedLi.remove();
  };

  completedLi.appendChild(taskSpan);
  completedLi.appendChild(deleteIcon);

  document.getElementById("completedList").appendChild(completedLi);
}

// Fade out animation for removing tasks
const style = document.createElement('style');
style.innerHTML = `
@keyframes fadeOut {
  from { opacity: 1; transform: scale(1); }
  to { opacity: 0; transform: scale(0.95) translateY(20px); }
}`;
document.head.appendChild(style);
