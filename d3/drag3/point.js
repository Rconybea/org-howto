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
	var dpt = pt.sub_pt(p1, p2);

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
		/* p on LHS of r */
		t1 = (0.0 - p_ref.x) / (p.x - p_ref.x);
	    }

	    if(p.x > box.x) {
		/* p on RHS or r */
		t2 = (box.x - p_ref.x) / (p.x - p_ref.x);
	    }

	    if(p.y < 0.0) {
		/* p above r */
		t3 = (0.0 - p_ref.y) / (p.y - p_ref.y);
	    }
		   
	    if(p.y > box.y) {
		/* p below r */
		t4 = (box.y - p_ref.y) / (p.y - p_ref.y);
	    }

	    t_min = Math.min(t1,t2,t3,t4);

	    /* clip p: p <- p_ref + t * (p - p_ref) */
	    p = pt.add_pt(p_ref, pt.scale_pt(t_min, pt.sub_pt(p, p_ref)));

	    return p;
	}
    } /*clip_line*/

    this.pt = pt;
}();
