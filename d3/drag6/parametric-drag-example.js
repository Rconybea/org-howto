!function() {
    var ex = {};
    
    /* Requires: 
     * - point.js
     * - fx.js
     * - fx_view.js
     */

    ex.box_pt = {x: 700, y: 450};

    /* target function f(x)
     * x :: number
     * returns :: number
     */
    ex.target_fn = function(x) {
	return x * x * (x - 0.6);
    } /*target_fn*/

    /* derivative f'(x) of fx.target_fn
     * x :: number
     * returns :: number
     */
    ex.target_deriv_fn = function(x) {
	return x * (3 * x - 1.2); 
    } /*target_deriv_fn*/

    /* w :: Window */
    ex.start = function(w)
    {
	fx_view.init_sequence(ex.target_fn, ex.target_deriv_fn,
			      ex.box_pt, 200.0 /*scale_factor*/,
			      -1.66 /*lo_x*/, +2.0 /*hi_x*/,
			      -1.66*ex.box_pt.y/ex.box_pt.x /*lo_y*/,
			      +2.0*ex.box_pt.y/ex.box_pt.x /*hi_y*/,
			      200 /*n_pt*/);
	fx_view.draw("#frame");
    }
    
    this.ex = ex;
}();
