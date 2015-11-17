var bezier = require('bezier')
var PIXI = require('pixi.js')
var popmotion = require('popmotion')
var distance = require('euclidean-distance')
var seedrandom = require('seedrandom')
require('sugar')

var renderer = new PIXI.CanvasRenderer(window.innerWidth, window.innerHeight,{backgroundColor : 0xF0F8FF});
document.body.appendChild(renderer.view);

var stage = new PIXI.Container();
var points = [];
var sorted_points_indexes = [];
var sortedPoints = [];
var sorted_points_corrected = [];
var max_points = 15;
var borderPixels = 50;
var Full360 = Math.PI * 2;

var randomGenerator = seedrandom(location.hash);

for (var i = 0; i < max_points; i++)
{
    points.push({'x': borderPixels + (randomGenerator() * (window.innerWidth - 2 * borderPixels)), 'y': borderPixels + (randomGenerator() * (window.innerHeight - 2 * borderPixels))})
}

sorted_points_indexes.push(0)
while (sorted_points_indexes.length < max_points) {
    var min_distance = 999999999;
    var min_distance_point_index = 0;
    for( var i =1; i< points.length; i++) {
        if (sorted_points_indexes.findIndex(i) == -1) {
            var dist_temp = distance(Object.values(points[sorted_points_indexes.last()]), Object.values(points[i]))
            if (dist_temp < min_distance) {
                min_distance = dist_temp
                min_distance_point_index = i
            }
        }
    }
    sorted_points_indexes.push(min_distance_point_index)
}



sortedPoints = sorted_points_indexes.map((i)=>points[i]);
sortedPoints.each(
    (value,index)=>{
        sorted_points_corrected.push(value);
        if(index<sortedPoints.length-2) {
            let nextValue = sortedPoints[index + 1]
            let random = randomGenerator() * 1.5 + 0.5;
            sorted_points_corrected.push({
                x: ((nextValue.x - value.x) * random) + nextValue.x,
                y: ((nextValue.y - value.y) * random) + nextValue.y
            });
        }
})

var sorted_points_indexes_without_first = sorted_points_indexes.clone().removeAt(0)

var xbezier = [];
var ybezier = [];

sorted_points_corrected.each(function(point) {
    xbezier.push(point.x)
    ybezier.push(point.y)
})

var superPoints = [];
for (var t = 0; t <= 1; t += 0.01) {
    superPoints.push({
        x: bezier(xbezier, t),
        y: bezier(ybezier, t)
    });
}

var kapselTexture = PIXI.Texture.fromImage('img/kapsel.png');

var kapsel = new PIXI.Sprite(kapselTexture);


var actorKapsel = new popmotion.Actor({
    onUpdate: function (output) {
        console.log(output);
    }
});

var tween = new popmotion.Tween({
    values: {
        x: 300,
        y: 300
    }
});

actorKapsel.start(tween)

renderRoad();
renderPoints();
renderKapsel();
animate();

function animate() {
    requestAnimationFrame(animate);

    kapsel.rotation = (kapsel.rotation + 0.1)
    if(kapsel.rotation> Full360){
        kapsel.rotation = kapsel.rotation-Full360;
    }

    // render the container
    renderer.render(stage);
}

function renderPoints() {
    var g = new PIXI.Graphics();
    g.clear();
    g.lineStyle(2,0xffc2c2);
    g.moveTo(sorted_points_indexes[0].x,sorted_points_indexes[0].y);

    superPoints.each((point)=>{
        g.lineTo(point.x,point.y)
    })

    for (var i = 0; i < superPoints.length; i++) {
        g.beginFill(0xff0022);
        g.drawCircle(superPoints[i].x,superPoints[i].y,10);
        g.endFill();
    }
    stage.addChild(g)
}


function renderRoad() {
    var strip = new PIXI.mesh.Rope(PIXI.Texture.fromImage('img/road.jpg'), superPoints);
    stage.addChild(strip);
}

function renderKapsel() {
    kapsel.anchor.x = 0.5;
    kapsel.anchor.y = 0.5;

    kapsel.position.x = superPoints[1].x
    kapsel.position.y = superPoints[1].y

    stage.addChild(kapsel);
}



