// --- Mobile Toggle Button & Mobile Menu Logic ---
document.addEventListener('DOMContentLoaded', function() {
  const toggleBtn = document.getElementById('columnToggleBtn');
  const mobileList = document.getElementById('mobileColumnList');
  const closeBtn = mobileList ? mobileList.querySelector('.close-mobile-list') : null;
  const colBtns = mobileList ? mobileList.querySelectorAll('.mobile-col-btn') : [];
  const columns = document.querySelectorAll('.task-column');
  // Show mobile menu
  function showMobileList() {
    columns.forEach(col => {
      col.classList.remove('active');
      col.style.display = 'none';
    });
    if (mobileList) mobileList.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    const quoteRotatorBg = document.querySelector('.quote-rotator-bg');
    if (quoteRotatorBg) quoteRotatorBg.style.display = 'none';
    const mainHeader = document.querySelector('.main-header');
    if (mainHeader) mainHeader.style.display = 'none';
  }
  // Hide mobile menu
  function hideMobileList() {
    if (mobileList) mobileList.style.display = 'none';
    document.body.style.overflow = '';
    const quoteRotatorBg = document.querySelector('.quote-rotator-bg');
    if (quoteRotatorBg) quoteRotatorBg.style.display = '';
    const mainHeader = document.querySelector('.main-header');
    if (mainHeader) mainHeader.style.display = '';
  }
  // Show a column by index (for mobile)
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
  // Toggle button click
  if (toggleBtn && mobileList) {
    toggleBtn.addEventListener('click', () => {
      if (window.matchMedia('(max-width: 700px)').matches) {
        showMobileList();
      }
    });
    if (closeBtn) closeBtn.addEventListener('click', hideMobileList);
    colBtns.forEach((btn, idx) => {
      btn.addEventListener('click', () => showColumn(idx));
    });
    // Responsive: hide menu on resize to desktop
    window.addEventListener('resize', () => {
      if (!window.matchMedia('(max-width: 700px)').matches) {
        hideMobileList();
        columns.forEach(col => {
          col.classList.remove('active');
          col.style.display = '';
        });
      }
    });
  }
});
// Logout button logic: redirect to login page
document.addEventListener('DOMContentLoaded', function() {
  const logoutBtn = document.getElementById('logoutBtn');
  const mobileLogoutBtn = document.getElementById('mobileLogoutBtn');
  function doLogout() {
    window.location.href = 'index.html';
  }
  if (logoutBtn) logoutBtn.onclick = doLogout;
  if (mobileLogoutBtn) mobileLogoutBtn.onclick = doLogout;
});
// Create an icon element with optional click behavior and disabled state
function createIcon(type, title, text, onClick, disabled = false) {
  const icon = document.createElement("span");
  icon.className = `icon ${type}`;
  icon.title = title;
  icon.textContent = text;

  if (!disabled) {
    icon.onclick = e => {
      e.stopPropagation();
      onClick();
    };
  } else {
    icon.style.pointerEvents = 'none';
    icon.style.opacity = '0.5';
  }

  return icon;
}

// Renumber tasks in a given list (used after deletion)
function renumberTasks(list) {
  [...list.children].forEach((item, idx) => {
    const num = item.querySelector('.task-number');
    if (num) num.textContent = `${idx + 1}. `;
  });
}

// Create a task item and append it to the given list
function createTaskItem(text, listId, action = null) {
  const list = document.getElementById(listId);
  const li = document.createElement("li");

  const numberSpan = document.createElement("span");
  numberSpan.className = "task-number";
  numberSpan.textContent = `${list.children.length + 1}. `;
  numberSpan.style.fontWeight = "bold";
  numberSpan.style.marginRight = "6px";
//Task Description
  const taskSpan = document.createElement("span");
  taskSpan.textContent = text;
  taskSpan.style.flex = "1";
//Icons container
  const iconsDiv = document.createElement("span");
  iconsDiv.style.display = "flex";
  iconsDiv.style.gap = "8px";
  iconsDiv.style.alignItems = "center";

  // Icons
  const editIcon = createIcon("edit", "Edit task", "✏️", () => {
    const newText = prompt("Edit your task:", taskSpan.textContent);
    if (newText?.trim()) taskSpan.textContent = newText.trim();
  });

  const progressIcon = createIcon("progress", "Move to progress", "⏳", () => {
    if (action === 'toProgress') {
      copyToProgress(taskSpan.textContent);
      disableIcons(progressIcon, completeIcon);
    }
  }, action === 'toCompleted');

  const completeIcon = createIcon("complete", "Mark as completed", "✅", () => {
    if (action === 'toProgress' || action === 'toCompleted') {
      copyToCompleted(taskSpan.textContent);
      li.remove();
      renumberTasks(list);
    }
  });

  const deleteIcon = createIcon("delete", "Delete task", "🗑️", () => {
    li.remove();
    renumberTasks(list);
  });

  // Disable icons after moving
  function disableIcons(...icons) {
    icons.forEach(icon => {
      icon.style.pointerEvents = 'none';
      icon.style.opacity = '0.5';
    });
  }

  // Append icons
  [editIcon, progressIcon, completeIcon, deleteIcon].forEach(icon => iconsDiv.appendChild(icon));

  li.append(numberSpan, taskSpan, iconsDiv);
  if (listId === "completedList") li.classList.add("completed");
  list.appendChild(li);
}

// Add a new task to the "taskList"
function addTask() {
  const input = document.getElementById("taskInput");
  const taskText = input.value.trim();
  if (!taskText) return alert("Please enter a task!");
  createTaskItem(taskText, "taskList", 'toProgress');
  input.value = "";
}

// Move to Progress
function copyToProgress(text) {
  createTaskItem(text, "progressList", 'toCompleted');
}

// Move to Completed
function copyToCompleted(text) {
  createTaskItem(text, "completedList", 'toCompleted');
}
