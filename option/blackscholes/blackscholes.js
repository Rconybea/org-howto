!function()
{
    var blackscholes = {};

    blackscholes.normal = new normal(0.0 /*mean*/, 1.0 /*sigma*/);

    blackscholes.d1 = function(strike, tau, spot, vol, r)
    {
	var moneyness = spot/strike;
	return (Math.log(moneyness) + (r + 0.5*vol*vol)*tau)/(vol*Math.sqrt(tau));
    } /*d1*/

    blackscholes.d2 = function(d1, tau, vol)
    {
	return d1 - vol * Math.sqrt(tau);
    } /*d2*/

    blackscholes.call_px1 = function(strike, tau, spot, r, d1, d2)
    {
	return blackscholes.normal.cdf(d1)*spot
	    - blackscholes.normal.cdf(d2)*strike*Math.exp(-r*tau)
    } /*call_px1*/

    blackscholes.call_px = function(strike, tau, spot, vol, r)
    {
	var d1 = blackscholes.d1(strike, tau, spot, vol, r);
	var d2 = blackscholes.d2(d1, tau, vol);

	return blackscholes.call_px1(strike, tau, spot, r, d1, d2);
    } /*call_px*/

    blackscholes.call_delta = function(strike, tau, spot, vol, r)
    {
	var d1 = blackscholes.d1(strike, tau, spot, vol, r);

	return blackscholes.normal.cdf(d1);
    } /*call_delta*/

    blackscholes.gamma = function(strike, tau, spot, vol, r)
    {
	var d1 = blackscholes.d1(strike, tau, spot, vol, r);

	return blackscholes.normal.pdf(d1) / (spot * vol * Math.sqrt(tau));
    } /*gamma*/

    /* providing call_gamma() for consistency with call_px(), call_delta() */
    blackscholes.call_gamma = blackscholes.gamma;

    this.blackscholes = blackscholes;
}();
