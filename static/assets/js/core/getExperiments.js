$( document ).ready(function() { //get all the experiments from the database
  var userNameDB = JSON.parse(window.localStorage.getItem("userNameDB"));
  var experiments = JSON.parse(window.localStorage.getItem("experiments"));
  var j=0;
  for (exp of experiments) { //goes through all experiments and prints them on screen
       j=j+1;
          document.getElementById("p1").innerHTML = document.getElementById("p1").innerHTML +("<div class=\"col-lg-3 col-md-6 col-sm-6\">\n" +
                "            <div class=\"card card-stats\">\n" +
                "              <div class=\"card-body \">\n" +
                "                <div class=\"row\">\n" +
                "                  <div class=\"col-7 col-md-9\">\n" +
                "                    <div class=\"numbers\">\n" +
                "                      <p class=\"card-title text-left\">"+exp.experimentName+"</p>\n" +
                "                      <p class=\"card-category text-left\">"+exp.experimentDescription+"\n" +
                "                        <p>\n" +
                "                    </div>\n" +
                "                  </div>\n" +
                "                </div>\n" +
                "              </div>\n" +
                "              <div class=\"card-footer \">\n" +
                "                <hr>\n" +
                "                <div class=\"stats\">\n" +
                "                   <button class=\"btn btn-warning \" name="+exp.experimentName+" id="+exp.id+" href=\"#\" role=\"button\">Enter now</button>" +
                "                </div>\n" +
                "              </div>\n" +
                "            </div>\n" +
                "          </div>");
          }
  var buttons = document.getElementsByClassName('btn btn-warning');
  for (var i = 0; i < buttons.length; i++) { //create events for every experiment to save id and name of the experiment
      buttons[i].onclick = function(){
         var idExp= this.id;
          var expName=this.name;
          window.localStorage.setItem("idExp", JSON.stringify(idExp));
          window.localStorage.setItem("expName", JSON.stringify(expName));
          location.href = "../pages/tasks.html";
      };
  }
});