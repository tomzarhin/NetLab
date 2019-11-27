$( document ).ready(function() {
  var userNameDB = JSON.parse(window.localStorage.getItem("userNameDB"));
  var idExp = JSON.parse(window.localStorage.getItem("idExp"));
  var form_data = new FormData();
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
            }
            var j=0;
            for (task of data.tasks) {
                 j=j+1;
                    document.getElementById("p10").innerHTML = document.getElementById("p10").innerHTML +("<div class=\"col-lg-3 col-md-6 col-sm-6\">\n" +
                          "            <div class=\"card card-stats\">\n" +
                          "              <div class=\"card-body \">\n" +
                          "                <div class=\"row\">\n" +
                          "                  <div class=\"col-7 col-md-8\">\n" +
                          "                    <div class=\"numbers\">\n" +
                          "                      <p class=\"card-category text-left\">"+task.taskName+"</p>\n" +
                          "                      <p class=\"card-title text-left\">"+task.taskDescription+"\n" +
                          "                        <p>\n" +
                          "                    </div>\n" +
                          "                  </div>\n" +
                          "                </div>\n" +
                          "              </div>\n" +
                          "              <div class=\"card-footer \">\n" +
                          "                <hr>\n" +
                          "                <div class=\"stats\">\n" +
                          "                   <button class=\"btn btn-warning \" id=\"button="+task.id+"\" href=\"#\" role=\"button\">Enter now</button>" +
                          "                </div>\n" +
                          "              </div>\n" +
                          "            </div>\n" +
                          "          </div>");
                    }
            var buttons = document.getElementsByClassName('btn btn-warning');
            for (var i = 0; i < buttons.length; i++) {
                buttons[i].onclick = function(){
                    var idExp= this.id;
                    window.localStorage.setItem("idExp", JSON.stringify(idExp));
                };
            }
        });
});