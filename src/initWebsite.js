export default function initWebsite() {
   const mainTitle = document.querySelector(".main-title");
   const allNavTab = document.getElementById("all");

   // Set title to be on "All" main tab
   mainTitle.textContent = 'All'

   // Set focus on "All" main tab
   allNavTab.focus()
}