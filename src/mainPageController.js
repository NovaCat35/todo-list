export default function displayMainInfo(event, navTabInfo) {
	const mainTitle = document.querySelector(".main-title");
	let targetName = null;

	if (navTabInfo == "mainTabInfo") {
		targetName = event.target.id;
	} else {
		targetName = event.target.getAttribute("data-project-id");
	}
   // Show title page
	mainTitle.textContent = targetName;

   // Display add new task otherwise no
}
