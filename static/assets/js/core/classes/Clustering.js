class Clustering {
  constructor(kmeansLabels,dataset_clustering,dataset_clustering_cols,ctx,xCord,yCord) {
    this.datasetValue = [];
    this.kmeansLabels = kmeansLabels;
    this.numberOfClusters = Math.max.apply(Math, kmeansLabels)+1;
    this.data = dataset_clustering;
    this.dataset_clustering_cols = dataset_clustering_cols;
    this.ctx=ctx;
    this.xCord=xCord;
    this.yCord=yCord;
    this.labelsInsert();
    this.scatter=window.myScatter;
  }

    plotPointsLoop(){
            for (var counter=0; counter<this.numberOfClusters; counter++) {
            this.datasetValue[counter] = {
                label: 'dataset '+(counter+1),
                borderColor: window.chartColors.black,
                backgroundColor: this.getRandomColor(),
                data: this.dataset_coordinates_func(counter)
            }
        }
    }

    plotPoints(){
        this.plotPointsLoop();
        window.myScatter = Chart.Scatter(this.ctx, {
            data: {
                datasets:this.datasetValue
            },
            options: {
                 tooltips: {
                     callbacks: {
                         label: function(tooltipItem, data) {
                            return "ID:" + this._data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].id +': ' + tooltipItem.yLabel + "," + tooltipItem.xLabel;
                         }
                     }
                 },
                title: {
                    display: true,
                    text: 'Clustering By Kmeans'
                },
            }
        });
        this.scatter=window.myScatter;
    }

    plotPoints(clustering2){
        this.plotPointsLoop();
        window.myScatter = Chart.Scatter(this.ctx, {
            data: {
                datasets:this.datasetValue
            },
            options: {
                 tooltips: {
                     callbacks: {
                         label: function(tooltipItem, data) {
                            return "ID:" + this._data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].id +': ' + tooltipItem.yLabel + "," + tooltipItem.xLabel;
                         }
                     }
                 },
                title: {
                    display: true,
                    text: 'Clustering By Kmeans'
                },
            }
        });
        this.scatter=window.myScatter;
    }


  labelsInsert(){
    var labels = this.dataset_clustering_cols.split(',');
    var cord = "";
    var value=0;
    for (var label of labels) {
        cord += "<option value=\""+value+"\">" + label + "</option>"
        value++;
    }

    this.xCord.innerHTML = cord;
    this.yCord.innerHTML = cord;
    this.yCord.selectedIndex = 1;
    window.localStorage.setItem("lastX", JSON.stringify(this.xCord.selectedIndex));
    window.localStorage.setItem("lastY", JSON.stringify(this.yCord.selectedIndex));
  }

  getRandomColor() {
        var letters = '0123456789ABCDEF'.split('');
        var color = '#';
        for (var i = 0; i < 6; i++ ) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
  }

  dataset_coordinates_func(counter) {
    var dataset_coordinates=[];
    for (var i=0;i<this.data.length;i++) {
        if(this.kmeansLabels[i]==counter){
            dataset_coordinates.push({
                x: (this.data[i])[parseInt(this.xCord.value)],
                y: (this.data[i])[(parseInt(this.yCord.value))],
                id: (this.data[i])[8]
            });
        }
    }
    return dataset_coordinates;
  }

  setElbowValue(elbowValue){
          document.getElementById("elbowValue").innerHTML = elbowValue;
  }

  setSilhouetteValue(silhouetteValue){
      document.getElementById("silhouetteValue").innerHTML = silhouetteValue;
  }

}