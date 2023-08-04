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
	let targetName = null;

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
}

function displayTask(projectName) {
	const taskList = document.querySelector(".task-list");
	const targetProjectInfo = projectList.find((project) => project.title == projectName);

	// Clear the existing task list
	taskList.textContent = "";

	// Loop through tasks and create task elements
	targetProjectInfo.getTasks().forEach((task) => {
		const taskElement = document.createElement("div");
      taskElement.classList.add('task-info-container')
		taskElement.textContent = task.title; 
		taskList.appendChild(taskElement);
	});
}

// -----------------------
// track if the listener is added
let isAddTaskBtnListenerAdded = false; 

function addTaskBtn(targetProjectName) {
   // Initial setup reveal "Add Task" btn
   const addTaskBtn = document.querySelector('.add-task-btn');
   addTaskBtn.classList.remove('hidden');

   // Check if the event listener is already added before adding it
   if (!isAddTaskBtnListenerAdded) {
      addTaskBtn.addEventListener('click', () => {
         addTaskBtn.classList.add('hidden');
         showTaskModal(targetProjectName);
      });

      // Set the flag to indicate that the event listener has been added
      isAddTaskBtnListenerAdded = true;
   }
}



function showTaskModal(targetProjectName) {
	const taskModal = document.querySelector(".task-modal-container");
	taskModal.classList.remove("hidden");
	handleModalRequest("addTask", targetProjectName);
}

export { displayMainInfo, displayTask };
