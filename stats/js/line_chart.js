

var svg = d3.select("svg"),
    margin = {top: 20, right: 20, bottom: 20, left: 40},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var x = d3.scaleLinear()
    .domain([0, n - 1])
    .range([0, width]);

var y = d3.scaleLinear()
    .domain([622000,630000])
    .range([height, 0]);

var line = d3.line()
    .x(function(d, i) { return x(i); })
    .y(function(d, i) { return y(d); });

g.append("defs").append("clipPath")
    .attr("id", "clip")
  .append("rect")
    .attr("width", width)
    .attr("height", height);

var xAxis = d3.axisBottom(x);
var yAxis = d3.axisLeft(y);

g.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + y(0) + ")")
    .call(xAxis);

g.append("g")
    .attr("class", "axis axis--y")
    .call(yAxis);

g.append("g")
    .attr("clip-path", "url(#clip)")
  .append("path")
    .datum(data)
    .attr("class", "line")
  .transition()
    .duration(check_firebase_time_delta)
    .ease(d3.easeLinear)
    .on("start", tick);

function tick() {

        window.console.log("user online: " + get_metric_prefix(firebaseActiveUsers, 3) +
        ", user total: " + get_metric_prefix(firebaseTotalUsers, 3) +
        ", distance total: " + get_metric_prefix(firebaseTotalDistance, 3) +
        "m, score total: " + get_metric_prefix(firebaseTotalScore, 3));
  // Push a new data point onto the back.
  data.push(get_latest_data_point());

      //y.domain([d3.min(data),d3.max(data)])
      y.domain([622000,630000])
      console.log(firebaseTotalDistance)
    var svg_trans = svg.transition();

    // Make the changes
        svg_trans.select(".line")   // change the line
            .attr("d", line(data));

        //svg_trans.select(".axis.axis--x") // change the x axis
        //    .call(xAxis);
        svg_trans.select(".axis.axis--y") // change the y axis
            .call(yAxis);

  // Redraw the line.
  d3.select(this)
      .attr("d", line)
      .attr("transform", null);

  // Slide it to the left.
  d3.active(this)
      .attr("transform", "translate(" + x(-1) + ",0)")
    .transition()
      .on("start", tick);



  // Pop the old data point off the front.
  data.shift();

}
