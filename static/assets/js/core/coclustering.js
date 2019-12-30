var lastX=[2];
var lastY=[2];

function addListenerToBar(xCord,yCord,index,clustering){
    xCord.addEventListener("change",function(){
            if(xCord.value == yCord.value)
        {
            alert("Choose different values.");
            xCord.selectedIndex = lastX[index];
        }
        else
        {
            clustering.plotPoints();
            window.myScatter.update();
            lastX[index]=xCord.selectedIndex;
        }
    });

    yCord.addEventListener("change",function(){
        if(xCord.value == yCord.value)
        {
            alert("Choose different values.");
            yCord.selectedIndex = lastY[index];
        }
        else
        {
            clustering.plotPoints();
            window.myScatter.update();
            lastY[index]=yCord.selectedIndex;
        }
    });
}

$(document).ready(function () {
    var task1 = JSON.parse(window.localStorage.getItem("task1"));
    var task2 = JSON.parse(window.localStorage.getItem("task2"));
    var coclusteringtable = JSON.parse(window.localStorage.getItem("coclusteringtable"));

    var ctx1=document.getElementById('canvas1').getContext('2d');
    var ctx2=document.getElementById('canvas2').getContext('2d');

    var xCord1=document.getElementById("xCord1");
    var xCord2=document.getElementById("xCord2");

    var yCord1=document.getElementById("yCord1");
    var yCord2=document.getElementById("yCord2");

    var kmeansLabels1 = JSON.parse(window.localStorage.getItem("labels1"));
    var data1 = task1[0].dataset;
    var dataset_clustering_cols1 = task1[0].datasetcols;

    var kmeansLabels2 = JSON.parse(window.localStorage.getItem("labels2"));
    var data2 = task2[0].dataset;
    var dataset_clustering_cols2 = task2[0].datasetcols;

    var clustering1=new Clustering(kmeansLabels1,data1,dataset_clustering_cols1,ctx1,xCord1,yCord1);
    var clustering2=new Clustering(kmeansLabels2,data2,dataset_clustering_cols2,ctx2,xCord2,yCord2);

    clustering1.plotPoints();

    clustering2.plotPoints();

    addListenerToBar(xCord1,yCord1,0,clustering1);
    addListenerToBar(xCord2,yCord2,1,clustering2);

    jexcelSpreadSheet = jexcel(document.getElementById('spreadsheet1'), {
        data: coclusteringtable,
        csvHeaders: false,
        loadingSpin: true,
        editable: false,
    });
});