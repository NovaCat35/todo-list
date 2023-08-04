import { projectList, createProjectElement, replaceProjectElement } from "./projectController.js";
import { displayTask } from "./mainPageController.js";

const modalProject = document.querySelector(".project-modal-background");
const projectForm = document.querySelector(".project-modal-container form");
const taskForm = document.querySelector(".task-modal-container form");
const addProjectBtn = document.querySelector(".modal-project-btn");
const cancelBtn = document.querySelector(".modal-cancel-btn");
const modalTask = document.querySelector(".task-modal-container");
const addTaskBtn = document.querySelector(".add-task-btn")
let oldProjectLink = null;

let editMode = false; // Add a flag to track the edit mode

// ************** PROJECT MODAL **************
// modalElement being the modalProjectContainer or the modalTaskContainer
export default function handleModalRequest(modalType, projectId = null) {
	oldProjectLink = projectId;
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
function editProject(projectId) {
	addProjectBtn.removeEventListener("click", onProjectClick); // Remove the old event listener
	addProjectBtn.addEventListener("click", onProjectClick); // Add new event listener

	// Pre-fill the project name in the form for editing
	const project = projectList.find((project) => project.title === projectId);
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
			const index = projectList.findIndex((project) => project.title === oldProjectLink);
			if (index !== -1) {
				projectList[index].title = title;
				replaceProjectElement(oldProjectLink, title);
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
let isAddTaskModalHandlerListenerAdded = false;

function addTaskModalHandler(targetProjectName) {
	const addTaskBtnMobile = document.querySelector(".submit-close-container.mobile .submit-task-btn");
	const cancelTaskBtn = document.querySelectorAll(".cancel-task-btn");

	if (!isAddTaskModalHandlerListenerAdded) {
		// Check for submit btn (when clicked) -> upload new task to projectList -> hide/clear modal
		taskForm.addEventListener("submit", (event) => {
			event.preventDefault();
			if (taskForm.checkValidity) {
				updateTaskToProject(targetProjectName);
			}
		});

		// Handle mobile buttons (b/c btn is actually an img, not "button")
		addTaskBtnMobile.addEventListener("click", () => {
			if (taskForm.checkValidity()) {
				updateTaskToProject(targetProjectName);
			}
		});

		// Handle cancel btn calls
		cancelTaskBtn.forEach(taskBtn => taskBtn.addEventListener("click", closeTaskModal))

		// Set the flag to indicate that the event listener has been added
		isAddTaskModalHandlerListenerAdded = true;
	}
}

function updateTaskToProject(targetProjectName) {
	const targetProjectInfo = projectList.find((project) => project.title == targetProjectName);
	const taskTitle = document.getElementById("task-name").value;
	const taskDescription = document.getElementById("task-description").value;
	// const taskDueDate = ...
	// const taskPriority = ...
	targetProjectInfo.setTask(taskTitle, taskDescription);

	// Update the task that shows up in main page
	displayTask(targetProjectName);
	closeTaskModal();
}

function closeTaskModal() {
	document.getElementById("task-name").value = '';
	document.getElementById("task-description").value = '';
	
	modalTask.classList.add("hidden");
	addTaskBtn.classList.remove("hidden")
}
