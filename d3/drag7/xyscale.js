!function()
{
    /* Requires:
     * - point.js
     * - fx.js
     */

    /* xscale :: D3scale
     * yscale :: D3scale
     */
    function xyscale(xscale, yscale)
    {
	this.xscale = xscale;
	this.yscale = yscale;
	this.scale_pt = fx.scale_fn(xscale, yscale);
	this.unscale_pt = fx.invert_scale_fn(xscale, yscale);
    } /*xyscale*/

    this.xyscale = xyscale
}();
