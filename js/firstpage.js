document.addEventListener("DOMContentLoaded", () => {
    /* ----------------------------- */
    const links = document.querySelectorAll("aside ul li a");
    const content = document.querySelector(".body .container");

    const pageTemplates = {
        myday: {
            title: "My Day",
            icon: "fa-solid fa-sun",
        },
        important: {
            title: "Important Tasks",
            icon: "fa-regular fa-star",
        },
        planned: {
            title: "Planned Tasks",
            icon: "fa-regular fa-calendar",
        },
        alltasks: {
            title: "All Tasks",
            icon: "fa-solid fa-list-check",
        },
    };

    function renderPage(name) {
        const page = pageTemplates[name];
        if (!page) return "<p>Page not found.</p>";

        return `
      <div class="head">
        <div class="beside">
          <i class="${page.icon}"></i>
          <div class="days">
            <h2>${page.title}</h2>
            <p class="page-date"></p>
          </div>
        </div>
        <button class="add-btn">+ Add Task</button>
      </div>
      <div class="view-tasks">
        <p>Progress</p>
        <p>0 of 0 completed</p>
        <div class="progress">
          <div id="progress-bar" class="progress-bar"></div>
        </div>
      </div>
      <div class="tasks-list"></div>
    `;
    }

    /* ----------------------------- */
    function loadPage(pageName) {
        content.innerHTML = renderPage(pageName);

        const today = new Date();
        const options = { weekday: "long", month: "long", day: "numeric" };
        const formattedDate = today.toLocaleDateString("en-US", options);
        const dateEl = document.querySelector(".page-date");
        if (dateEl) dateEl.textContent = formattedDate;

        initTaskSystem(pageName);
    }

    /* ----------------------------- */
    function initTaskSystem(pageName) {
        const addBtn = document.querySelector(".add-btn");
        const modal = document.querySelector(".modal");
        const cancelBtn = document.querySelector(".close-modal");
        const submitBtn = document.querySelector(".add-task");
        const progressBar = document.getElementById("progress-bar");
        const taskStatus = document.querySelector(".view-tasks p:last-of-type");
        const tasksContainer = document.querySelector(".tasks-list");

        if (!addBtn || !modal || !submitBtn) return;

        let totalTasks = 0;
        let completedTasks = 0;

        addBtn.addEventListener("click", () => {
            modal.style.visibility = "visible";
            modal.setAttribute("data-page", pageName);
        });

        cancelBtn.addEventListener("click", () => {
            modal.style.visibility = "hidden";
        });

        submitBtn.onclick = (e) => {
            e.preventDefault();
            const currentPage = modal.getAttribute("data-page");
            if (currentPage !== pageName) return;

            const taskTitle = document.querySelector('.modal input[type="text"]').value.trim();
            const taskDate = document.querySelector('.modal input[type="date"]').value;

            if (taskTitle === "") return alert("Please enter a task title.");
            if (taskDate === "") return alert("Please select a due date.");

            const task = document.createElement("div");
            task.classList.add("task-item");
            task.innerHTML = `
        <input type="checkbox" class="task-check">
        <div class="task-info">
          <p class="task-title">${taskTitle}</p>
          <small class="task-date">Due: ${taskDate}</small>
        </div>
      `;
            tasksContainer.appendChild(task);

            totalTasks++;
            updateProgress();
            modal.style.visibility = "hidden";

            const checkbox = task.querySelector(".task-check");
            checkbox.addEventListener("change", () => {
                if (checkbox.checked) {
                    completedTasks++;
                    task.classList.add("completed");
                } else {
                    completedTasks--;
                    task.classList.remove("completed");
                }
                updateProgress();
            });

            document.querySelector('.modal input[type="text"]').value = "";
            document.querySelector('.modal input[type="date"]').value = "";
        };

        function updateProgress() {
            const percent = totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;
            progressBar.style.width = percent + "%";
            taskStatus.textContent = `${completedTasks} of ${totalTasks} completed`;
        }
    }

    /* ----------------------------- */
    links.forEach(link => {
        link.addEventListener("click", e => {
            e.preventDefault();
            links.forEach(l => l.classList.remove("active"));
            link.classList.add("active");

            let pageName = link.getAttribute("href").replace("#", "").replace(".html", "");
            loadPage(pageName);
        });
    });

    /* ----------------------------- */
    loadPage("myday");

    /* ----------------------------- */
    const buttons = document.querySelectorAll(".choices button");

    buttons.forEach(button => {
        button.addEventListener("click", () => {
            buttons.forEach(b => b.classList.remove("active"));
            button.classList.add("active");
            localStorage.setItem("activeChoice", button.value);
        });
    });

    const activeChoice = localStorage.getItem("activeChoice");
    if (activeChoice) {
        const current = document.querySelector(`.choices button[value="${activeChoice}"]`);
        if (current) current.classList.add("active");
    }
});
