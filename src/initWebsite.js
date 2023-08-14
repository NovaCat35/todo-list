import { checkTaskListEmpty } from "./taskCreator.js";

export default function initWebsite() {
   const mainTitle = document.querySelector(".main-title");
   const allNavTab = document.getElementById("All");

   // Set title to be on "All" main tab
   mainTitle.textContent = 'All'

   // Set focus on "All" main tab
   allNavTab.classList.add('active');
   checkTaskListEmpty();
}