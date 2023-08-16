import { projectList, createProjectElement, replaceProjectElement } from "./projectController.js";
import { getProjectTask, closeTaskModal, showAddTaskBtn } from "./mainPageController.js";
import { createFlagBaseOnPriority, removeAllFlagPriority, priorityNeutralFlag, clearTaskList } from "./taskController.js";
import { formatDate } from "./dateController.js";
import { updateProjectToStorage } from "./localStorage.js";

const modalProject = document.querySelector(".project-modal-background");
const projectForm = document.querySelector(".project-modal-container form");
const taskForm = document.querySelector(".task-modal-container form");
const addProjectBtn = document.querySelector(".modal-project-btn");
const cancelBtn = document.querySelector(".modal-cancel-btn");
const errorText = document.getElementById("errorText");
const priorityBtn = document.querySelector(".priority-container");
const priorityBtnTag = document.querySelector(".priority-container p");
const priorityDropdown = document.querySelector(".dropdown-container");
const priorityDropdownItems = document.querySelectorAll(".dropdown li");
const flagSrc = document.querySelector(".priority-container img");
const dueDateBtn = document.querySelector(".due-date-container");
const dateInput = document.getElementById("date-input");
const dueDateTag = document.querySelector(".due-date-container p");

let targetProjectName = null;
let selectedPriority = null;
let selectedDate = null;
let editMode = false;

// ************** PROJECT MODAL **************
// modalElement being the modalProjectContainer or the modalTaskContain
function handleModalRequest(modalType, projectId = null) {
	// Setup initial values
	resetModal(projectId);

	switch (modalType) {
		case "addProject":
			editMode = false; // Set edit mode to false for adding a new project
			addProject();
			break;
		case "editProject":
			editMode = true; // Set edit mode to true for editing an existing project
			editProject(projectId);
			break;
		case "addTask":
			addTaskModalHandler(projectId);
		default:
			break;
	}
}

/******
 * Check and input & tag the add listeners for the buttons on the modal.
 * This function will also add the project to the projectList and create/add new project DOM element to the sidebar
 *******/
let isAddProjectBtnListenerAdded = false;
function addProject() {
	if (!isAddProjectBtnListenerAdded) {
		addProjectBtn.addEventListener("click", onProjectClick);
		cancelBtn.addEventListener("click", clearProjectModal);

		isAddProjectBtnListenerAdded = true;
	}
}

/*
 * Edit the projects title and modify this list, but doesn't create a new DOM element for sidebar
 * In addition, we fill in the input with the already created project's title
 */
function editProject() {
	addProjectBtn.removeEventListener("click", onProjectClick); // Remove the old event listener
	addProjectBtn.addEventListener("click", onProjectClick); // Add new event listener

	// Pre-fill the project name in the form for editing
	const project = projectList.find((project) => project.title === targetProjectName);
	if (project) {
		document.getElementById("project-name").value = project.title;
	}
}

function onProjectClick(event) {
	if (projectForm.checkValidity()) {
		event.preventDefault();
		const title = document.getElementById("project-name").value;
		// If in edit mode, update the existing project
		if (editMode) {
			editOldProject(title);
		}
		// If in add mode, create a new project
		else {
			createNewProject(title);
		}

		clearProjectModal();
		updateProjectToStorage(); //localSave update!!
	}
}

function createNewProject(projectTitle) {
	const project = createProjectList(projectTitle);
	projectList.push(project);
	createProjectElement(projectTitle);

	return project; // We will need this for the localStorage to repopulate the tasks
}

function editOldProject(projectTitle) {
	const index = projectList.findIndex((project) => project.title === targetProjectName);
	if (index !== -1) {
		projectList[index].title = projectTitle; // update the projectList
		replaceProjectElement(targetProjectName, projectTitle); // update DOM
	}
}

// ***************************
// ---- CREATE TASK  ----
// ***************************
function createTask(title, description = null, priority = null, date = null, status) {
	return {
		title,
		description,
		priority,
		date,
		status,
	};
}
// ***************************
// ---- CREATE PROJECT  ----
// ***************************
function createProjectList(title) {
	let tasks = [];
	return {
		title,
		setTask(title, description = null, priority = null, date = null, status = false) {
			const newTaskInstance = createTask(title, description, priority, date, status);
			tasks.push(newTaskInstance);
		},
		getTasks() {
			return tasks;
		},
	};
}

function clearProjectModal() {
	document.getElementById("project-name").value = "";
	modalProject.classList.add("hidden");
}

// ***********************************************************************
// ************** TASK MODAL **************
function addTaskModalHandler() {
	const addTaskBtnMobile = document.querySelector(".submit-close-container.mobile .submit-task-btn");
	const cancelTaskBtn = document.querySelectorAll(".cancel-task-btn");

	addListenerToOpenClosePriority();

	// Function to create event listeners with the current targetProjectName
	function createEventListeners() {
		function submitHandler(event) {
			event.preventDefault();
			if (taskForm.checkValidity()) {
				createTaskToProject();
			}
		}

		function submitMobileHandler() {
			if (taskForm.checkValidity()) {
				errorText.style.display = "none"; // Hide error message
				createTaskToProject();
			} else {
				errorText.style.display = "block"; // Show error message
			}
		}

		function cancelHandler() {
			closeTaskModal();
			showAddTaskBtn();
		}

		function priorityHandler(event) {
			selectedPriority = event.target.closest("[data-priority]").getAttribute("data-priority");
			createFlagBaseOnPriority(flagSrc, selectedPriority);
			priorityBtnTag.textContent = priorityType(selectedPriority);
			priorityDropdown.classList.remove("active");
			event.stopPropagation(); // Stop event propagation to parent (i.e. priorityDropdown since it has its own listener)
		}

		let listenerOnDatepicker = false;
		function dateHandler() {
			dateInput.showPicker(); //shows the input's dropdown calendar picker
			if (!listenerOnDatepicker) {
				dateInput.addEventListener("input", () => {
					selectedDate = dateInput.value;
					const formattedDate = formatDate(selectedDate);
					dueDateTag.textContent = formattedDate;
					listenerOnDatepicker = true;
				});
			}
		}

		return {
			submitHandler,
			submitMobileHandler,
			cancelHandler,
			priorityHandler,
			dateHandler,
		};
	}

	// Remove the event listeners if they exist
	const eventListeners = createEventListeners();
	taskForm.removeEventListener("submit", eventListeners.submitHandler);
	addTaskBtnMobile.removeEventListener("click", eventListeners.submitMobileHandler);
	cancelTaskBtn.forEach((taskBtn) => taskBtn.removeEventListener("click", eventListeners.cancelHandler));
	priorityDropdownItems.forEach((priority) => {
		priority.removeEventListener("click", eventListeners.priorityHandler);
	});
	dueDateBtn.removeEventListener("click", eventListeners.dateHandler);

	// Add the event listeners with the updated targetProjectName
	const newEventListeners = createEventListeners();
	taskForm.addEventListener("submit", newEventListeners.submitHandler);
	addTaskBtnMobile.addEventListener("click", newEventListeners.submitMobileHandler);
	cancelTaskBtn.forEach((taskBtn) => taskBtn.addEventListener("click", newEventListeners.cancelHandler));
	priorityDropdownItems.forEach((priority) => {
		priority.addEventListener("click", newEventListeners.priorityHandler);
	});
	dueDateBtn.addEventListener("click", newEventListeners.dateHandler);
}

function createTaskToProject() {
	const targetProjectInfo = projectList.find((project) => project.title == targetProjectName);
	const taskTitle = document.getElementById("task-name").value;
	const taskDescription = document.getElementById("task-description").value;
	const taskDueDate = selectedDate;
	const taskPriority = selectedPriority;
	targetProjectInfo.setTask(taskTitle, taskDescription, taskPriority, taskDueDate);

	// Update the task that shows up in main page
	updateProjectToStorage();
	clearTaskList();
	getProjectTask(targetProjectName);
	closeTaskModal();
	showAddTaskBtn();
	console.log(projectList[0].getTasks());
}

let priorityListenerAdded = false;
function addListenerToOpenClosePriority() {
	if (!priorityListenerAdded) {
		priorityBtn.addEventListener("click", () => {
			priorityDropdown.classList.toggle("active");
		});
		priorityListenerAdded = true;
	}
}

function resetModal(projectId) {
	errorText.style.display = "none"; // Hide error message
	targetProjectName = projectId;
	selectedPriority = null;
	selectedDate = null;
	dueDateTag.textContent = "Due Date";
	priorityBtnTag.textContent = "Priority";
	flagSrc.src = priorityNeutralFlag;
	removeAllFlagPriority(flagSrc);
}

function priorityType(selectedPriority) {
	if (selectedPriority == "high-priority") {
		return "High";
	}
	if (selectedPriority == "medium-priority") {
		return "Medium";
	}
	if (selectedPriority == "low-priority") {
		return "Low";
	}
}

export { handleModalRequest, createNewProject };
