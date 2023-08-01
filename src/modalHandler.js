import { projectList, createProjectElement, replaceProjectElement } from "./projectController.js";

const modalProject = document.querySelector(".project-modal-background");
const projectForm = document.querySelector(".project-modal-container form");
const addProjectBtn = document.querySelector(".modal-project-btn");
const cancelBtn = document.querySelector(".modal-cancel-btn");
let oldProjectLink = null

let editMode = false; // Add a flag to track the edit mode

// modalElement being the modalProjectContainer or the modalTaskContainer
export default function handleModalRequest(modalType, projectId = null) {
   oldProjectLink = projectId
	switch (modalType) {
		case "addProject":
			editMode = false; // Set edit mode to false for adding a new project
			addProject();
			break;
		case "editProject":
			editMode = true; // Set edit mode to true for editing an existing project
			editProject(projectId);
			break;
		default:
			break;
	}
}

/******
 * Check and input & tag the add listeners for the buttons on the modal.
 * This function will also add the project to the projectList and create/add new project DOM element to the sidebar
 *******/
function addProject() {
	addProjectBtn.addEventListener("click", onProjectClick);
	cancelBtn.addEventListener("click", clearProjectModal);
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
            replaceProjectElement(oldProjectLink, title)
			}
		} else {
			// If in add mode, create a new project
			projectList.push(createProjectList(title));
			createProjectElement(title);
		}
		clearProjectModal();
	}
}

function createProjectList(title) {
	return { title, tasks: [] };
}

function clearProjectModal() {
	document.getElementById("project-name").value = "";
	modalProject.classList.add("hidden");
}
