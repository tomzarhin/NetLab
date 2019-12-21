var span;
var coModalButton;

$( document ).ready(function() {
  coModalButton = document.getElementById("coModalButton");
  span = document.getElementsByClassName("close")[0];
  var userNameDB = JSON.parse(window.localStorage.getItem("userNameDB"));
  var idExp = JSON.parse(window.localStorage.getItem("idExp"));
  var experiments = JSON.parse(window.localStorage.getItem("experiments"));

  /*var form_data = new FormData();
  form_data.append('userNameDB', userNameDB);
  form_data.append('idExp', idExp);
    $.ajax({
        type: 'POST',
        url: '/getTasks',
        data: form_data,
        contentType: false,
        cache: false,
        processData: false,
        success: function (data) {
            console.log('Success!');
        },
    })
        .done(function (data) {
            if (data.error) {
                confirm(data.error);
            }*/
            var j=0;

            for (exp of experiments.filter(x => x.id === parseInt(idExp))) {
            if(exp.task!=null){
                            for(task of exp.task){
                     j=j+1;
                        document.getElementById("p10").innerHTML = document.getElementById("p10").innerHTML +("<div class=\"col-lg-3 col-md-6 col-sm-6\"><div class=\"card card-stats\"><div class=\"card-body \">\n" +
                              "                <div class=\"row\">\n" +
                              "                  <div class=\"col-7 col-md-9\">\n" +
                              "                    <div class=\"numbers\">\n" +
                              "                      <p class=\"card-title text-left\">"+task.taskName+"</p>\n" +
                              "                      <p class=\"card-category text-left\">"+task.taskDescription+"\n" +
                              "                        <p>\n" +
                              "                    </div>\n" +
                              "                  </div>\n" +
                              "                </div>\n" +
                              "              </div>\n" +
                              "              <div class=\"card-footer \">\n" +
                              "                <hr>\n" +
                              "                <div class=\"stats\">\n" +
                              "                   <button class=\"btn btn-warning \" name=\"taskButton\" id="+task.task_id+" href=\"#\" role=\"button\">Enter now</button>" +
                              "                </div>\n" +
                              "              </div>\n" +
                              "            </div>\n" +
                              "          </div>");
                          }
            }

                    }


            var buttons = document.getElementsByName('taskButton');



            for (var i = 0; i < buttons.length; i++) {
                buttons[i].onclick = function(){
                    var idTask= this.id;
                    var idExpArray = experiments.findIndex(x => x.id === parseInt(idExp));
                    var idTaskArray = experiments[idExpArray].task.findIndex(x => x.task_id === parseInt(idTask))
                    window.localStorage.setItem("idTask", JSON.stringify(idTask));
                    window.localStorage.setItem("taskName", JSON.stringify(experiments[idExpArray].task[idTaskArray].taskName));
                    location.href = "../pages/dataset.html";

                };
            }


        //});

// When the user clicks the button, open the modal
coModalButton.onclick = function() {
  coModal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  coModal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == coModal) {
    coModal.style.display = "none";
  }
}

});

