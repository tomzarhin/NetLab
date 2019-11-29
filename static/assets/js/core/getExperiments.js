$( document ).ready(function() {
  var userNameDB = JSON.parse(window.localStorage.getItem("userNameDB"));
  var experiments = JSON.parse(window.localStorage.getItem("experiments"));
  /*var form_data = new FormData();
  form_data.append('userNameDB', userNameDB);
    $.ajax({
        type: 'POST',
        url: '/getExperiments',
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
            for (exp of experiments) {
                 j=j+1;
                    document.getElementById("p1").innerHTML = document.getElementById("p1").innerHTML +("<div class=\"col-lg-3 col-md-6 col-sm-6\">\n" +
                          "            <div class=\"card card-stats\">\n" +
                          "              <div class=\"card-body \">\n" +
                          "                <div class=\"row\">\n" +
                          "                  <div class=\"col-7 col-md-8\">\n" +
                          "                    <div class=\"numbers\">\n" +
                          "                      <p class=\"card-category text-left\">"+exp.experimentName+"</p>\n" +
                          "                      <p class=\"card-title text-left\">"+exp.experimentDescription+"\n" +
                          "                        <p>\n" +
                          "                    </div>\n" +
                          "                  </div>\n" +
                          "                </div>\n" +
                          "              </div>\n" +
                          "              <div class=\"card-footer \">\n" +
                          "                <hr>\n" +
                          "                <div class=\"stats\">\n" +
                          "                   <button class=\"btn btn-warning \" id="+exp.id+" href=\"#\" role=\"button\">Enter now</button>" +
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
                    location.href = "../pages/tasks.html";
                };
            }
        //});
});