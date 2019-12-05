		function getGraph() {
        var categories = JSON.parse(window.localStorage.getItem("categories"));
        categories = categories.split(",");
        var dataset_k2 = JSON.parse(window.localStorage.getItem("dataset_k2"));


        var graph = jsbayes.newGraph();
        graph.saveSamples = true;
        var nodes=[];
        var countOfParents=[];
         for(i=0; i<categories.length; i++)
         {
             nodes[i]=graph.addNode(categories[i], ['true', 'false']);
             countOfParents[i]=0;
         }

        for(i=0; i<categories.length; i++)
        {
            for (j = 0; j < categories.length; j++)
            {
                if ((dataset_k2[i][j]) == 1)
                {
                    nodes[j].addParent(nodes[i]);
                    countOfParents[j] = countOfParents[j] + 1;
                }
            }
        }

        for(i=0;i<countOfParents.length;i++)
        {
            if(countOfParents[i]==0)
                nodes[i].setCpt([ 0.25, 0.75 ]);
            if(countOfParents[i]==1)
            {
                        nodes[i].setCpt([
                          [ 0.8, 0.2 ],
                          [ 0.2, 0.8 ]
                        ]);
            }
            if(countOfParents[i]==2)
            {
                        nodes[i].setCpt([
                          [ 0.8, 0.2 ],
                          [ 0.2, 0.8 ],
                          [ 0.8, 0.2 ],
                          [ 0.2, 0.8 ]
                        ]);
            }
            if(countOfParents[i]==3)
            {
                nodes[i].setCpt([
                  [ 0.8, 0.1,0.1 ],
                  [ 0.8, 0.1,0.1 ],
                  [ 0.8, 0.1,0.1 ],
                  [ 0.8, 0.1,0.1 ],
                  [ 0.8, 0.1,0.1 ],
                  [ 0.8, 0.1,0.1 ],
                  [ 0.8, 0.1,0.1 ],
                  [ 0.8, 0.1,0.1 ]
        ]);
            }
        }

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
