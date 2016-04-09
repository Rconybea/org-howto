!function() {
    var pt_svg = {};

    /* set x1,y1,x2,y2 attributes on an svg line object l,
     * (actually on d3 selection representing that object)
     * to pt1.x,pt1.y,pt2.x,pt2.y respectively
     *
     * line :: d3sel(svg:rect)
     */
    pt_svg.svg_line_redraw = function(line, pt1, pt2)
    {
	line
	    .attr("x1", pt1.x)
	    .attr("y1", pt1.y)
	    .attr("x2", pt2.x)
	    .attr("y2", pt2.y);

	return line;
    } /*svg_line_redraw*/

    /* set cx,cy attributes on an svg circle attribute c
     * (actually on d3 selection representing that object
     * to center_pt1.x, center_pt1.y)
     */
    pt_svg.svg_circle_recenter = function(circle, center_pt)
    {
	circle
	    .attr("cx", center_pt.x)
	    .attr("cy", center_pt.y);

	return circle;
    } /*svg_circle_recenter*/

    this pt_svg = pt_svg;
}();
