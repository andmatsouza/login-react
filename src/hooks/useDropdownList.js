import { useEffect } from "react";

export default function useDropdownList() {

  function actionDropdown(id) {    
    document.getElementById("actionDropdown" + id).classList.toggle("show-dropdown-action");
  }

  function closeDropdownAction() {
    const dropdowns = document.getElementsByClassName("dropdown-action-item");
      
    for (let i = 0; i < dropdowns.length; i++) {
       let openDropdown = dropdowns[i];
       if(openDropdown.classList.contains("show-dropdown-action")){
          openDropdown.classList.remove("show-dropdown-action");
       }
       
    }
  }

  useEffect(() => {
    window.onclick = function(event) {
      if(!event.target.matches('.dropdown-btn-action')) {         
         closeDropdownAction();
      }
   }
  });

 

  return {actionDropdown, closeDropdownAction}
}