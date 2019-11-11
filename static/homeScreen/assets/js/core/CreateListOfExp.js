var exp;

var j=0;

for (exp of experiments) {
    j=j+1;
  document.write("<div class=\"col-lg-3 col-md-6 col-sm-6\">\n" +
          "            <div class=\"card card-stats\">\n" +
          "              <div class=\"card-body \">\n" +
          "                <div class=\"row\">\n" +
          "                  <div class=\"col-7 col-md-8\">\n" +
          "                    <div class=\"numbers\">\n" +
          "                      <p class=\"card-category text-left\">"+exp.ename+"</p>\n" +
          "                      <p class=\"card-title text-left\">"+exp.desc+"\n" +
          "                        <p>\n" +
          "                    </div>\n" +
          "                  </div>\n" +
          "                </div>\n" +
          "              </div>\n" +
          "              <div class=\"card-footer \">\n" +
          "                <hr>\n" +
          "                <div class=\"stats\">\n" +
          "                   <button class=\"btn btn-warning \" id=\"button="+j+"\" href=\"#\" role=\"button\">Create now</button>" +
          "                </div>\n" +
          "              </div>\n" +
          "            </div>\n" +
          "          </div>");
}

var buttons = document.getElementsByClassName("btn btn-warning");
var buttonsCount = buttons.length;
//for (var i = 0; i <= buttonsCount; i += 1) {
//    buttons[i].onclick = function(e) {
//        alert(this.id);
//    };
//}
