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
const addTaskBtnMobile = document.querySelector(".submit-close-container.mobile .submit-task-btn");
const cancelTaskBtn = document.querySelectorAll(".cancel-task-btn");

let targetProjectName = null;
let selectedPriority = null;
let selectedDate = null;
let editMode = false;
let originalTaskInfoCopy = null;


// ************** PROJECT MODAL **************
// modalElement being the modalProjectContainer or the modalTaskContain
function handleModalRequest(modalType, projectId = null, taskInfo = null) {
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
			addTaskModalHandler();
			break;
		case "editTask":
			editTaskModalHandler(taskInfo);
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
// ************** TASK MODAL INFO **************
// Function to create event listeners with the current targetProjectName
function createEventListenersForNewTask() {
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

function removeListenerCallForNewTask() {
	const eventListeners = createEventListenersForNewTask();
	taskForm.removeEventListener("submit", eventListeners.submitHandler);
	addTaskBtnMobile.removeEventListener("click", eventListeners.submitMobileHandler);
	cancelTaskBtn.forEach((taskBtn) => taskBtn.removeEventListener("click", eventListeners.cancelHandler));
	priorityDropdownItems.forEach((priority) => {
		priority.removeEventListener("click", eventListeners.priorityHandler);
	});
	dueDateBtn.removeEventListener("click", eventListeners.dateHandler);
}

/**
 * ADD-TASK MODAL LOGIC BELOW
 */
function addTaskModalHandler() {
	addListenerToOpenClosePriority();
	// Remove the event listeners if they exist
	removeListenerCallForNewTask();

	// Add the event listeners with the updated targetProjectName
	const newEventListeners = createEventListenersForNewTask();
	taskForm.addEventListener("submit", newEventListeners.submitHandler);
	addTaskBtnMobile.addEventListener("click", newEventListeners.submitMobileHandler);
	cancelTaskBtn.forEach((taskBtn) => taskBtn.addEventListener("click", newEventListeners.cancelHandler));
	priorityDropdownItems.forEach((priority) => {
		priority.addEventListener("click", newEventListeners.priorityHandler);
	});
	dueDateBtn.addEventListener("click", newEventListeners.dateHandler);
}

/**
 * EDIT-TASK MODAL LOGIC BELOW
 */
function createEventListenersForEditTask() {
	function submitHandler(event, originalTaskInfoCopy) {
		event.preventDefault();
		if (taskForm.checkValidity()) {
			editTaskInProject(originalTaskInfoCopy);
		}
	}

	function submitMobileHandler(taskInfo) {
		if (taskForm.checkValidity()) {
			errorText.style.display = "none"; // Hide error message
			editTaskInProject(originalTaskInfoCopy);
		} else {
			errorText.style.display = "block"; // Show error message
		}
	}

	function cancelHandler() {
		closeTaskModal();
	}

	return {
		submitHandler,
		submitMobileHandler,
		cancelHandler,
	};
}

function removeListenerCallForEditTask() {
	// Remove event listeners to avoid conflicts when we reload up the editTask
	const editEventListeners = createEventListenersForEditTask();
	const submitHandlerFunction = (event) => editEventListeners.submitHandler(event, originalTaskInfoCopy);
	const submitMobileHandlerFunction = () => editEventListeners.submitMobileHandler(originalTaskInfoCopy);
	const cancelHandlerFunction = () => editEventListeners.cancelHandler();

	taskForm.removeEventListener("submit", submitHandlerFunction);
	addTaskBtnMobile.removeEventListener("click", submitMobileHandlerFunction);
	cancelTaskBtn.forEach((taskBtn) => taskBtn.removeEventListener("click", cancelHandlerFunction));
}

function editTaskModalHandler(taskInfo) {
	addListenerToOpenClosePriority();
	populateOriginalModal(taskInfo);

	// Remove the event listeners from the original created Modal to avoid conflicts
	removeListenerCallForNewTask();
	removeListenerCallForEditTask();

	// eventListener specific for editing task modal
	const editEventListeners = createEventListenersForEditTask();
	const submitHandlerFunction = (event) => editEventListeners.submitHandler(event, originalTaskInfoCopy);
	const submitMobileHandlerFunction = () => editEventListeners.submitMobileHandler(originalTaskInfoCopy);
	const cancelHandlerFunction = () => editEventListeners.cancelHandler();
	taskForm.addEventListener("submit", submitHandlerFunction);
	addTaskBtnMobile.addEventListener("click", submitMobileHandlerFunction);
	cancelTaskBtn.forEach((taskBtn) => taskBtn.addEventListener("click", cancelHandlerFunction));

	// eventListeners same functionality as with add new task modal
	const newEventListeners = createEventListenersForNewTask();
	priorityDropdownItems.forEach((priority) => {
		priority.addEventListener("click", newEventListeners.priorityHandler);
	});
	dueDateBtn.addEventListener("click", newEventListeners.dateHandler);
}

// This repopulates the modal DOM with the already created task info
function populateOriginalModal(taskInfo) {
	originalTaskInfoCopy = JSON.parse(JSON.stringify(taskInfo)); // Create a deep copy of taskInfo
	document.getElementById("task-name").value = taskInfo.title;

	if (taskInfo.description) {
		document.getElementById("task-description").value = taskInfo.description;
	}

	if (taskInfo.date) {
		const formattedDate = formatDate(taskInfo.date);
		dueDateTag.textContent = formattedDate;
	}

	const savedPriority = taskInfo.priority;
	createFlagBaseOnPriority(flagSrc, savedPriority);
	priorityBtnTag.textContent = priorityType(savedPriority);
}

function editTaskInProject(originalTaskInfo) {
	// Get the inputted values
	const editedTitle = document.getElementById("task-name").value;
	const editedDescription = document.getElementById("task-description").value;
	const editedDueDate = selectedDate;
	const editedPriority = selectedPriority;

	// Find the target project
	const targetProject = projectList.find((project) => {
		return project.getTasks().some((task) => task.title === originalTaskInfo.title);
	});

	if (!targetProject) {
		console.error("Target project not found.");
		return;
	}

	// Find the target task within the project's tasks array
	const targetTask = targetProject.getTasks().find((task) => task.title === originalTaskInfo.title);

	if (targetTask) {
		// Update the task's properties
		targetTask.title = editedTitle;
		targetTask.description = editedDescription;
		targetTask.date = editedDueDate;
		targetTask.priority = editedPriority;
	}

	// Update the task container in the UI with edited task info
	const taskContainer = document.querySelector(`[data-task-title="${originalTaskInfo.title}"]`);
	if (taskContainer) {
		checkBottomContainer(taskContainer);
		// Update the task title
		const taskTitleElement = taskContainer.querySelector(".task-title");
		if (taskTitleElement) {
			taskTitleElement.textContent = editedTitle;
			taskContainer.dataset.taskTitle = editedTitle; // Update the dataset attribute
		}
		if (editedDescription !== null) {
			taskContainer.querySelector(".task-description").textContent = editedDescription;
		}
		if (editedDueDate !== null) {
			const taskDateTag = taskContainer.querySelector(".task-date");
			taskDateTag.textContent = formatDate(selectedDate);
		}
		priorityBtnTag.textContent = priorityType(selectedPriority);
		const taskFlagImg = taskContainer.querySelector(".priority-flag");
		createFlagBaseOnPriority(taskFlagImg, selectedPriority);
	}

	// Close the modal
	closeTaskModal();

	// Update project list and local storage
	updateProjectToStorage();
}
// ***********************************************************
// ***********************************************************

// Execution of modalHandler's request to add the filled out information here
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
}

// We call the below function to be invoked immediately so we have one listener at all time for the priority dropdown
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

	const taskDescr = document.getElementById("task-description");
	if (taskDescr != null) {
		taskDescr.value = "";
	}

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
	if (!selectedPriority) {
		return "Priority";
	}
}

// Sometimes we don't have descriptions or date container within the bottomContainer, we remake em here
function checkBottomContainer(taskContainer) {
	const bottomContainer = taskContainer.querySelector(".task-bottom-container");
	const descrInfo = taskContainer.querySelector(".task-description");
	const dateInfo = taskContainer.querySelector(".task-date");

	console.log(descrInfo);
	console.log(dateInfo);

	if (descrInfo == null) {
		const taskDescr = createElement("p", "task-description");
		bottomContainer.appendChild(taskDescr);
	}
	if (dateInfo == null) {
		const taskDate = createElement("p", "task-date");
		bottomContainer.appendChild(taskDate);
	}
}

function createElement(type, className) {
	const element = document.createElement(type);
	element.classList.add(className);
	return element;
}

export { handleModalRequest, createNewProject };
