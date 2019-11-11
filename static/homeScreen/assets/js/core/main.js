    var experiments = [];
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
            alert("data.experiments");
        });
});