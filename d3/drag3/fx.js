!function() {
    /* module for working with a particular one-parameter function -- call it f(x) */

    var fx
	= { /*procedure to evaluate f(x)*/
	    target_fn: null,
	    /* like target_fn(),  but returns a point */
	    eval_fn: null
	};

    /* target function f(x)
     * x :: number
     * returns :: number
     */
    fx.target_fn = function(x) {
	return x * x * (x - 0.6);
    } /*target_fn*/

    /* f(x), returns a point
     * x :: number
     * returns :: Point
     */
    fx.eval_fn = function(x_arg)
    {
	return {x: x_arg, y: fx.target_fn(x_arg)};
    } /*eval_fn*/

    /* given scale k, {offset_x, offset_y}
     * returns function
     *   f({x,y}) = {offset_x + scale*x, offset_y + scale*y}
     */
    fx.linear_fn = function(offset_pt, scale) {
	/* p :: Point */
	return function(p) {
	    return pt.add_pt(offset_pt,
			     pt.scale_pt(scale, p));
	}
    } /*linear_fn*/

    /* make an array of points, representing
     * fx evaluated at regularly-spaced intervals;
     * clip so that all points returned fall within the rectangle
     * defined by (0,0) and box_pt
     *
     * fx :: number -> Point
     * lo_x, hi_x :: number
     * n_pt :: number
     * box_pt :: Point
     */
    fx.make_target_pt_v = function(fx, lo_x, hi_x, n_pt, pt2screen, box_pt)
    {
	var target_pt_v = [];
	var target_pt_i = 0;
	var p = null;
	var pm1 = null;

	/* evaluate f(x) at regularly spaced x-coordinates on interval [lo_x, hi_x] 
	 * keep only points with screen coords that fall inside the rectangle
	 * with corners {(0,0), box_pt}, plus:
	 * one point just before and one point just after
	 */
	for(var i=0; i<n_pt; ++i) {
	    tmp = lo_x + (i * (hi_x - lo_x) / n_pt);
	    pm1 = p;
	    p = pt2screen(fx(tmp));

	    if(pt.box_contains(box_pt, p)) {
		if((pm1 !== null) && !pt.box_contains(box_pt, pm1)) {
		    /* pm1 outside box,  substitute clipped version */
		    target_pt_v[target_pt_i++] = pt.clip_line(pm1, p, box_pt);
		}
		target_pt_v[target_pt_i++] = p;
	    } else if((pm1 !== null) && pt.box_contains(box_pt, pm1)) {
		/* if pm1 was inside the box,  then include p 
		   after all */
		target_pt_v[target_pt_i++] = pt.clip_line(p, pm1, box_pt);
	    }
	}

	return target_pt_v;
    } /*make_target_pt_v*/

    this.fx = fx;
}();
