import handleModalRequest from "./modalHandler.js";
import { projectList } from "./projectController.js";

/**
 * @param {title of navTab} navTabInfo
 * Function is called when side nav tabs are clicked.
 * displayMainInfo() will display the proper title,
 * call project's tasks, and put a listener on the "Add Task" button.
 * "Add Task" will call for the task modal.
 */
function displayMainInfo(event, navTabInfo) {
	const mainTitle = document.querySelector(".main-title");
   const sideNavigation = document.querySelector('.side-nav')
   const hamburger = document.querySelector('.hamburger')
	let targetName = null;

   // Collapses the side-nav & hamburger menu if in mobile mode
   sideNavigation.classList.remove('active');
   hamburger.classList.remove('active');

	// Checks if displaying the main nav title or project's title
	if (navTabInfo == "mainTabInfo") {
		targetName = event.target.id;
	} else {
		targetName = event.target.getAttribute("data-project-id");
		// IF PROJECT : display tasks & show "Add Task"
		displayTask(targetName);
		addTaskBtn(targetName);
	}
	// Show title page
	mainTitle.textContent = targetName;
	// Hide task modal if open
	closeTaskModal();
}

function displayTask(projectName) {
	const taskList = document.querySelector(".task-list");
	const targetProjectInfo = projectList.find((project) => project.title == projectName);

	// Clear the existing task list
	taskList.textContent = "";

	// Loop through tasks and create task elements
	if (targetProjectInfo) {
		targetProjectInfo.getTasks().forEach((task) => {
			const taskElement = document.createElement("div");
			taskElement.classList.add("task-info-container");
			taskElement.textContent = task.title;
			taskList.appendChild(taskElement);
		});
	}
}

// -----------------------
function addTaskBtn(targetProjectName) {
	// Initial setup reveal "Add Task" btn
	const addTaskBtn = document.querySelector(".add-task-btn");
	addTaskBtn.classList.remove("hidden");

	// Remove the event listener if it exists to avoid conflict
	addTaskBtn.removeEventListener("click", addTaskClickHandler);
	addTaskBtn.addEventListener("click", addTaskClickHandler);

	function addTaskClickHandler() {
		addTaskBtn.classList.add("hidden");
		showTaskModal(targetProjectName);
	}
}

function showTaskModal(targetProjectName) {
	const taskModal = document.querySelector(".task-modal-container");
	taskModal.classList.remove("hidden");
	console.log(targetProjectName);
	handleModalRequest("addTask", targetProjectName);
}

function closeTaskModal() {
	const modalTask = document.querySelector(".task-modal-container");
	const addTaskBtn = document.querySelector(".add-task-btn");

	document.getElementById("task-name").value = "";
	document.getElementById("task-description").value = "";

	modalTask.classList.add("hidden");
	addTaskBtn.classList.remove("hidden");
}

export { displayMainInfo, displayTask, closeTaskModal };
