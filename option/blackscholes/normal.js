!function()
{
    /* e.g. N = normal(0,1)
     *      N.cdf(0.0) -> 0.5
     */
    function normal(mean, sigma)
    {
	this.mean = mean;
	this.sigma = sigma;
	this.sigma_2 = sigma*sigma;
	this.cdf = function(x) {
	    var z = (x-mean)/Math.sqrt(2*this.sigma_2);
	    var t = 1/(1+0.3275911*Math.abs(z));
	    var a1 =  0.254829592;
	    var a2 = -0.284496736;
	    var a3 =  1.421413741;
	    var a4 = -1.453152027;
	    var a5 =  1.061405429;
	    var erf = 1-(((((a5*t + a4)*t) + a3)*t + a2)*t + a1)*t*Math.exp(-z*z);
	    var sign = 1;
	    if(z < 0)
	    {
		sign = -1;
	    }
	    return (1/2)*(1+sign*erf);
	} /*cdf*/
	this.pdf = function(x) {
	    var z = (x-mean)/Math.sqrt(2*this.sigma_2);
	    
	    return (1.0/Math.sqrt(2*Math.PI)) * Math.exp(-0.5*z*z);
	} /*pdf*/
    } /*normal*/
    
    this.normal = normal;
}();
