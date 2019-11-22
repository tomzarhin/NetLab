	var color = Chart.helpers.color;
    var datasetValue = [];
    var kmeansLabels = JSON.parse(window.localStorage.getItem("kmeansLabels"));
    var numberOfClusters = Math.max.apply(Math, kmeansLabels)+1;
    var data = JSON.parse(window.localStorage.getItem("dataset"));
    console.log(kmeansLabels);

		function generateData(counter) {
            var dataset_coordinates=[];
            for (var i=0;i<data.length;i++) {
                if(kmeansLabels[i]==counter){
                    dataset_coordinates.push({
                        x: (data[i])[0],
                        y: (data[i])[1]
                    });
                }
			}
			return dataset_coordinates;
		}

		var scatterChartData = {
			datasets:datasetValue
		};

		window.onload = function() {

		var temp=1;//delete me
		var mycolor=color(window.chartColors.blue).alpha(0.2).rgbString();//delete me

			var ctx = document.getElementById('canvas').getContext('2d');
            for (var counter=0; counter<numberOfClusters; counter++) {
                datasetValue[counter] = {
                    label: 'dataset '+(counter+1),
                    borderColor: window.chartColors.black,
                    backgroundColor: mycolor,//color(window.chartColors.blue).alpha(0.2).rgbString(),
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