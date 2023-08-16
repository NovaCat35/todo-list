import { createNewProject } from "./modalHandler.js";
import { projectList } from "./projectController.js";

/**
 * Manage all the local storage saves here
 */
function updateProjectToStorage() {
	// Extract the relevant data (properties) since JSON cant store functions/methods
	const serializedProjects = projectList.map((project) => {
		return {
			title: project.title,
			tasks: project.getTasks(),
		};
	});

	const serializedObject = JSON.stringify(serializedProjects);
	localStorage.setItem("projectList", serializedObject);

	console.log(JSON.parse(localStorage.getItem("projectList")));
}

function getProjectFromStorage() {
	const serializedObject = localStorage.getItem("projectList");

	if (serializedObject) {
		const storedSerializedProjects = JSON.parse(serializedObject);

		const deserializedObject = storedSerializedProjects.map((projectData) => {
			const tasksList = projectData.tasks;
			const project = createNewProject(projectData.title);

			// Here, we manually assign back the tasklist to each project object
			tasksList.forEach((task) => project.setTask(task.title, task.description, task.priority, task.date, task.status));
			return project;
		});

		console.log(`This array of objects:`, deserializedObject);

		// Access one of the project objects
		const firstProject = deserializedObject[0]; // Replace 0 with the desired index
		console.log(firstProject);

		// Call a method from the project object
		const tassks = firstProject.getTasks();
      console.log(`tasks! ${tassks[0]}`)
	} else {
		console.log("No serialized object found in local storage.");
	}
}

export { updateProjectToStorage, getProjectFromStorage };
