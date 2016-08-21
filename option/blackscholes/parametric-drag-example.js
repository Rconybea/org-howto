!function() {
    var ex = {};
    
    /* Requires: 
     * - point.js
     * - fx.js
     * - fx_view.js
     */

    ex.box_pt = {x: 600, y: 450};

    ex.strike = 1.0;
    ex.tau = 1.0;
    ex.vol = 0.55;
    ex.r = 0.02;

    /* target function f(x)
     * x :: number
     * returns :: number
     */
    ex.target_fn = function(x) {
	return blackscholes.call_px(ex.strike, ex.tau, x, ex.vol, ex.r);
    } /*target_fn*/

    /* derivative f'(x) of fx.target_fn
     * x :: number
     * returns :: number
     */
    ex.target_deriv_fn = function(x) {
	return blackscholes.call_delta(ex.strike, ex.tau, x, ex.vol, ex.r);
    } /*target_deriv_fn*/

    /* 2nd derivative f''(x) of fx.target_fn
     * x :: number
     * returns :: number
     */
    ex.target_deriv2_fn = function(x) {
	return blackscholes.call_gamma(ex.strike, ex.tau, x, ex.vol, ex.r);
    } /*target_deriv2_fn*/

    /* w :: Window */
    ex.start = function(w)
    {
	fx_view.init_sequence(ex.target_fn,
			      ex.target_deriv_fn,
			      ex.target_deriv2_fn,
			      ex.box_pt, 200.0 /*scale_factor*/,
			      +0.01 /*lo_x*/, +2.0 /*hi_x*/,
			      0.0 /*lo_y*/, 1.0 /*hi_y*/,
			      200 /*n_pt*/);
	fx_view.draw("#frame");
    }
    
    this.ex = ex;
}();
