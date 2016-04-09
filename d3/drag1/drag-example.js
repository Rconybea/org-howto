!function() {
    var ex = {};

    var box_width = 800;
    var box_height = 400;

    ex.start = function(w)
    {
	"use strict";

	var box = (d3.select("#frame")
		   .append("svg")
		   .attr("class", "box")
		   .attr("width", box_width)
		   .attr("height", box_height)
		  );

	var circle = null;

	var drag = d3.behavior.drag()
	    .on("dragstart", function() { circle.style("fill", "red"); })
	    .on("drag", function() { circle.attr("cx", d3.event.x).attr("cy", d3.event.y); })
	    .on("dragend", function() { circle.style("fill", "black")});
	
	circle = box.selectAll(".draggableCircle")
	    .data([{x: (box_width / 2), y: (box_height / 2), r: 25}])
	    .enter()
	    .append("svg:circle")
	    .attr("class", "draggableCircle")
	    .attr("cx", function(d) { return d.x; })
	    .attr("cy", function(d) { return d.y; })
	    .attr("r", function(d) { return d.r; })
	    .call(drag)
	    .style("fill", "black");

	console.log("w=", w, ",this=", this);
    }

    this.ex = ex;
}();
