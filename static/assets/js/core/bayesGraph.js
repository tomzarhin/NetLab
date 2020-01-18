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

var exportSVG = function(svg) {
  // first create a clone of our svg node so we don't mess the original one
  var clone = svg.cloneNode(true);
  // parse the styles
  parseStyles(clone);

  // create a doctype
  var svgDocType = document.implementation.createDocumentType('svg', "-//W3C//DTD SVG 1.1//EN", "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd");
  // a fresh svg document
  var svgDoc = document.implementation.createDocument('http://www.w3.org/2000/svg', 'svg', svgDocType);
  // replace the documentElement with our clone
  svgDoc.replaceChild(clone, svgDoc.documentElement);
  // get the data
  var svgData = (new XMLSerializer()).serializeToString(svgDoc);
  return(svgData);

};

var parseStyles = function(svg) {
  var styleSheets = [];
  var i;
  // get the stylesheets of the document (ownerDocument in case svg is in <iframe> or <object>)
  var docStyles = svg.ownerDocument.styleSheets;

  // transform the live StyleSheetList to an array to avoid endless loop
  for (i = 0; i < docStyles.length; i++) {
    styleSheets.push(docStyles[i]);
  }

  if (!styleSheets.length) {
    return;
  }

  var defs = svg.querySelector('defs') || document.createElementNS('http://www.w3.org/2000/svg', 'defs');
  if (!defs.parentNode) {
    svg.insertBefore(defs, svg.firstElementChild);
  }
  svg.matches = svg.matches || svg.webkitMatchesSelector || svg.mozMatchesSelector || svg.msMatchesSelector || svg.oMatchesSelector;


  // iterate through all document's stylesheets
  for (i = 0; i < styleSheets.length; i++) {
    var currentStyle = styleSheets[i]

    var rules;
    try {
      rules = currentStyle.cssRules;
    } catch (e) {
      continue;
    }
    // create a new style element
    var style = document.createElement('style');
    // some stylesheets can't be accessed and will throw a security error
    var l = rules && rules.length;
    // iterate through each cssRules of this stylesheet
    for (var j = 0; j < l; j++) {
      // get the selector of this cssRules
      var selector = rules[j].selectorText;
      // probably an external stylesheet we can't access
      if (!selector) {
        continue;
      }

      // is it our svg node or one of its children ?
      if ((svg.matches && svg.matches(selector)) || svg.querySelector(selector)) {

        var cssText = rules[j].cssText;
        // append it to our <style> node
        style.innerHTML += cssText + '\n';
      }
    }
    // if we got some rules
    if (style.innerHTML) {
      // append the style node to the clone's defs
      defs.appendChild(style);
    }
  }

};

$(document).ready(function() { //paint the bayesian network graph on the screen
    (function(window) {
      var graph = getGraph();
      jsbayesviz.draw({
        id: '#bbn',
        width: 1500,
        height: 700,
        graph: graph,
        samples: 15000
      });

      $('#btnDownloadJson').click(function() {
        jsbayesviz.downloadSamples(graph, true);
      });

      $('#btnDownloadCsv').click(function() {
          var svgData=exportSVG(document.getElementById('bbn'));
          var a = document.getElementById('btnDownloadCsv');
          a.href = 'data:image/svg+xml; charset=utf8, ' + encodeURIComponent(svgData.replace(/></g, '>\n\r<'));
          a.download = 'Bayesian Network model.svg';
          //document.body.removeChild(a);
          //jsbayesviz.downloadSamples(graph, false, { rowDelimiter: '\n', fieldDelimiter: ',' });
      });
    })(window);
});


