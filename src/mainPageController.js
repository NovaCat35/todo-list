import { handleModalRequest } from "./modalHandler.js";
import { projectList } from "./projectController.js";
import { getTodaysDate } from "./dateController.js";
import { displayTask, clearTaskList, checkTaskListEmpty } from "./taskController.js";

const taskList = document.querySelector(".task-list");
const addTaskBtn = document.querySelector(".add-task-btn");
let targetName = null;
let inMainTab = true;

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
		inMainTab = true;
		targetName = event.target.id;
		const navTab = event.target;

		removeAddTaskBtn();
		removeAllTabActive();
		setTabActive(navTab);
		displayProjectBaseOnChoice(targetName);
	}
	// Otherwise, we selected project's title
	else {
		inMainTab = false;
		removeAllTabActive();

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

// This doesn't display the individual task, rather find the target project.
// Then it calls for other functions update projectList & display task on DOM
function getProjectTask(projectName) {
	const targetProjectInfo = projectList.find((project) => project.title == projectName);

	// Loop through tasks and create task elements
	if (targetProjectInfo) {
		targetProjectInfo.getTasks().forEach((task) => displayTask(task));
	}
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

/**
 *	@param {main tab's specific name} mainTabName
 *	We assign specific roles here base on the tab's name
 */
function displayProjectBaseOnChoice(mainTabName) {
	switch (mainTabName) {
		case "All":
			displayAllProject();
			checkTaskListEmpty();
			break;
		case "Today":
			displayTodayTasks();
			checkTaskListEmpty();
			break;
		case "Upcoming":
			displayUpcomingTasks();
			checkTaskListEmpty();
			break;
		case "Completed":
			displayCompletedTasks();
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

function displayTodayTasks() {
	const today = getTodaysDate();
	let todayTaskList = [];
	clearTaskList();

	function filterTaskByToday(todayDate, project) {
		const tasks = project.getTasks();
		const selectedTaskList = tasks.filter((task) => task.date === todayDate);
		return selectedTaskList;
	}

	// Filter for task that match today's date
	for (let i = 0; i < projectList.length; i++) {
		const filteredTasksList = filterTaskByToday(today, projectList[i]);
		todayTaskList = todayTaskList.concat(filteredTasksList);
	}

	for (let k = 0; k < todayTaskList.length; k++) {
		displayTask(todayTaskList[k]);
	}
}

function displayUpcomingTasks() {
	const today = getTodaysDate(); // Get today's date as a string in the format "yyyy-mm-dd"
	let upcomingTaskList = [];
	clearTaskList();

	function filterTaskByUpcoming(todayDate, project) {
		const projectTasks = project.getTasks();
		const upcomingTasks = projectTasks.filter((task) => {
			if (task.date) {
				const taskDate = new Date(task.date); // Convert task date to Date object
				const todayDate = new Date(today); // Convert today's date string to Date object
				return taskDate > todayDate;
			}
			return false;
		});
		return upcomingTasks;
	}

	// Filter for tasks that have due dates greater than or equal to today
	for (let i = 0; i < projectList.length; i++) {
		const filteredTasksList = filterTaskByUpcoming(today, projectList[i]);
		upcomingTaskList = upcomingTaskList.concat(filteredTasksList);
	}

	for (let k = 0; k < upcomingTaskList.length; k++) {
		displayTask(upcomingTaskList[k]);
	}
}

function displayCompletedTasks() {
	clearTaskList();
	projectList.forEach((project) => {
		project.getTasks().forEach((task) => {
			if (task.status) {
				displayTask(task);
			}
		});
	});
}

function removeAllTabActive() {
	const allNavTabs = document.querySelectorAll(".navtab");
	allNavTabs.forEach((tab) => tab.classList.remove("active"));
}

function setTabActive(navTab) {
	navTab.classList.add("active");
}

export { displayMainInfo, getProjectTask, closeTaskModal, showAddTaskBtn, displayProjectBaseOnChoice, taskList, inMainTab };
