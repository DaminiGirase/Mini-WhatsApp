
let deleteDemo = document.querySelectorAll(".btn1");

for(btns of deleteDemo){
       btns.addEventListener("click", (event) => {

       let permission = confirm("Are you shure you want delete"); 

       if(!permission){
          event.preventDefault();
        }
});
}        
