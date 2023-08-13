import { formatDate } from "./dateController.js";
import { taskList } from "./mainPageController.js";
import priorityFilledFlag from "./assets/flag-fill.svg";
import priorityNeutralFlag from "./assets/flag.svg";

// This will take the individual task from @param and create a list base on its info
function displayTask(task) {
	const taskInfoContainer = createElement("div", "task-info-container");
	const taskInnerTopContainer = createElement("div", "task-top-container");
	const taskInnerLeftContainer = createElement("div", "task-inner-left-container");
	const taskInnerRightContainer = createElement("div", "task-inner-right-container");
	const taskDescrContainer = createElement("div", "task-descr-container");

	// Create round checkbox
	const roundCheckbox = createRoundCheckbox();
	taskInnerLeftContainer.appendChild(roundCheckbox);

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

   // Attach listener to checkbox to have strikethrough on title and descr when active
   updateCheckboxStatus(roundCheckbox, taskInfoContainer, task);
   addCheckboxListener(roundCheckbox, taskInfoContainer, task);
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

let checkboxCounter = 0; // Initialize a counter for generating unique IDs
function createRoundCheckbox() {
	const uniqueId = `checkbox-${checkboxCounter++}`;
	const round = createElement("div", "roundCheckBtn");
	const checkbox = createInputById("input", "checkbox", uniqueId);
	const checkboxLabel = createElementLabel("label", uniqueId);

	round.appendChild(checkbox);
	round.appendChild(checkboxLabel);
	return round;
}


const checkboxListener = function(checkboxInput,taskContainer,task) {
   console.log("Checkbox state changed");

   if (checkboxInput.checked) {
      console.log("Checkbox is checked");
      task.setStatus(true);
      taskContainer.classList.add("taskComplete");
   } else {
      console.log("Checkbox is unchecked");
      task.setStatus(false);
      taskContainer.classList.remove("taskComplete");
   }
}

const checkboxEventListeners = []; // Create a list of listeners so we can remove them when we recreate the taskList
function addCheckboxListener(roundCheckboxContainer, taskContainer, task) {
   const checkboxInput = roundCheckboxContainer.querySelector('input');

   checkboxInput.addEventListener("change", checkboxListener.bind(null, checkboxInput,taskContainer, task));
   checkboxEventListeners.push({ checkboxInput, checkboxListener });
}

function clearTaskList() {
   // Remove event listeners before clearing the content
   checkboxEventListeners.forEach(entry => {
      console.log(`entry: ${entry}`)
      const { checkboxInput, checkboxListener } = entry; // Destructure the stored object
      checkboxInput.removeEventListener("change", checkboxListener);
   });

   // Clear the content
   taskList.textContent = "";
}


function updateCheckboxStatus(roundCheckboxContainer, taskContainer, task) {
   const status = task.getStatus();
   const checkboxInput = roundCheckboxContainer.querySelector('input');

   console.log(`updating: ${status}`)

   if (status) {
      checkboxInput.checked = true;
      taskContainer.classList.add("taskComplete");
   } else {
      checkboxInput.checked = false;
      taskContainer.classList.remove("taskComplete");
   }
}

function createElement(type, className) {
	const element = document.createElement(type);
	element.classList.add(className);
	return element;
}

function createInputById(type, inputType, idName) {
	const input = document.createElement(type);
	input.setAttribute("type", inputType);
	input.setAttribute("id", idName);
	return input;
}

function createElementLabel(type, forInput) {
	const element = document.createElement(type);
	element.setAttribute("for", forInput);
	return element;
}

export { displayTask, clearTaskList, createFlagBaseOnPriority, removeAllFlagPriority, priorityNeutralFlag };
