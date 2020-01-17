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

    var dataLength=data1[0].length;
    for(i=0;i<data1.length;i++)
        data1[i][dataLength] = i+1;

    var dataLength=data2[0].length;
    for(i=0;i<data2.length;i++)
        data2[i][dataLength] = i+1;

    var clustering1=new Clustering(kmeansLabels1,data1,dataset_clustering_cols1,ctx1,xCord1,yCord1,JSON.parse(window.localStorage.getItem("taskName1")));
    var clustering2=new Clustering(kmeansLabels2,data2,dataset_clustering_cols2,ctx2,xCord2,yCord2,JSON.parse(window.localStorage.getItem("taskName2")));

    clustering1.plotPoints();

    clustering2.plotPoints();


    addListenerToBar(xCord1,yCord1,0,clustering1);
    addListenerToBar(xCord2,yCord2,1,clustering2);
    var cell;
    var subcluster;
    var row;
    var co_length=coclusteringtable.length;
  var table = document.getElementById("myTable");
  header = table.insertRow(0);
  header.style.backgroundColor = "red";
  head_cell=header.insertCell(0);
        head_cell.style.position = "absolute";
        head_cell.style.textAlign="left";
      head_cell.style.backgroundImage = "url('../assets/img/table.png')";
     head_cell.style.color = "white";

head_cell.innerHTML='&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp'+JSON.parse(window.localStorage.getItem("taskName2"))+'<br>'+ JSON.parse(window.localStorage.getItem("taskName1"));
  for(var i=0;i<co_length;i++ ){
    head_cell=header.insertCell(i+1);
    head_cell.innerHTML='U'+(i+1);
    head_cell.style.backgroundColor = "#2980B9";
     head_cell.style.color = "white";
    subcluster=coclusteringtable[i]
    row = table.insertRow(-1);
    cell = row.insertCell(0);
    cell.innerHTML = "V"+(i+1);
    cell.style.backgroundColor = "#2980B9";
    cell.style.color = "white";
        for(var j=0;j<subcluster.length;j++){
              cell = row.insertCell(j+1);
              cell.innerHTML = subcluster[j];
              cell.style.backgroundColor = "#F8F8F8";
        }
  }

    function TriggerAnotherValue(clustering,idx,numOfGroup) {
      var meta = (clustering.scatter).getDatasetMeta(numOfGroup);
        rect = (clustering.scatter).canvas.getBoundingClientRect();
        point = meta.data[idx].getCenterPoint();
        evt = new MouseEvent('mousemove', {
          clientX: rect.left + point.x,
          clientY: rect.top + point.y
        }),
        node = (clustering.scatter).canvas;
      node.dispatchEvent(evt);
    }
            window.myScatter = Chart.Scatter(clustering1.ctx, {
            data: {
                datasets:clustering1.datasetValue
            },
            options: {
                 tooltips: {
                     callbacks: {
                         label: function(tooltipItem, data) {
                            var index;
                            var numOfGroup;
                            for(i=0;i<clustering2.scatter.tooltip._data.datasets[0].data.length;i++)
                            {
                                if(parseInt(clustering2.scatter.tooltip._data.datasets[0].data[i].id) == this._data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].id)
                                {
                                    index=i;
                                    numOfGroup=0;
                                }
                            }
                            for(i=0;i<clustering2.scatter.tooltip._data.datasets[1].data.length;i++)
                            {
                                 if(parseInt(clustering2.scatter.tooltip._data.datasets[1].data[i].id) == this._data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].id)
                                    {
                                        index=i;
                                        numOfGroup=1;
                                    }
                            }
                            TriggerAnotherValue(clustering2,index,numOfGroup);
                            return "ID:" + this._data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].id +': ' + tooltipItem.yLabel + "," + tooltipItem.xLabel;
                         }
                     }
                 },
                title: {
                    display: true,
                    text: JSON.parse(window.localStorage.getItem("taskName1"))
                },
            }
        });
                    window.myScatter = Chart.Scatter(clustering2.ctx, {
            data: {
                datasets:clustering2.datasetValue
            },
            options: {
                 tooltips: {
                     callbacks: {
                         label: function(tooltipItem, data) {
                            TriggerAnotherValue(clustering1,0);
                            return "ID4:" + this._data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].id +': ' + tooltipItem.yLabel + "," + tooltipItem.xLabel;
                         }
                     }
                 },
                title: {
                    display: true,
                    text: JSON.parse(window.localStorage.getItem("taskName2"))
                },
            }
        });
});