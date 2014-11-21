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

  var clusterPoints = [];
  var clusterRange = 45;

  var grid = svg.append('g')
    .attr('class', 'grid');

  for (var x = 0; x <= width; x += clusterRange) {
    for (var y = 0; y <= height; y+= clusterRange) {
      grid.append('rect')
        .attr({
          x: x,
          y: y,
          width: clusterRange,
          height: clusterRange,
          class: "grid"
        });
    }
  }
});
