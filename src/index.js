import "./styles/website.css";

const hamburger = document.querySelector('.hamburger');
const sideNavbar = document.querySelector('.side-nav');

hamburger.addEventListener('click', () => {
   hamburger.classList.toggle('active');
   sideNavbar.classList.toggle('active');
})