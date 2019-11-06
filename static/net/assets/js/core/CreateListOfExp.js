var i;
    var experiments = [];
for (i = 1; i < 5; i++) {
    experiments.push(new experiment("Exp1","This is exp1"));
}
for (exp of experiments) {
  document.write("<div class=\"col-lg-3 col-md-6 col-sm-6\">\n" +
          "            <div class=\"card card-stats\">\n" +
          "              <div class=\"card-body \">\n" +
          "                <div class=\"row\">\n" +
          "                  <div class=\"col-5 col-md-4\">\n" +
          "                    <div class=\"icon-big text-center icon-warning\">\n" +
          "                      <i class=\"nc-icon nc-globe text-warning\"></i>\n" +
          "                    </div>\n" +
          "                  </div>\n" +
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
          "                  <i class=\"fa fa-refresh\"></i> Enter Dataset\n" +
          "                </div>\n" +
          "              </div>\n" +
          "            </div>\n" +
          "          </div>");
}
