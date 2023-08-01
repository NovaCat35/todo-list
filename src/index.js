import "./styles/website.css";
import './styles/modal.css';
import { addNewProject } from "./projectController.js";
import fillMainInfo from './mainPageController.js'

const hamburger = document.querySelector('.hamburger');
const sideNavbar = document.querySelector('.side-nav');
const newProjectBtn = document.querySelector('.new-project-btn')
const navTabs = document.querySelectorAll('.navtab');

navTabs.forEach(tab =>  tab.addEventListener('click', (event) => fillMainInfo(event, 'mainTabInfo')))

hamburger.addEventListener('click', () => {
   hamburger.classList.toggle('active');
   sideNavbar.classList.toggle('active');
})

newProjectBtn.addEventListener('click', () => {
   addNewProject();
})