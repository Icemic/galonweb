window.requestAnimationFrame = window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    function(callback) { setTimeout(callback, 1000 / 60); };
	
window.clearRequestTimeout = function(id) {
    window.cancelAnimationFrame ? window.cancelAnimationFrame(id) :
    window.webkitCancelAnimationFrame ? window.webkitCancelAnimationFrame(id) :
    window.webkitCancelRequestAnimationFrame ? window.webkitCancelRequestAnimationFrame(id) : /* Support for legacy API */
    window.mozCancelRequestAnimationFrame ? window.mozCancelRequestAnimationFrame(id) :
    window.oCancelRequestAnimationFrame ? window.oCancelRequestAnimationFrame(id) :
    window.msCancelRequestAnimationFrame ? window.msCancelRequestAnimationFrame(id) :
    clearTimeout(id);
};

