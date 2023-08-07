import { projectList, createProjectElement, replaceProjectElement } from "./projectController.js";
import { displayTask, closeTaskModal } from "./mainPageController.js";

const modalProject = document.querySelector(".project-modal-background");
const projectForm = document.querySelector(".project-modal-container form");
const taskForm = document.querySelector(".task-modal-container form");
const addProjectBtn = document.querySelector(".modal-project-btn");
const cancelBtn = document.querySelector(".modal-cancel-btn");
const priorityBtn =  document.querySelector(".priority-container");
const priorityDropdown = document.querySelector(".dropdown-container");
const priorityDropdownItems = document.querySelectorAll(".dropdown li");

let targetProjectName = null;
let selectedPriority = null;
let editMode = false;

// ************** PROJECT MODAL **************
// modalElement being the modalProjectContainer or the modalTaskContain
export default function handleModalRequest(modalType, projectId = null) {
	// Setup initial values
	targetProjectName = projectId;
	selectedPriority = null;

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
			console.log(`project@handler: ${projectId}`);
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
		if (editMode) {
			// If in edit mode, update the existing project
			const index = projectList.findIndex((project) => project.title === targetProjectName);
			if (index !== -1) {
				projectList[index].title = title;
				replaceProjectElement(targetProjectName, title);
			}
		} else {
			// If in add mode, create a new project
			projectList.push(createProjectList(title));
			createProjectElement(title);
		}
		clearProjectModal();
	}
}

// ---- PROJECT  ----
function createProjectList(title) {
	let tasks = [];
	return {
		title,
		setTask(title, description = null, priority = null, date = null) {
			tasks.push({
				title,
				description,
				priority,
				date,
			});
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

// ************** TASK MODAL **************
function addTaskModalHandler() {
	const addTaskBtnMobile = document.querySelector(".submit-close-container.mobile .submit-task-btn");
	const cancelTaskBtn = document.querySelectorAll(".cancel-task-btn");

	addListenerToOpenClosePriority()

	// Function to create event listeners with the current targetProjectName
	function createEventListeners() {
		function submitHandler(event) {
			event.preventDefault();
			if (taskForm.checkValidity()) {
				console.log(`Testing: ${targetProjectName}`);
				updateTaskToProject();
			}
		}

		function submitMobileHandler() {
			if (taskForm.checkValidity()) {
				updateTaskToProject();
			}
		}

		function cancelHandler() {
			closeTaskModal();
		}

		function priorityHandler(event) {
			selectedPriority = event.target.closest("[data-priority]").getAttribute('data-priority');
			priorityDropdown.classList.remove('active');
			event.stopPropagation(); // Stop event propagation to parent (i.e. priorityDropdown)
		}

		return {
			submitHandler,
			submitMobileHandler,
			cancelHandler,
			priorityHandler,
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

	// Add the event listeners with the updated targetProjectName
	const newEventListeners = createEventListeners();
	taskForm.addEventListener("submit", newEventListeners.submitHandler);
	addTaskBtnMobile.addEventListener("click", newEventListeners.submitMobileHandler);
	cancelTaskBtn.forEach((taskBtn) => taskBtn.addEventListener("click", newEventListeners.cancelHandler));
	priorityDropdownItems.forEach((priority) => {
		priority.addEventListener("click", newEventListeners.priorityHandler);
	});
}

function updateTaskToProject() {
	const targetProjectInfo = projectList.find((project) => project.title == targetProjectName);
	const taskTitle = document.getElementById("task-name").value;
	const taskDescription = document.getElementById("task-description").value;
	// const taskDueDate = ...
	const taskPriority = selectedPriority;
	targetProjectInfo.setTask(taskTitle, taskDescription, taskPriority);

	// Update the task that shows up in main page
	displayTask(targetProjectName);
	closeTaskModal();
}

let priorityListenerAdded = false;
function addListenerToOpenClosePriority(){
	if (!priorityListenerAdded) {
		priorityBtn.addEventListener('click', () => {
			console.log('wth')
			priorityDropdown.classList.toggle('active');
		});
		priorityListenerAdded = true;
	}
}