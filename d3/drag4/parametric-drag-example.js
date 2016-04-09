!function() {
    var ex = {};
    
    /* Requires: 
     * - point.js
     * - fx.js
     * - fx_view.js
     */

    ex.box_pt = {x: 600, y: 400};

    /* w :: Window */
    ex.start = function(w)
    {
	ex.pt2screen = fx.linear_fn(pt.sub_pt(pt.scale_pt(0.5, ex.box_pt),
					      fx.eval_fn(0.0) /*ctr_fx*/),
				    200.0 /*scale_factor*/);
	ex.target_pt_v = fx.make_target_pt_v(fx.eval_fn,
					     -1.66, +5.0, 200.0 /*n_pt*/,
					     ex.pt2screen, ex.box_pt);
	fx_view.init_drag_function(ex.target_pt_v);
	fx_view.draw("#frame", ex.box_pt, ex.target_pt_v);
    }
    
    this.ex = ex;
}();
