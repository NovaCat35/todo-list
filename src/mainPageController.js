import handleModalRequest from "./modalHandler.js";
import { projectList } from "./projectController.js";
import priorityFilledFlag from "./assets/flag-fill.svg";
import priorityNeutralFlag from "./assets/flag.svg";
import { formatDate, getTodaysDate } from "./dateController.js";

const taskList = document.querySelector(".task-list");
const addTaskBtn = document.querySelector(".add-task-btn");
let targetName = null;

/**
 * @param {title of navTab} navTabInfo
 * Function is called when side nav tabs are clicked.
 * displayMainInfo() will display the proper title,
 * call project's tasks, and put a listener on the "Add Task" button.
 * "Add Task" will call for the task modal.
 */
function displayMainInfo(event, navTabInfo) {
	const mainTitle = document.querySelector(".main-title");
	const sideNavigation = document.querySelector(".side-nav");
	const hamburger = document.querySelector(".hamburger");

	// Collapses the side-nav & hamburger menu if in mobile mode
	sideNavigation.classList.remove("active");
	hamburger.classList.remove("active");

	// Checks if displaying the main nav title
	if (navTabInfo == "mainTabInfo") {
		removeAddTaskBtn();
		targetName = event.target.id;
		displayProjectBaseOnChoice(targetName);
	}
	// Otherwise, we selected project's title
	else {
		const projectElement = event.target.closest("[data-project-id]");
		if (projectElement) {
			targetName = projectElement.getAttribute("data-project-id");
			clearTaskList();
			getProjectTask(targetName);
			showAddTaskBtn();
		}
	}
	// Show title page
	mainTitle.textContent = targetName;
	// Hide task modal if open
	closeTaskModal();
}

// This doesn't display the individual task, rather find the target project and get the task to be displayed
function getProjectTask(projectName) {
	const targetProjectInfo = projectList.find((project) => project.title == projectName);

	// Loop through tasks and create task elements
	if (targetProjectInfo) {
		targetProjectInfo.getTasks().forEach((task) => displayTask(task));
	}
}

// This will take the individual task from @param and create a list base on its info
function displayTask(task) {
	const taskInfoContainer = createElement("div", "task-info-container");
	const taskInnerTopContainer = createElement("div", "task-top-container");
	const taskInnerLeftContainer = createElement("div", "task-inner-left-container");
	const taskInnerRightContainer = createElement("div", "task-inner-right-container");
	const taskDescrContainer = createElement("div", "task-descr-container");

	// TITLE
	const taskTitle = createElement("p", "task-title");
	taskTitle.textContent = task.title;
	taskInnerLeftContainer.appendChild(taskTitle);

	// DESCRIPTION
	const taskDescription = createElement("p", "task-description");
	if (task.description) {
		taskDescription.textContent = task.description;
		taskDescrContainer.appendChild(taskDescription);
	}

	// PRIORITY
	const taskFlagImg = createElement("img", "priority-flag");
	const taskPriority = task.priority;
	createFlagBaseOnPriority(taskFlagImg, taskPriority);
	taskInnerRightContainer.appendChild(taskFlagImg); //add the final chosen priority flag

	// DUE DATE
	const taskDate = createElement("p", "task-date");
	if (task.date) {
		const formattedDate = formatDate(task.date);
		taskDate.textContent = formattedDate;
		taskInnerRightContainer.appendChild(taskDate);
	}

	// Adding final compiled task to taskList!
	taskInnerTopContainer.appendChild(taskInnerLeftContainer);
	taskInnerTopContainer.appendChild(taskInnerRightContainer);
	taskInfoContainer.appendChild(taskInnerTopContainer);
	taskInfoContainer.appendChild(taskDescrContainer);
	taskList.appendChild(taskInfoContainer);
}

// -----------------------
// This is the 'plus' btn that will open up the task modal
function showAddTaskBtn() {
	addTaskBtn.classList.remove("hidden");
	addTaskBtn.addEventListener("click", addTaskClickHandler);
}

function removeAddTaskBtn() {
	addTaskBtn.classList.add("hidden");
	addTaskBtn.removeEventListener("click", addTaskClickHandler);
}

function addTaskClickHandler() {
	showTaskModal(targetName);
	removeAddTaskBtn();
}

// Opens up the main task modal
function showTaskModal(targetProjectName) {
	const taskModal = document.querySelector(".task-modal-container");
	taskModal.classList.remove("hidden");
	handleModalRequest("addTask", targetProjectName);
}

function closeTaskModal() {
	const modalTask = document.querySelector(".task-modal-container");

	// Reset inputs
	document.getElementById("task-name").value = "";
	document.getElementById("task-description").value = "";

	modalTask.classList.add("hidden");
}

function createElement(type, className) {
	const element = document.createElement(type);
	element.classList.add(className);
	return element;
}

function createFlagBaseOnPriority(flagImg, priorityInfo) {
	switch (priorityInfo) {
		case "high-priority":
			removeAllFlagPriority(flagImg);
			flagImg.classList.add("flag-high");
			flagImg.src = priorityFilledFlag;
			break;
		case "medium-priority":
			removeAllFlagPriority(flagImg);
			flagImg.classList.add("flag-medium");
			flagImg.src = priorityFilledFlag;
			break;
		case "low-priority":
			removeAllFlagPriority(flagImg);
			flagImg.classList.add("flag-low");
			flagImg.src = priorityFilledFlag;
			break;
		default:
			removeAllFlagPriority(flagImg);
			flagImg.src = priorityNeutralFlag;
			flagImg.classList.add("flag-none");
	}
}

function removeAllFlagPriority(flagImg) {
	flagImg.classList.remove("flag-high");
	flagImg.classList.remove("flag-medium");
	flagImg.classList.remove("flag-low");
}

function clearTaskList() {
	taskList.textContent = "";
}

/**
 *	@param {main tab's specific name} mainTabName
 *	We assign specific roles here base on the tab's name
 */
function displayProjectBaseOnChoice(mainTabName) {
	switch (mainTabName) {
		case "All":
			displayAllProject();
			break;
		case "Today":
			displayTodayProject();
			break;
		default:
			break;
	}
}

function displayAllProject() {
	clearTaskList();
	for (let i = 0; i < projectList.length; i++) {
		const projectName = projectList[i].title;
		getProjectTask(projectName);
	}
}

function filterTaskByDate(selectedDate, project) {
	const tasks = project.getTasks();
	console.log(`taskslist: ${tasks[0]}`)
	const selectedTaskList = tasks.filter((task) => task.date === selectedDate);
	return selectedTaskList;
}

function displayTodayProject() {
	const today = getTodaysDate();
	let selectedTaskList = [];
	clearTaskList();

	// Filter for task that match today's date
	for (let i = 0; i < projectList.length; i++) {
		selectedTaskList = selectedTaskList.concat(filterTaskByDate(today, projectList[i]));
	}

	console.log("Filtered Projects:", selectedTaskList);

	for (let k = 0; k < selectedTaskList.length; k++) {
		displayTask(selectedTaskList[k]);
	}
}

export { displayMainInfo, getProjectTask, closeTaskModal, showAddTaskBtn, createFlagBaseOnPriority, priorityNeutralFlag, removeAllFlagPriority, clearTaskList };
