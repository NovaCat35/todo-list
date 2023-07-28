function handleModalRequest(modalType, modalElement) {
   if(modalType == 'addProject') {
      addProject(modalElement)
   }
}

function addProject(modalElement) {
   const projectForm = document.querySelector('.project-modal-container form')
   const addProjectBtn = document.querySelector('.modal-add-project-btn');
   const cancelBtn = document.querySelector('.modal-cancel-btn')

   addProjectBtn.addEventListener('click', (event) => {
      if(projectForm.checkValidity()) {
         event.preventDefault();
         console.log('Adding project')
      }
   })
   cancelBtn.addEventListener('click', (event) => {
      modalElement.classList.add('hidden')
   })
} 

export default handleModalRequest;