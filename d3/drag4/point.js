!function() {
    var pt = {};

    /* module for working with 2-dimensional coordinates */

    /* scale coordinates p.x, p.y by a factor of k */
    pt.scale_pt = function(k, p)
    {
	return {x: k*p.x, y: k*p.y};
    } /*scale_pt*/

    /* returns cordinate-wise sum of points p1 and p2 */
    pt.add_pt = function(p1, p2)
    {
	return {x: p1.x+p2.x, y: p1.y+p2.y};
    } /*add_pt*/

    pt.sub_pt = function(p1, p2)
    {
	return {x: p1.x-p2.x, y: p1.y-p2.y};
    } /*sub_pt*/

    /* returns true iff the rectangle with corners (0,0), and box_pt
     * contains the point p;  false otherwise
     *
     * box :: Point
     * p :: Point
     */
    pt.box_contains = function(box, p)
    {
	return ((0 <= p.x)
		&& (p.x <= box.x)
		&& (0 <= p.y)
		&& (p.y <= box.y));
    } /*box_contains*/

    /* find squared distance between two points
     * p1 and p2.
     * 
     * Point = {x,y}
     * p1, p2 :: Point
     */
    pt.distance_squared = function(p1, p2)
    {
	var dpt = pt.add_pt(p1, pt.scale_pt(-1, p2));

	return dpt.x*dpt.x + dpt.y*dpt.y;
    } /*distance_squared*/

    /* given a set of points, 
     * find the point that's closest to a particular target point.
     * O(n) in n=fn_pt_v.length
     * 
     * point = {x,y}
     * fn_pt_v :: array(point)
     * target_fn :: point
     * return :: point | null
     */
    pt.find_closest_ix = function(target_pt, fn_pt_v)
    {
	var best_ix = -1;
	var best_d2 = null;
	var best_pt = null;
	var i = 0;

	for(var n=fn_pt_v.length; i<n; ++i) {
	    var fn_pt = fn_pt_v[i];
	    var d2 = pt.distance_squared(target_pt, fn_pt);
	    if(best_ix === -1 || d2 < best_d2) {
		best_ix = i;
		best_d2 = d2;
		best_pt = fn_pt;
	    }
	}

	return best_ix;
    } /*find_closest_ix*/

    /* like find_closest_ix(), but returns the closest
     * point,  instead of its index in fn_pt_v.
     * 
     * Equivalent to fn_pt_v[find_closest_ix(target_pt, fn_pt_v)]
     */
    pt.find_closest = function(target_pt, fn_pt_v)
    {
	var best_ix = pt.find_closest_ix(target_pt, fn_pt_v);
	return fn_pt_v[best_ix];
    } /*find_closest*/

    /* given a line segment L defined by endpoints p, p_ref,  and a bounding rectange r
     * defined by points (0,0) and b
     * where p_ref is assumed ot be inside r:
     * - if p is also inside r,  return p
     * - otherwise return the point pl on L that intesects the boundary of r
     */
    pt.clip_line = function(p, p_ref, box)
    {
	/* if clipping occurs,  it's for higher values of t */
	var t_min = 1.0;
	var t1 = 1.0;
	var t2 = 1.0;
	var t3 = 1.0;
	var t4 = 1.0;

	if(pt.box_contains(box, p)) {
	    return p;
	} else {
	    /* parametrize L by t in [0,1]:
	     *   L(t) = p_ref + t * (p - p_ref)
	     * note that when we assign to p,  we replace L with a sub-segment of itself
	     */
	    if(p.x < 0.0) {
		t1 = (0.0 - p_ref.x) / (p.x - p_ref.x); /* p on LHS of r */
	    }

	    if(p.x > box.x) {
		t2 = (box.x - p_ref.x) / (p.x - p_ref.x); /* p on RHS or r */
	    }

	    if(p.y < 0.0) {
		t3 = (0.0 - p_ref.y) / (p.y - p_ref.y); /* p above r */
	    }
		   
	    if(p.y > box.y) {
		t4 = (box.y - p_ref.y) / (p.y - p_ref.y); /* p below r */
	    }

	    t_min = Math.min(t1,t2,t3,t4);

	    /* clip p: p <- p_ref + t * (p - p_ref) */
	    p = pt.add_pt(p_ref, pt.scale_pt(t_min, pt.sub_pt(p, p_ref)));

	    return p;
	}
    } /*clip_line*/

    /* given a line L through points pt1,pt2,
     * find the point p on the line such that the line through p,target_pt
     * is perpendicular to L
     * 
     * point = {x,y}
     * target_pt, pt1, pt2 :: point
     * return :: point
     */
    pt.find_perpendicular = function(target_pt, pt1, pt2, clip_flag)
    {
	/*
	 *                               * (x2,y2) = pt2
	 *                             /
	 *                           /
	 *                         /  L
	 *                   p   /
	 *                     *
	 *                   /   \  M
	 *                 /       \
	 * pt1 = (x1,y1) *           \
	 *                            * (x0,y0) pt0
	 *
	 * parameterise the line L through pt1,pt2:
	 *    L comprises the points L(t) = pt1 + t*(pt2-pt1)
	 * given a particular point p = L(t0),  consider the line M
	 * through L(t0) and (x0,y0)
	 *    M comprises the points M(s) = pt0 + s*(L(t0)-pt0)
	 *  
	 * we seek t such that the line M(s) through L(t) and (x0,y0)
	 * is perpendicular to L.
	 *
	 * A vector lv parallel to L is (pt2-pt1).
	 *   lv = (x2-x1,y2-y1)
	 * A vector mv parallel to the line thru L(t) 
	 *   L(t) = pt1 + t*(pt2-pt1) = (1-t)*pt1 + t*pt2
	 * and pt0 is:
	 *   mv = L(t)-pt0
	 *      = ((1-t)*x1 + t*x2) - x0,
	 *         (1-t)*y1 + t*y2) - y0)
	 * 
	 *  lv . mvT
	 *      = (x2-x1)*[(1-t)*x1 + t*x2 - x0]
	 *         + (y2-y1)*[(1-t)*y1 + t*y2 - y0]
	 * 
	 * lv. mvT is 0 when lv and mv are _|_:
	 *   (x2-x1)*[(1-t)*x1 + t*x2 - x0] = -(y2-y1)*[(1-t)*y1 + t*y2 - y0]
	 *   (x2-x1)*[-t*x1 + t*x2 + x1-x0] = -(y2-y1)*[-t*y1 + t*y2 + y1-y0]
	 *   t*(x2-x1)*[-x1 + x2] + (x2-x1)*(x1-x0) 
	 *     = t*[-(y2-y1)]*[-y1 + y2] + -(y2-y1)*(y1-y0)
	 *   t*(x2-x1)^2 + t*(y2-y1)^2 = -(x2-x1)*(x1-x0) - (y2-y1)*(y1-y0)
	 *   
	 *            (x2-x1)*(x1-x0) + (y2-y1)*(y1-y0)
	 *   t = -1 * ---------------------------------
	 *                 (x2-x1)^2 + (y2-y1)^2
	 *
	 *   L(t) = pt1 + t*(pt2 - pt1)
	 */
	var pt0 = target_pt;

	var dx2 = pt2.x - pt1.x;
	var dy2 = pt2.y - pt1.y;

	var dx1 = pt1.x - pt0.x;
	var dy1 = pt1.y - pt0.y;

	var t = -((dx2*dx1) + (dy2*dy1)) / (dx2*dx2 + dy2*dy2);

	/* if clip_flag is true:
	 * constrain t to [0,1],
	 * i.e. to the line _segment_ ((x1,y1) .. (x2,y2))
	 */
	if(clip_flag) {
	    if(t < 0.0)
		t = 0.0;
	    if(t > 1.0)
		t = 1.0;
	}

	var xt = pt1.x + t * dx2;
	var yt = pt1.y + t * dy2;

	return {x: xt, y: yt};
    } /*find_perpendicular*/

    this.pt = pt;
}();
