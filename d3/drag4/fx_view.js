!function() {
    /* module for displaying a function f(x) using svg,
     * together with a draggable point that's constrained to lie on the function
     *
     * uses: module point.js
     */

    /* view elements - things we see on the screen */
    var fx_view
	= { /* procedure to setup this view */
	    draw: null,
	    /* svg bounding box */
	    box: null,
	    /* svg path representing points {x,f(x)} */
	    fx_path: null,
	    /* function to generate a path from a vector of points */
	    svg_line_fn: null,
	    /* svg element to display a selected point on f(x) */
	    fx_select_circle: null,
	    /* function to update selection given mouse coords */
	    fx_update_select: null,
	    /* function to invoke when a drag event occurs */
	    drag_function : null
	};

    /* function to create an SVG approximation to a parametric function 
     * using a series of straight line segments
     */
    fx_view.svg_line_fn = (d3.svg.line()
			   .x(function(d) { return d.x; })
			   .y(function(d) { return d.y; })
			   .interpolate("linear"));

    /* create/update selection circle - intended to mark
     * location of selected point pt
     */
    fx_view.fx_update_select_circle
	= function(pt)
    {
	var dd = [{center: pt, radius: 4}];

	fx_view.fx_select_circle = (fx_view.box.selectAll(".fxselect")
				    .data(dd));

	/* create draggable circle representing a selected point on f(x) */
	fx_view.fx_select_circle
	    .enter()
	    .append("svg:circle")
	    .attr("class", "fxselect")
	    .call(fx_view.drag_function)
	    .attr("r", function(d) { return d.radius; })
	    .style("fill", "black");

	fx_view.fx_select_circle
	    .attr("cx", function(d) { return d.center.x; })
	    .attr("cy", function(d) { return d.center.y; });
    } /*fx_update_select_circle*/

    /* parent_id :: string.  pass this to d3.select() to get selection for parent
     *   at which to attach svg box
     * box_pt :: Point.  size of svg bounding box
     */
    fx_view.draw = function(parent_id, box_pt, target_pt_v) {
	/* create an svg bounding box, to contain interactive drawing area */
	fx_view.box = (d3.select(parent_id)
		       .append("svg")
		       .attr("class", "box")
		       .attr("width", box_pt.x)
		       .attr("height", box_pt.y));

	/* border, so bounding box is visible */
	fx_view.border = (fx_view.box.append("svg:rect")
			  .attr("class", "border")
			  .attr("x", 1)
			  .attr("y", 1)
			  .attr("width", box_pt.x - 2)
			  .attr("height", box_pt.y - 2)
			  .attr("stroke", "blue")
			  .attr("stroke-width", 3)
			  .style("fill", "none"));

	/* create path representing our target function f(x) */
	fx_view.fx_path = (fx_view.box.append("path")
			   .attr("d", fx_view.svg_line_fn(target_pt_v))
			   .attr("stroke", "blue")
			   .attr("stroke-width", 2)
			   .attr("fill", "none")
			  );

	fx_view.fx_update_select_circle(pt.find_closest(pt.scale_pt(0.5, box_pt),
							target_pt_v));
    } /*draw*/

    /* update selection circle
     * for an event at Point pt
     */
    fx_view.fx_update_select
	= function(p, target_pt_v)
    {
	/* find point on {x,f(x)} that's closest to 
	 * mouse location (i.e. to d3.event)
	 */
	var mid_pt_ix
	    = pt.find_closest_ix(p, target_pt_v);

	/* establish three neighboring points;
	 * ideally around best_px_ix,  but stay within target_pt_v
	 */
	if(mid_pt_ix - 1 < 0)
	    ++mid_pt_ix;
	if(mid_pt_ix + 1 >= target_pt_v.length)
	    --mid_pt_ix;

	var pt0 = target_pt_v[mid_pt_ix - 1];
	var pt1 = target_pt_v[mid_pt_ix];
	var pt2 = target_pt_v[mid_pt_ix + 1];

	/* find best points on line segments [pt0,pt1] and [pt1,pt2] respectively */
	var perp_lo_pt = pt.find_perpendicular(d3.event, pt0, pt1, true /*clip_flag*/);
	var perp_hi_pt = pt.find_perpendicular(d3.event, pt1, pt2, true /*clip_flag*/);

	/* choose nearest of perp_lo_pt and perp_hi_pt */
	var perp_pt = pt.find_closest(d3.event, [perp_lo_pt, perp_hi_pt]);
	
	/* update draggable circle location */
	fx_view.fx_update_select_circle(perp_pt);
    } /*fx_update_select*/
  
    fx_view.init_drag_function
	= (function(target_pt_v) {
	    fx_view.drag_function
		= (d3.behavior.drag()
		   .on("dragstart",
		       function() {
			   fx_view.fx_select_circle
			       .style("fill", "red")
			       .attr("r", 5);
		       })
		   .on("drag",
		       function() {
			   fx_view.fx_update_select(d3.event, ex.target_pt_v);
		       })
		   .on("dragend",
		       function() {
			   fx_view.fx_select_circle
			       .style("fill", "black")
			       .attr("r", 4);
		       })
		  );
	});

    this.fx_view = fx_view;
}();
