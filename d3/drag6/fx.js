!function() {
    /* module for working with a particular one-parameter function -- call it f(x) */

    var fx
	= { /*procedure to evaluate f(x)*/
	    target_fn: null,
	    /* like target_fn(),  but returns a point */
	    eval_fn: null
	};

    /* the (linear) function of (x) that is
     * tangent to fx.target_fn at x0
     */
    fx.make_tangent_fn = function(x0, fn, fn_deriv) {
	var fx0 = fn(x0);
	var dfx0 = fn_deriv(x0);

	return function(x) { return fx0 + (x - x0) * dfx0; }
    } /*make_tangent_fn*/

    /* f :: num -> num
     * returns pf :: num -> Point,  pf(x) = {x: x, y: f(x)}
     */
    fx.make_pt_fn = function(f) {
	return function(x) { return {x: x, y: f(x)}; };
    } /*make_pt_fn*/

    /* x0 :: num
     * fn :: num -> num
     * fn_deriv :: num -> num
     * returns :: (num -> Point)
     */
    fx.make_tangent_pt_fn = function(x0, fn, fn_deriv) {
	return fx.make_pt_fn(fx.make_tangent_fn(x0, fn, fn_deriv));
    } /*make_tangent_pt_fn*/

    /* transform points using d3 scales
     *   f({x,y}) = {xscale(x),yscale(y)}
     *
     * xscale :: D3scale
     * yscale :: D3scale
     */
    fx.scale_fn = function(xscale, yscale)
    {
	return function(p) {
	    return {x: xscale(p.x), y: yscale(p.y)};
	}
    } /*scale_fn*/

    /* transform points using d3 scales, inverted
     *   f({x,y}) = {xscale.invert(x),yscale.invert(y)}
     *
     * xscale :: D3scale
     * yscale :: D3scale
     */
    fx.invert_scale_fn = function(xscale, yscale)
    {
	return function(p) {
	    return {x: xscale.invert(p.x), y: yscale.invert(p.y)};
	}
    } /*invert_scale_fn*/

    /* make an array of points, representing
     * fx evaluated at regularly-spaced intervals;
     * clip so that all points returned fall within the rectangle
     * defined by (0,0) and box_pt
     *
     * fx :: number -> Point
     * lo_x, hi_x :: number
     * n_pt :: number
     * xyscale :: Xyscale
     * box_pt :: Point
     */
    fx.make_target_pt_v = function(fx, lo_x, hi_x, n_pt, xyscale, box_pt)
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
	    p = xyscale.scale_pt(fx(tmp));

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
