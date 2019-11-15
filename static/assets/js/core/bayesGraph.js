		function getGraph() {
        var graph = jsbayes.newGraph();
        graph.saveSamples = true;
        
        var n1 = graph.addNode('n1', ['true', 'false']);
        var n2 = graph.addNode('n2', ['true', 'false']);
        var n3 = graph.addNode('n3', ['true', 'false']);
        var n4 = graph.addNode('n4', ['true', 'false']);
        var n5 = graph.addNode('n5', ['yes', 'maybe', 'no']);
        
        n2.addParent(n1);
        n3.addParent(n2);
        n3.addParent(n4);
        n5.addParent(n4);
        
        n1.setCpt([ 0.25, 0.75 ]);
        n2.setCpt([
          [ 0.8, 0.2 ],
          [ 0.2, 0.8 ]
        ]);
        n3.setCpt([
          [ 0.99, 0.01 ],
          [ 0.6, 0.4 ],
          [ 0.6, 0.4 ],
          [ 0.01, 0.99 ]
        ]);
        n4.setCpt([ 0.6, 0.4 ]);
        n5.setCpt([
          [ 0.6, 0.3, 0.1 ],
          [ 0.1, 0.3, 0.6 ]
        ]);
        
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
            height: 400,
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
