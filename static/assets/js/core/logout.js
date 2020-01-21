window.onunload = function () {
           var user = JSON.parse(window.localStorage.getItem("user"));
           var date=user["date"];
           var today = new Date();
           var dd = String(today.getDate()).padStart(2, '0');
           var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
           var yyyy = today.getFullYear();

           today = mm + '/' + dd + '/' + yyyy;
           if(today!==date){
               localStorage.clear();
           }
}

window.onload = function () {
document.getElementById("logoutBtn").addEventListener("click", function(){
  localStorage.clear();
  location.href = "/";
});
    if (window.localStorage.length == 0) {
        location.href = "/";
    };
}