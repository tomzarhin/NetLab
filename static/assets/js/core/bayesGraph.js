
		function transpose(matrix) { //transpose matrix for Bayesian network uses.
            return Object.keys(matrix[0])
                .map(colNumber => matrix.map(rowNumber => rowNumber[colNumber]));
        }

		function getGraph() { //builds the Bayesian network visual graph, set parents, the connections between the nodes and the probabilities
        var categories = JSON.parse(window.localStorage.getItem("categories"));
        var dataset_k2 = JSON.parse(window.localStorage.getItem("dataset_k2"));
        var cpt_list = JSON.parse(window.localStorage.getItem("cpt_list")); //array of probabilities and conditional probabilities of all nodes
        var element_categories = JSON.parse(window.localStorage.getItem("element_categories"));
        var graph = jsbayes.newGraph();
        graph.saveSamples = true;
        var nodes=[];
        var vertices=[];
        for(var i=0;i<categories.length;i++) //build the array of all the vertices and their information(parents, probabilities of the experiment before they enter to the bayesian graph model.
        {
            for(var k=0;k<cpt_list.length;k++)
            {
                var name=(JSON.stringify(Object.keys(cpt_list[k]))).split("'");
                if(name[1]==categories[i])
                    break;
            }
            var cpts = Object.values(cpt_list[k]); //temporarily holds all probabilities
            cptsForBayes=transpose(cpts[0]);
            vertices.push(new Vertex(categories[i],element_categories[categories[i]],cptsForBayes));
        }

         for(i=0; i<vertices.length; i++) //add all the vertices to the graph.
             nodes[i]=graph.addNode((vertices[i].name).replace(/ /g,''), vertices[i].values);

         for(i=0; i<vertices.length; i++) //set the connection between the nodes (parents)
              for (j = 0; j < vertices.length; j++)
                    if ((dataset_k2[i][j]) == 1)
                        nodes[j].addParent(nodes[i]);

        for(var i=0;i<vertices.length;i++) //set the probabilities between the nodes (parents)
        {
            if((vertices[i].cpts).length==1)
                nodes[i].setCpt(vertices[i].cpts[0]);
            else
                nodes[i].setCpt(vertices[i].cpts);
        }
        graph.sample(20000);
        var g = jsbayesviz.fromGraph(graph);
        return g;
      }

      $(document).ready(function() { //paint the bayesian network graph on the screen
        (function(window) {
          var graph = getGraph();
          jsbayesviz.draw({
            id: '#bbn',
            width: 1500,
            height: 900,
            graph: graph,
            samples: 15000
          });

          $('#btnDownloadJson').click(function() {
            jsbayesviz.downloadSamples(graph, true);
          });

          $('#btnDownloadCsv').click(function() {
              var svgData = $("#bbn")[0].outerHTML;
              var svgBlob = new Blob([svgData], {type:"image/svg+xml;charset=utf-8"});
              var svgUrl = URL.createObjectURL(svgBlob);
              var downloadLink = document.createElement("a");
              downloadLink.href = svgUrl;
              downloadLink.download = "newesttree.svg";
              document.body.appendChild(downloadLink);
              downloadLink.click();
              document.body.removeChild(downloadLink);
              //document.body.removeChild(a);
              //jsbayesviz.downloadSamples(graph, false, { rowDelimiter: '\n', fieldDelimiter: ',' });
          });

        })(window);
      });
