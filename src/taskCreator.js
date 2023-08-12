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
   taskInnerLeftContainer.appendChild(roundCheckbox)

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

function createRoundCheckbox() {
	const round = createElement("div", "roundCheckBtn");
	const checkbox = createInputById("input", "checkbox");
	const checkboxLabel = createElementLabel("label", "checkbox");

	round.appendChild(checkbox);
	round.appendChild(checkboxLabel);
	return round;
}

function createElement(type, className) {
	const element = document.createElement(type);
	element.classList.add(className);
	return element;
}

function createInputById(type, idName) {
	const input = document.createElement(type);
	input.setAttribute("id", idName);
   input.setAttribute("type", idName);
	return input;
}

function createElementLabel(type, forInput) {
	const element = document.createElement(type);
	element.setAttribute("for", forInput);
	return element;
}

export { displayTask, createFlagBaseOnPriority, removeAllFlagPriority, priorityNeutralFlag };
