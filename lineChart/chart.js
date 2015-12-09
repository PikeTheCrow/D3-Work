var w = 800;
var h = 450;
var margin = {
	top: 58,
	bottom: 100,
	left: 80,
	right: 40
};

var width = w - margin.left - margin.right;
var height = h - margin.top - margin.bottom;

var svg = d3.select("body").append("svg")
			.attr("id", "chart")
			.attr("width", w)
			.attr("height", h);
var chart = svg.append("g")
			.classed("display", true)
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var datePaser = d3.time.format("%Y/%m/%d").parse;

//scaling
var x = d3.time.scale()
					.domain(d3.extent(data, function (d) {
						var date = datePaser(d.date);
						return date;
					}))
					.range([0, width]);
var y = d3.scale.linear()
					.domain([0, d3.max(data, function(d) {
						return d.value;
					})])
					.range([height, 0]);

//create AXIS
var xAxis = d3.svg.axis()
							.scale(x)
							.orient("bottom")
							.ticks(d3.time.days, 7)
							.tickFormat(d3.time.format("%m/%d"));
var yAxis = d3.svg.axis()
							.scale(y)
							.orient("left")
							.ticks(5);

//path element svg
var line = d3.svg.line()
							.x(function(d) {
								var date = datePaser(d.date);
								return x(date);
							})
							.y(function(d) {
								return y(d.value);
							})
							.interpolate("cardinal");

//area element svg
var area = d3.svg.area()
							.x(function(d) {
								var date = datePaser(d.date);
								return x(date);
							})
							.y0(height)
							.y1(function(d) {
								return y(d.value);
							})
							.interpolate("cardinal");

//the function to plot the chart
function plot(params) {
	//create the axis
	this.append("g")
			.classed("x axis", true)
			.attr("transform", "translate(0, " + height + ")")
			.call(params.axis.x);
	this.append("g")
			.classed("y axis", true)
			.attr("transform", "translate(0, 0)")
			.call(params.axis.y);

	//enter
		//area
		this.selectAll(".area")
					.data([params.data])
					.enter()
						.append("path")
						.classed("area", true);
		//path
		this.selectAll(".trendline")
					.data([params.data])
					.enter()
						.append("path")
						.classed("trendline", true);
		//circle
	this.selectAll(".point")
			.data(params.data)
			.enter()
				.append("circle")
				.classed("point", true)
				.attr("r", 2);

	//update
	this.selectAll(".area")
			.attr("d", function(d) {
				return area(d);
			})

	this.selectAll(".trendline")
			.attr("d", function(d) {
				return line(d);
			})

	this.selectAll(".point")
			.attr("cx", function(d) {
				var date = datePaser(d.date);
				return x(date);
			})
			.attr("cy", function(d) {
				return y(d.value);
			})

	//exit
	this.selectAll(".area")
			.data([params.data])
			.exit()
			.remove();

	this.selectAll(".trendline")
			.data([params.data])
			.exit()
			.remove();

	this.selectAll(".point")
			.data(params.data)
			.ext()
			.remove();
}

plot.call(chart, {
	data: data,
	axis: {
		x: xAxis,
		y: yAxis
	}
});
