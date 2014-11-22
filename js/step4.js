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

  var pointsRaw = points.features.map(function(d, i) {
    var point = path.centroid(d);
    point.push(i);
    return point;
  });

  quadtree = d3.geom.quadtree()(pointsRaw);

  // Find the nodes within the specified rectangle.
  function search(quadtree, x0, y0, x3, y3) {
    var validData = [];
    quadtree.visit(function(node, x1, y1, x2, y2) {
      var p = node.point;
      if (p) {
        p.selected = (p[0] >= x0) && (p[0] < x3) && (p[1] >= y0) && (p[1] < y3);
        if (p.selected) {
          validData.push(p);
        }
      }
      return x1 >= x3 || y1 >= y3 || x2 < x0 || y2 < y0;
    });
    return validData;
  }

  var clusterPoints = [];
  var clusterRange = 45;

  for (var x = 0; x <= width; x += clusterRange) {
    for (var y = 0; y <= height; y+= clusterRange) {

      var searched = search(quadtree, x, y, x + clusterRange, y + clusterRange);

      var centerPoint = searched.reduce(function(prev, current) {
        return [prev[0] + current[0], prev[1] + current[1]];
      }, [0, 0]);

      centerPoint[0] = centerPoint[0] / searched.length;
      centerPoint[1] = centerPoint[1] / searched.length;
      centerPoint.push(searched);

      if (centerPoint[0] && centerPoint[1]) {
        clusterPoints.push(centerPoint);
      }
    }
  }

  var pointSizeScale = d3.scale.linear()
    .domain([
      d3.min(clusterPoints, function(d) {return d[2].length;}),
      d3.max(clusterPoints, function(d) {return d[2].length;})
    ])
    .rangeRound([3, 15]);

  g.selectAll(".centerPoint")
    .data(clusterPoints)
    .enter().append("circle")
    .attr("class", function(d) {return "centerPoint"})
    .attr("cx", function(d) {return d[0];})
    .attr("cy", function(d) {return d[1];})
    .attr("fill", '#FFA500')
    .attr("r", function(d, i) {return pointSizeScale(d[2].length);})
    .on("click", function(d, i) {
      console.log(d, pointSizeScale(d[2].length));
    })
});
