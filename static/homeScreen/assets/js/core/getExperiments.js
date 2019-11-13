//   var experiments = [];
//for (i = 1; i < 5; i++) {
//  x1=i;
//   x2="this "+i;
//    new experiment(x1,x2);
//}
$( document ).ready(function() {
    $.ajax({
        type: 'POST',
        url: '/getExperiments',
        data: false,
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
            for (exp of data.experiments) {
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
                          "                   <button class=\"btn btn-warning \" id=\"button="+j+"\" href=\"#\" role=\"button\">Create now</button>" +
                          "                </div>\n" +
                          "              </div>\n" +
                          "            </div>\n" +
                          "          </div>");
                    }
                    var buttons = document.getElementsByClassName("btn btn-warning");
                    var buttonsCount = buttons.length;
            });
});