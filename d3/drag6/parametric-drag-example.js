!function() {
    var ex = {};
    
    /* Requires: 
     * - point.js
     * - fx.js
     * - fx_view.js
     */

    ex.box_pt = {x: 700, y: 450};

    /* w :: Window */
    ex.start = function(w)
    {
	/* domain = natural coords;
	 * range  = screen coords
	 * 
	 * 0.0 -> 0.5*box_pt.x
	 * 1.0 -> 0.5*box_pt.x + 200
	 */
	ex.x_scale = d3.scale.linear()
	    .domain([-0.5 * ex.box_pt.x / 200.0,
		     +0.5 * ex.box_pt.x / 200.0])
	    .range([0.0, ex.box_pt.x]);

	ex.y_scale = d3.scale.linear()
	    .domain([-0.5 * ex.box_pt.y / 200.0,
		     + 0.5 * ex.box_pt.y / 200.0])
	    .range([ex.box_pt.y, 0.0]);

	ex.xyscale = new xyscale(ex.x_scale, ex.y_scale);

	ex.target_pt_v = fx.make_target_pt_v(fx.eval_fn,
					     -1.66, +5.0, 200.0 /*n_pt*/,
					     ex.xyscale, ex.box_pt);
	fx_view.init_drag_function(ex.box_pt, ex.target_pt_v, ex.xyscale);
	fx_view.draw("#frame", ex.box_pt, ex.target_pt_v, ex.xyscale);
    }
    
    this.ex = ex;
}();
