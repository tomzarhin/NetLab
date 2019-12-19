		function transpose(matrix) {
            return Object.keys(matrix[0])
                .map(colNumber => matrix.map(rowNumber => rowNumber[colNumber]));
        }
		function getGraph() {
        var categories = JSON.parse(window.localStorage.getItem("categories"));
        categories = categories.split(",");
        var dataset_k2 = JSON.parse(window.localStorage.getItem("dataset_k2"));
        var cpt_list = JSON.parse(window.localStorage.getItem("cpt_list"));
        var graph = jsbayes.newGraph();
        graph.saveSamples = true;
        var nodes=[];
        var vertices=[];
        for(var i=0;i<categories.length;i++)
        {
            for(var k=0;k<cpt_list.length;k++)
            {
                var index=0;
                var name=(JSON.stringify(Object.keys(cpt_list[k]))).split("'");
                if(name[1]==categories[i])
                    break;
            }
            var cpts = Object.values(cpt_list[k]);
            if (cpts[0].length == 3)
                values=['true', 'false','maybe'];
            else
                values=['true', 'false'];
            cpt0=cpts[0];
            if (cpt0[0].length != null)
            {
                cptsForBayes=transpose(cpts[0]);
                vertices.push(new Vertex(categories[i],values,cptsForBayes));
            }
             else
                vertices.push(new Vertex(categories[i],values,cpts[0]));
        }

         for(i=0; i<vertices.length; i++)
             nodes[i]=graph.addNode(vertices[i].name, vertices[i].values);

         for(i=0; i<vertices.length; i++)
              for (j = 0; j < vertices.length; j++)
                    if ((dataset_k2[i][j]) == 1)
                        nodes[j].addParent(nodes[i]);

        for(var i=0;i<vertices.length;i++)
            nodes[i].setCpt(vertices[i].cpts);
        graph.sample(20000);
        var g = jsbayesviz.fromGraph(graph);
        return g;
      }

      $(document).ready(function() {
        (function(window) {
          var graph = getGraph();
          jsbayesviz.draw({
            id: '#bbn',
            width: 800,
            height: 650,
            graph: graph,
            samples: 15000
          });

          $('#btnDownloadJson').click(function() {
            jsbayesviz.downloadSamples(graph, true);
          });

          $('#btnDownloadCsv').click(function() {
            jsbayesviz.downloadSamples(graph, false, { rowDelimiter: '\n', fieldDelimiter: ',' });
          });
        })(window);
      });
