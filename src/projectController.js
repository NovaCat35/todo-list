import deleteSvg from "./assets/delete-icon.svg";
import editSvg from "./assets/edit-icon.svg";
import handleModalRequest from "./modalHandler.js";
import {displayMainInfo} from "./mainPageController.js"

let projectList = [];
const projectContainer = document.querySelector(".project-container");
const modalProject = document.querySelector(".project-modal-background");

function addNewProject() {
	openProjectModal("addProject");
	handleModalRequest("addProject");
}

/*****
 * Setup the project modal's name and btn to show 'New Project'
 * Since we're also using the same modal for 'Edit Project'
 *****/
function openProjectModal(projectType) {
	if (projectType === "addProject") {
		document.querySelector(".project-modal-header").textContent = "New Project";
		document.querySelector(".modal-project-btn").textContent = "Add";
	} else {
		document.querySelector(".project-modal-header").textContent = "Edit Project";
		document.querySelector(".modal-project-btn").textContent = "Edit";
	}
	modalProject.classList.remove("hidden");
}

// Create the DOM element for containers (Title) and options for edits & delete
function createProjectElement(title) {
	const projectNavLink = createElement("div", "project-link-div");
	projectNavLink.setAttribute("data-project-id", title);
	projectNavLink.setAttribute("tabindex", 0);

	const projectTitle = createElement("p", "project-title");
	projectTitle.textContent = title;
	projectNavLink.appendChild(projectTitle);

	const iconDivider = createElement("div", "icon-divider");
	createEditIcon(iconDivider);
	createDeleteIcon(iconDivider);

	projectNavLink.appendChild(iconDivider);
	projectContainer.appendChild(projectNavLink);

	// Add eventListener to display Project's title and other info within main container 
	projectNavLink.addEventListener('click', (event) => displayMainInfo(event, 'projectTabInfo'))
}

// Function to remove the project element from the DOM and list
function removeProjectElement(projectId) {
	const projectElement = document.querySelector(`[data-project-id="${projectId}"]`);
	if (projectElement) {
		projectList = projectList.filter(project => project.title != projectId)
		projectElement.remove();
	}
}

function createEditIcon(iconDivider) {
	const editIcon = createElement("img", "editIcon");
	editIcon.src = editSvg;

	editIcon.addEventListener("click", (event) => {
		// we need the list-container parent since we're starting from icon
		const oldTitle = event.target.parentNode.parentNode.getAttribute("data-project-id");
		openProjectModal("editProject");
		handleModalRequest("editProject", oldTitle);
	});

	iconDivider.appendChild(editIcon);
}

function createDeleteIcon(iconDivider) {
	const deleteIcon = createElement("img", "deleteIcon");
	deleteIcon.src = deleteSvg;

	deleteIcon.addEventListener('click', (event) => {
		const selectedProjectListID = event.target.parentNode.parentNode.getAttribute("data-project-id"); //this is the data attribute ID of the selected projectList
		removeProjectElement(selectedProjectListID)
	})

	iconDivider.appendChild(deleteIcon);
}

// Function to replace the original project link with the new edit title & the data attribute ID too
function replaceProjectElement(oldProjectLinkId, newTitle) {
	const projectLink = document.querySelector(`[data-project-id="${oldProjectLinkId}"]`); 
	const projectTitle =  projectLink.querySelector('.project-title')
	projectTitle.textContent = newTitle;
	projectLink.setAttribute('data-project-id', newTitle);
}

function createElement(type, className) {
	const element = document.createElement(type);
	element.classList.add(className);
	return element;
}

export { projectList, addNewProject, createProjectElement, replaceProjectElement };
