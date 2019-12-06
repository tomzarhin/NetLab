$( document ).ready(function() {
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
                        document.getElementById("p10").innerHTML = document.getElementById("p10").innerHTML +("<div class=\"col-lg-3 col-md-6 col-sm-6\">\n" +
                              "            <div class=\"card card-stats\">\n" +
                              "              <div class=\"card-body \">\n" +
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
                              "                   <button class=\"btn btn-warning \" name="+task.taskName+" id="+task.task_id+" href=\"#\" role=\"button\">Enter now</button>" +
                              "                </div>\n" +
                              "              </div>\n" +
                              "            </div>\n" +
                              "          </div>");
                          }
            }

                    }
                                                                document.getElementById("p10").innerHTML = document.getElementById("p10").innerHTML +(" <div class=\"col-lg-3 col-md-6 col-sm-6\">\n" +
                                                        "                    <div class=\"card card-stats\">\n" +
                                                        "                        <div class=\"card-body \">\n" +
                                                        "                            <div class=\"row\">\n" +
                                                        "\n" +
                                                        "                                <div class=\"col-7 col-md-8\">\n" +
                                                        "                                    <div class=\"numbers text-left\">\n" +
                                                        "                                        <p class=\"card-category\">New Task</p>\n" +
                                                        "                                    </div>\n" +
                                                        "                                </div>\n" +
                                                        "                                <div class=\"col-3 col-md-4\">\n" +
                                                        "                                    <div class=\"icon-big text-left icon-warning\">\n" +
                                                        "                                        <i class=\"nc-icon nc-simple-add text-warning\"></i>\n" +
                                                        "                                    </div>\n" +
                                                        "                                </div>\n" +
                                                        "                            </div>\n" +
                                                        "                        </div>\n" +
                                                        "                        <center>\n" +
                                                        "                            <div class=\"card-footer \">\n" +
                                                        "                                <hr>\n" +
                                                        "                                <div class=\"stats \">\n" +
                                                        "                                    <a class=\"btn btn-warning \" href=\"newTask.html\" role=\"button\">Create now</a>\n" +
                                                        "                                </div>\n" +
                                                        "                            </div>\n" +
                                                        "                        </center>\n" +
                                                        "                    </div>\n" +
                                                        "\n" +
                                                        "                </div>");
            var buttons = document.getElementsByClassName('btn btn-warning');
            for (var i = 0; i < buttons.length; i++) {
                buttons[i].onclick = function(){
                    var idTask= this.id;
                    var taskName=this.name;
                    window.localStorage.setItem("idTask", JSON.stringify(idTask));
                    window.localStorage.setItem("taskName", JSON.stringify(taskName));
                    location.href = "../pages/dataset.html";

                };
            }
        //});
});