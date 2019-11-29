	var color = Chart.helpers.color;
    var datasetValue = [];
    var kmeansLabels = JSON.parse(window.localStorage.getItem("kmeansLabels"));
    var numberOfClusters = Math.max.apply(Math, kmeansLabels)+1;
    var data = JSON.parse(window.localStorage.getItem("dataset_clustering"));
    var dataset_clustering_cols = JSON.parse(window.localStorage.getItem("dataset_clustering_cols"));
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
                        y: (data[i])[(parseInt(document.getElementById("yCord").value)+1)]
                    });
                }
			}
			return dataset_coordinates;
		}

		var scatterChartData = {
			datasets:datasetValue
		};

		window.onload = function() {

        var cord = "";
        var value=0;
        for (var label of dataset_clustering_cols) {
            cord += "<option value=\""+value+"\">" + label + "</option>"
            value++;
        }
        document.getElementById("xCord").innerHTML = cord;
        document.getElementById("yCord").innerHTML = cord;

		var temp=1;//delete me
		var mycolor=color(window.chartColors.blue).alpha(0.2).rgbString();//delete me

			var ctx = document.getElementById('canvas').getContext('2d');
            for (var counter=0; counter<numberOfClusters; counter++) {
                datasetValue[counter] = {
                    label: 'dataset '+(counter+1),
                    borderColor: window.chartColors.black,
                    backgroundColor: getRandomColor(),
                    data: generateData(counter)
			    }
                if(temp==1){//delete me
                    mycolor=color(window.chartColors.red).alpha(0.2).rgbString();//delete me
                    temp=2;//delete me
                }//delete me
            }
			window.myScatter = Chart.Scatter(ctx, {
				data: scatterChartData,
				options: {
					title: {
						display: true,
						text: 'Clustering By Kmeans'
					},
				}
			});

		};

		document.getElementById('randomizeData').addEventListener('click', function() {
			scatterChartData.datasets.forEach(function(dataset) {
				dataset.data = dataset.data.map(function() {
					return {
						x: randomScalingFactor(),
						y: randomScalingFactor()
					};
				});
			});
			window.myScatter.update();
		});
