	var color = Chart.helpers.color;
    var datasetValue = [];
    var kmeansLabels = JSON.parse(window.localStorage.getItem("kmeansLabels"));
    var numberOfClusters = Math.max.apply(Math, kmeansLabels)+1;
    var data = JSON.parse(window.localStorage.getItem("dataset_clustering"));
    var dataset_clustering_cols = JSON.parse(window.localStorage.getItem("dataset_clustering_cols"));
    var elbow_value = JSON.parse(window.localStorage.getItem("elbowValue"));
    var silhouetteValue = JSON.parse(window.localStorage.getItem("silhouetteValue"));
    var ctx;

    console.log(kmeansLabels);
    function getRandomColor() {
        var letters = '0123456789ABCDEF'.split('');
        var color = '#';
        for (var i = 0; i < 6; i++ ) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    function generateData(counter) {
        var dataset_coordinates=[];
        for (var i=0;i<data.length;i++) {
            if(kmeansLabels[i]==counter){
                dataset_coordinates.push({
                    x: (data[i])[parseInt(document.getElementById("xCord").value)],
                    y: (data[i])[(parseInt(document.getElementById("yCord").value))]
                });
            }
        }
        return dataset_coordinates;
    }

    var scatterChartData = {
        datasets:datasetValue
    };

    window.onload = function() {

        document.getElementById("elbowValue").innerHTML = elbow_value;
        document.getElementById("silhouetteValue").innerHTML = silhouetteValue;

        document.getElementById("xCord").addEventListener("change", function() {
            if(document.getElementById("xCord").value == document.getElementById("yCord").value)
            {
                alert("Choose different values.");
                document.getElementById("xCord").selectedIndex = JSON.parse(window.localStorage.getItem("lastX"));
            }
            else
            {
                plotPoints();
                window.myScatter.update();
                window.localStorage.setItem("lastX", JSON.stringify(document.getElementById("xCord").selectedIndex));
            }
        });

        document.getElementById("yCord").addEventListener("change", function() {
            if(document.getElementById("xCord").value == document.getElementById("yCord").value)
            {
                alert("Choose different values.");
                document.getElementById("yCord").selectedIndex = JSON.parse(window.localStorage.getItem("lastY"));
            }
            else
            {
                plotPoints();
                window.myScatter.update();
                window.localStorage.setItem("lastY", JSON.stringify(document.getElementById("yCord").selectedIndex));
            }
        });

        var cord = "";
        var value=0;
        labels = dataset_clustering_cols.split(',')
        for (var label of labels) {
            cord += "<option value=\""+value+"\">" + label + "</option>"
            value++;
        }
        document.getElementById("xCord").innerHTML = cord;
        document.getElementById("yCord").innerHTML = cord;
        document.getElementById("yCord").selectedIndex = 1;
        window.localStorage.setItem("lastX", JSON.stringify(document.getElementById("xCord").selectedIndex));
        window.localStorage.setItem("lastY", JSON.stringify(document.getElementById("yCord").selectedIndex));
        ctx = document.getElementById('canvas').getContext('2d');
        plotPoints();
    };

    function plotPoints(){
        for (var counter=0; counter<numberOfClusters; counter++) {
            datasetValue[counter] = {
                label: 'dataset '+(counter+1),
                borderColor: window.chartColors.black,
                backgroundColor: getRandomColor(),
                data: generateData(counter)
            }
        }

        window.myScatter = Chart.Scatter(ctx, {
            data: scatterChartData,
            options: {
                 tooltips: {
                     callbacks: {
                         label: function(tooltipItem, data) {
                            return "ID:" + tooltipItem.index +': ' + tooltipItem.yLabel + "," + tooltipItem.xLabel;
                         }
                     }
                 },
                title: {
                    display: true,
                    text: 'Clustering By Kmeans'
                },
            }
        });
    }