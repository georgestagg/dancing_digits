/*jshint esversion: 6 */
class Point {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
}

var mX,mY;
(function() {
    document.onmousemove = handleMouseMove;
    function handleMouseMove(event) {
        var eventDoc, doc, body;
        event = event || window.event;
        if (event.pageX == null && event.clientX != null) {
            eventDoc = (event.target && event.target.ownerDocument) || document;
            doc = eventDoc.documentElement;
            body = eventDoc.body;

            event.pageX = event.clientX +
              (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
              (doc && doc.clientLeft || body && body.clientLeft || 0);
            event.pageY = event.clientY +
              (doc && doc.scrollTop  || body && body.scrollTop  || 0) -
              (doc && doc.clientTop  || body && body.clientTop  || 0 );
        }

        mX = event.pageX;
        mY = event.pageY;
        points = [];
		iter = 0;
		walker = new Point(0,0);
		document.getElementById('rational').innerHTML =
			event.pageX.toString()+'/'+event.pageY.toString()+'<br>b='+ base.toString();
    }
})();

var c = document.getElementById("myCanvas");
c.width = document.body.clientWidth;
c.height = document.body.clientHeight;
var ctx = c.getContext("2d");

var walker = new Point(0,0); 
var points = [];
var iter = 0;
var scale = 0.5;
var cps = 10;
var base = 10;

var base16lookup4 = [
    [0,0],[0,1],[0,2],[0,3],
    [1,0],[1,1],[1,2],[1,3],
    [2,0],[2,1],[2,2],[2,3],
    [3,0],[3,1],[3,2],[3,3]];

//var rational = new RationalFraction(BigInt('20687752595597322377625586259956024742894547604524351826564285988864'),
//	BigInt('61622735239201462387810320198902012968313472965807022813951109141065'),base);
//console.log(rational.toString());
function update(progress) {
	if (typeof mX == 'undefined' || typeof mY == 'undefined') return;
	var rational = new RationalFraction(mX,mY,base);
	for (i = 0; i<cps; i++){
		
		// n = pi(iter);
		// nn = base16lookup4[n];
		// walker.x += dirlookup4[nn[0]].x;
		// walker.y += dirlookup4[nn[0]].y;
		// points.push(new Point(walker.x, walker.y));
		// walker.x += dirlookup4[nn[1]].x;
		// walker.y += dirlookup4[nn[1]].y;
		// points.push(new Point(walker.x, walker.y));

		n = rational.digit(iter);
		walker.x += Math.cos(2*3.14159265*n/base);
		walker.y += -Math.sin(2*3.14159265*n/base);
		points.push(new Point(walker.x, walker.y));
		iter += 1;
	}
}

function draw() {
	maxP = points.reduce((acc, val) => {
        acc.x = Math.abs(val.x) > Math.abs(acc.x) ? Math.abs(val.x) : Math.abs(acc.x);
        acc.y = Math.abs(val.y) > Math.abs(acc.y) ? Math.abs(val.y) : Math.abs(acc.y);
        return acc;
    }, new Point(0,0));

    scale = (c.width/maxP.x < c.height/maxP.y ? (0.4*c.width/maxP.x):(0.4*c.height/maxP.y));

    ctx.clearRect(0, 0, c.width, c.height);
	ctx.globalCompositeOperation = 'screen';
    ctx.fillStyle = "rgb(00%,00%,10%)";
    ctx.strokeStyle = 'rgb(100%,75%,10%)';
    ctx.lineWidth = 2;
    ctx.fillRect(0, 0, c.width, c.height);
	ctx.beginPath();
	ctx.moveTo(c.width/2.0, c.height/2.0);

	points.forEach(function (item, index) {
		ctx.lineTo(c.width/2.0+scale*item.x, c.height/2.0+scale*item.y);
	});
	ctx.stroke();
}

function loop(timestamp) {
  var progress = timestamp - lastRender;
  update(progress);
  draw();
  lastRender = timestamp;
  window.setTimeout(loop, 100);
}
var lastRender = 0;
window.requestAnimationFrame(loop);

