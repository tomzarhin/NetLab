var lastX;
var lastY;
window.onload = function() { //build the clustering model graph by using the database
    var kmeansLabels = JSON.parse(window.localStorage.getItem("kmeansLabels"));
    var data = JSON.parse(window.localStorage.getItem("dataset_clustering"));
    var dataset_clustering_cols = JSON.parse(window.localStorage.getItem("dataset_clustering_cols"));
    var elbow_value = JSON.parse(window.localStorage.getItem("elbowValue"));
    var silhouetteValue = JSON.parse(window.localStorage.getItem("silhouetteValue"));
    var ctx=document.getElementById('canvas').getContext('2d');
    var xCord=document.getElementById("xCord");
    var yCord=document.getElementById("yCord");
    var dataLength=data[0].length;
    for(i=0;i<data.length;i++)
        data[i][dataLength] = i+1;
    var clustering=new Clustering(kmeansLabels,data,dataset_clustering_cols,ctx,xCord,yCord);
    clustering.setElbowValue(elbow_value);
    clustering.setSilhouetteValue(silhouetteValue);
    clustering.plotPoints();

    xCord.addEventListener("change",function(){ //change the parameter of x-axis for clustering analyze
            if(xCord.value == yCord.value)
        {
            alert("Choose different values.");
            xCord.selectedIndex = lastX;
        }
        else
        {
            clustering.plotPoints();
            window.myScatter.update();
            lastX=xCord.selectedIndex;
        }
    } );

    yCord.addEventListener("change",function(){ //change the parameter of y-axis for clustering analyze
        if(xCord.value == yCord.value)
        {
            alert("Choose different values.");
            yCord.selectedIndex = lastY;
        }
        else
        {
            clustering.plotPoints();
            window.myScatter.update();
            lastY=yCord.selectedIndex;
        }
    } );

};