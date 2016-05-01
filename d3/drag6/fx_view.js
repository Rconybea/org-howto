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

	    /* svg line representing the tangent to f(x) at a point x0 */
	    dfx_line: null,

	    /* svg element to display a selected point on f(x) */
	    fx_select_circle: null,
	    /* function to update selection given mouse coords */
	    fx_update_select: null,

	    /* function to invoke when a drag event occurs */
	    drag_function : null
	};

    fx_view.init_fn
	= function(target_fn, target_fn_deriv)
    {
	fx_view.target_fn = target_fn;
	fx_view.target_deriv_fn = target_fn_deriv;
	fx_view.target_pt_fn = fx.make_pt_fn(target_fn);
    } /*init_fn*/

    fx_view.init_xyscale
	= function(box_pt, scale_factor, lo_x, hi_x, lo_y, hi_y)
    {
	/* domain = natural coords;
	 * range  = screen coords
	 * 
	 * 0.0 -> 0.5*box_pt.x
	 * 1.0 -> 0.5*box_pt.x + 200
	 */
	var xscale = d3.scale.linear()
	    .domain([lo_x,
		     hi_x])
	    .range([0.0 + 50, box_pt.x - 50]);
	var yscale = d3.scale.linear()
	    .domain([lo_y, hi_y])
	    .range([box_pt.y - 50, 0.0 + 50]);

	fx_view.box_pt = box_pt;
	fx_view.xyscale = new xyscale(xscale, yscale);
    } /*init_xyscale*/

    fx_view.init_target_pt_v
	= function(lo_x, hi_x, n_pt)
    {
	fx_view.target_pt_v
	    = fx.make_target_pt_v(fx_view.target_pt_fn,
				  lo_x, hi_x, n_pt,
				  fx_view.xyscale, fx_view.box_pt);
    } /*init_target_pt_v*/

    fx_view.init_sequence
	= function(target_fn, target_deriv_fn,
		   box_pt, scale_factor,
		   lo_x, hi_x, lo_y, hi_y, n_pt)
    {
	fx_view.init_fn(target_fn, target_deriv_fn);
	fx_view.init_xyscale(box_pt, scale_factor, lo_x, hi_x, lo_y, hi_y);
	fx_view.init_target_pt_v(lo_x, hi_x, n_pt);
	fx_view.init_drag_function();
    } /*init_sequence*/

    /* function to create an SVG approximation to a parametric function 
     * using a series of straight line segments
     */
    fx_view.svg_line_fn = (d3.svg.line()
			   .x(function(d) { return d.x; })
			   .y(function(d) { return d.y; })
			   .interpolate("linear"));

    /* redraw tangent function at (natural) x-coordinate x0 
     */
    fx_view.fx_update_tangent_fn
	= function(x0, box_pt)
    {
	fx_view.fx_tangent_fn
	    = fx.make_tangent_pt_fn(x0, fx_view.target_fn, fx_view.target_deriv_fn);

	var lh_edge = fx_view.xyscale.xscale.invert(0.0 /*screen x-coord*/);
	var rh_edge = fx_view.xyscale.xscale.invert(box_pt.x /*screen x-coord*/);

	var dd = [{pt1: fx_view.xyscale.scale_pt(fx_view.fx_tangent_fn(lh_edge)),
		   pt2: fx_view.xyscale.scale_pt(fx_view.fx_tangent_fn(rh_edge))}];

	fx_view.dfx_line = (fx_view.box.selectAll(".dfxline")
			    .data(dd));

	/* create (if needed) svg line representing 
	 * tangent to our target function f(x) at x0 
	 */
	fx_view.dfx_line
	    .enter()
	    .append("svg:line")
	    .attr("class", "dfxline")
	    .attr("stroke", "gray")
	    .attr("stroke-width", 1);

	fx_view.dfx_line
	    .attr("x1", function(d) { return d.pt1.x; })
	    .attr("y1", function(d) { return d.pt1.y; })
	    .attr("x2", function(d) { return d.pt2.x; })
	    .attr("y2", function(d) { return d.pt2.y; })
    } /*fx_update_tangent_fn*/

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

    /* parent_id :: string.  pass this to d3.select()
     * box_pt :: Point.  size of svg bounding box
     */
    fx_view.draw_bounding_box = function(parent_id, box_pt)
    {
	var box = (d3.select(parent_id)
		   .append("svg")
		   .attr("class", "box")
		   .attr("width", box_pt.x)
		   .attr("height", box_pt.y));
	return box;
    } /*draw_bounding_box*/

    fx_view.draw_border = function(box_pt, box)
    {
	var border = (box.append("svg:rect")
		      .attr("class", "border")
		      .attr("x", 1)
		      .attr("y", 1)
		      .attr("width", box_pt.x - 2)
		      .attr("height", box_pt.y - 2)
		      .attr("stroke", "navy")
		      .attr("stroke-width", 3)
		      .style("fill", "none"));
	return border;
    } /*draw_border*/

    /* box :: Svg
     * xyscale :: Xyscale
     */
    fx_view.draw_x_axis = function(box_pt, box, xyscale)
    {
	var x_axis = (d3.svg.axis()
		      .scale(xyscale.xscale)
		      .orient("bottom"));

	box.append("svg:g")
	    .attr("class", "axis")
	    .attr("transform", "translate(0," + xyscale.yscale(0.0) + ")")
	    .call(x_axis);

	return x_axis;
    } /*draw_x_axis*/
 
    /* box :: Svg
     * xyscale :: Xyscale
     */
    fx_view.draw_y_axis = function(box_pt, box, xyscale)
    {
	var y_axis = (d3.svg.axis()
		      .scale(xyscale.yscale)
		      .orient("left"));

	box.append("svg:g")
	    .attr("class", "axis")
	    .attr("transform", "translate(" + xyscale.xscale(0.0) + ",0)")
	    .call(y_axis);

	return y_axis
    } /*draw_y_axis*/
 
    /* box :: Svg
     * target_pt_v :: [Point]
     * return :: Svg.path
     */
    fx_view.draw_fx_path = function(box, target_pt_v)
    {
	/* create path representing our target function f(x) */
	var fx_path = (fx_view.box.append("path")
		       .attr("d", fx_view.svg_line_fn(target_pt_v))
		       .attr("stroke", "navy")
		       .attr("stroke-width", 2)
		       .attr("fill", "none")
		      );

	return fx_path;
    } /*draw_fx_path*/

    /* parent_id :: string.  pass this to d3.select() to get selection for parent
     *   at which to attach svg box
     * xyscale :: Xyscale
     */
    fx_view.draw = function(parent_id)
    {
	/* create an svg bounding box, to contain interactive drawing area */
	fx_view.box = fx_view.draw_bounding_box(parent_id, fx_view.box_pt);

	/* border, so bounding box is visible */
	fx_view.border = fx_view.draw_border(fx_view.box_pt, fx_view.box);

	/* create axes.. */
	fx_view.draw_x_axis(fx_view.box_pt, fx_view.box, fx_view.xyscale);
	fx_view.draw_y_axis(fx_view.box_pt, fx_view.box, fx_view.xyscale);

	/* create path representing our target function f(x) */
	fx_view.fx_path = fx_view.draw_fx_path(fx_view.box, fx_view.target_pt_v);

	fx_view.fx_update_tangent_fn(fx_view.xyscale.xscale.invert(0.5 * fx_view.box_pt.x),
				     fx_view.box_pt);

	fx_view.fx_update_select_circle(pt.find_closest(pt.scale_pt(0.5, fx_view.box_pt),
							fx_view.target_pt_v));
    } /*draw*/

    /* update selection circle
     * for an event at Point pt
     *
     * xyscale :: Xyscale
     */
    fx_view.fx_update_select
	= function(p, box_pt, target_pt_v, xyscale)
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
	
	/* update tangent function */
	fx_view.fx_update_tangent_fn(xyscale.xscale.invert(perp_pt.x),
				     box_pt, xyscale);

	/* update draggable circle location */
	fx_view.fx_update_select_circle(perp_pt);
    } /*fx_update_select*/
  
    fx_view.init_drag_function
	= function()
    {
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
		       fx_view.fx_update_select(d3.event,
						fx_view.box_pt,
						fx_view.target_pt_v,
						fx_view.xyscale);
		   })
	       .on("dragend",
		   function() {
		       fx_view.fx_select_circle
			   .style("fill", "black")
			   .attr("r", 4);
		   })
	      );
    };

    this.fx_view = fx_view;
}();
