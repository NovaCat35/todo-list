import "./styles/website.css";
import './styles/modal.css';
import handleModalRequest from './modalHandler.js'

const hamburger = document.querySelector('.hamburger');
const sideNavbar = document.querySelector('.side-nav');
const newProjectBtn = document.querySelector('.new-project-btn')
const modalProjectContainer = document.querySelector('.project-modal-container')

hamburger.addEventListener('click', () => {
   hamburger.classList.toggle('active');
   sideNavbar.classList.toggle('active');
})

newProjectBtn.addEventListener('click', () => {
   modalProjectContainer.classList.toggle('hidden');
   handleModalRequest('addProject', modalProjectContainer);
})