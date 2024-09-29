document.addEventListener("DOMContentLoaded", function () {
  const yearSelect = document.getElementById("year");
  const monthSelect = document.getElementById("month");
  const daySelect = document.getElementById("day");
  const tasksUl = document.getElementById("tasksUl");

  if (tasksUl) {
    loadTasks();
  }

  function saveTask(task) {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach((task) => addTaskToList(task));
  }

  function addTaskToList(task) {
    const li = document.createElement("li");
    li.textContent = `${task.year}-${task.month}-${task.day}: ${task.type} - ${task.description}`;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Excluir";
    deleteButton.classList.add("delete-button");

    deleteButton.addEventListener("click", function () {
      deleteTask(task);
    });

    li.appendChild(deleteButton);
    tasksUl.appendChild(li);
  }

  function deleteTask(taskToDelete) {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const updatedTasks = tasks.filter(
      (task) =>
        !(
          task.year === taskToDelete.year &&
          task.month === taskToDelete.month &&
          task.day === taskToDelete.day &&
          task.type === taskToDelete.type &&
          task.description === taskToDelete.description
        )
    );

    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    tasksUl.innerHTML = "";
    loadTasks();
  }

  if (yearSelect && monthSelect && daySelect) {
    function populateYears() {
      const currentYear = new Date().getFullYear();
      for (let i = currentYear; i <= currentYear + 5; i++) {
        const option = document.createElement("option");
        option.value = i;
        option.textContent = i;
        yearSelect.appendChild(option);
      }
    }

    function populateDays() {
      const selectedYear = parseInt(yearSelect.value);
      const selectedMonth = monthSelect.value;

      const daysInMonth = new Date(
        selectedYear,
        new Date(Date.parse(`${selectedMonth} 1, ${selectedYear}`)).getMonth() +
          1,
        0
      ).getDate();

      daySelect.innerHTML = "";
      for (let i = 1; i <= daysInMonth; i++) {
        const option = document.createElement("option");
        option.value = i;
        option.textContent = i;
        daySelect.appendChild(option);
      }
    }

    monthSelect.addEventListener("change", populateDays);
    yearSelect.addEventListener("change", populateDays);

    populateYears();
    populateDays();

    document
      .getElementById("taskForm")
      .addEventListener("submit", function (e) {
        e.preventDefault();

        const taskData = {
          year: yearSelect.value,
          month: monthSelect.value,
          day: daySelect.value,
          type: document.getElementById("type").value,
          description: document.getElementById("description").value,
        };

        saveTask(taskData);
        addTaskToList(taskData);

        alert("Task registered successfully!");
        this.reset();
        populateDays();
      });
  }
});
