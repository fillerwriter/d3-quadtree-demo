var width = 960,
  height = 500;

var svg = d3.select("#map").append("svg")
  .attr("width", width)
  .attr("height", height);

var g = svg.append("g");

var projection = d3.geo.albers();
var path = d3.geo.path().projection(projection).pointRadius(1);
var active = d3.select(null);
var quadtree;

d3.json("json/data.json", function(error, geoData) {
  if (error) return console.error(error);

  var points = topojson.feature(geoData, geoData.objects.points);
  var states = topojson.feature(geoData, geoData.objects.states);

  g.selectAll(".state")
    .data(states.features)
    .enter().append("path")
    .attr("class", function(d) {return "state state-" + d.properties.postal;})
    .attr("d", path);

  g.selectAll(".point")
    .data(points.features)
    .enter().append("path")
    .attr("class", "point")
    .attr("d", path);
  //
  //var dealerRaw = dealers.features.map(function(d, i) {
  //  var point = path.centroid(d);
  //  point.push(i);
  //  return point;
  //});

  //quadtree = d3.geom.quadtree()
  //  .extent([[-1, -1], [width + 1, height + 1]]);
  //
  //g.selectAll(".city")
  //  .data(cities.features)
  //  .enter().append("path")
  //  .attr("class", function(d) {return "city"})
  //  .attr("d", path);
  //
  //var svgDealer = g.selectAll(".dealer")
  //  .data(dealerRaw);
  //
  //svgDealer.enter().append("circle")
  //  .attr("class", function(d) {return "dealer"})
  //  .attr("cx", function(d) {return d[0];})
  //  .attr("cy", function(d) {return d[1];})
  //  .attr("r", 2);
  //
  //var quadtree = d3.geom.quadtree()
  //(dealerRaw);
  //
  //g.selectAll(".node")
  //  .data(nodes(quadtree))
  //  .enter().append("rect")
  //  .attr("class", "node")
  //  .attr("x", function(d) { return d.x; })
  //  .attr("y", function(d) { return d.y; })
  //  .attr("width", function(d) { return d.width; })
  //  .attr("height", function(d) { return d.height; });
  //
  //// Collapse the quadtree into an array of rectangles.
  //function nodes(quadtree) {
  //  var nodes = [];
  //  quadtree.visit(function(node, x1, y1, x2, y2) {
  //    nodes.push({x: x1, y: y1, width: x2 - x1, height: y2 - y1});
  //  });
  //  return nodes;
  //}
  //
  //// Find the nodes within the specified rectangle.
  //function search(quadtree, x0, y0, x3, y3) {
  //  var validData = [];
  //  svgDealer.each(function(d) {d.selected = false; });
  //  quadtree.visit(function(node, x1, y1, x2, y2) {
  //    var p = node.point;
  //    if (p) {
  //      p.selected = (p[0] >= x0) && (p[0] < x3) && (p[1] >= y0) && (p[1] < y3);
  //      if (p.selected) {
  //        validData.push(p);
  //      }
  //    }
  //    return x1 >= x3 || y1 >= y3 || x2 < x0 || y2 < y0;
  //  });
  //  return validData;
  //}
  //
  //var clusterPoints = [];
  //var clusterRange = 30;
  //
  //for (var x = 0; x <= width; x += clusterRange) {
  //  for (var y = 0; y <= height; y+= clusterRange) {
  //    var searched = search(quadtree, x, y, x + clusterRange, y + clusterRange);
  //    svgDealer.classed("selected", function(d) { return d.selected; });
  //
  //    var centerPoint = searched.reduce(function(prev, current) {
  //      return [prev[0] + current[0], prev[1] + current[1]];
  //    }, [0, 0]);
  //
  //    centerPoint[0] = centerPoint[0] / searched.length;
  //    centerPoint[1] = centerPoint[1] / searched.length;
  //
  //    if (centerPoint[0] && centerPoint[1]) {
  //      clusterPoints.push(centerPoint);
  //    }
  //  }
  //}
  //
  //g.selectAll(".centerPoint")
  //  .data(clusterPoints)
  //  .enter().append("circle")
  //  .attr("class", function(d) {return "centerPoint"})
  //  .attr("cx", function(d) {return d[0];})
  //  .attr("cy", function(d) {return d[1];})
  //  .attr("fill", '#FFA500')
  //  .attr("r", 6);
});
