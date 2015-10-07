var bezier = require('bezier')
var PIXI = require('pixi.js')
var popmotion = require('popmotion')
var distance = require('euclidean-distance')
var seedrandom = require('seedrandom')
require('sugar')

var renderer = new PIXI.CanvasRenderer(window.innerWidth, window.innerHeight,{backgroundColor : 0xF0F8FF});
document.body.appendChild(renderer.view);

// create the root of the scene graph
var stage = new PIXI.Container();
var points = [];
var sorted_points_indexes = [];
var max_points = 15;
var frame_pixels = 50;

var randomGenerator = seedrandom(location.hash);

for (var i = 0; i < max_points; i++)
{
    points.push({'x': frame_pixels + (randomGenerator() * (window.innerWidth - 2 * frame_pixels)), 'y': frame_pixels + (randomGenerator() * (window.innerHeight - 2 * frame_pixels))})
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


var sorted_points_corrected = [];
var sortedPoints = sorted_points_indexes.map((i)=>points[i]);
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

var g = new PIXI.Graphics();
stage.addChild(g)

// create a texture from an image path
var texture = PIXI.Texture.fromImage('img/kapsel.png');

// create a new Sprite using the texture
var kapsel = new PIXI.Sprite(texture);

// center the sprite's anchor point
kapsel.anchor.x = 0.5;
kapsel.anchor.y = 0.5;

// move the sprite to the center of the screen
kapsel.position.x = 200;
kapsel.position.y = 150;

stage.addChild(kapsel);

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

for(let i=0; i<sortedPoints.length;i++) {
    var text = new PIXI.Text(i)
    text.x = sortedPoints[i].x + 15
    text.y = sortedPoints[i].y - 15
    stage.addChild(text)
}

var renderPoints = function() {

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
}

var Full360 = Math.PI * 2;

renderPoints();
// start animating
animate();

var strip = new PIXI.mesh.Rope(PIXI.Texture.fromImage('img/snake.png'), superPoints);
stage.addChild(strip);

kapsel.x = points[0].x
kapsel.y = points[0].y

strip.position.x = 0
strip.position.y = 0

function animate() {
    requestAnimationFrame(animate);

    kapsel.rotation = (kapsel.rotation + 0.1)
    if(kapsel.rotation> Full360){
        kapsel.rotation = kapsel.rotation-Full360;
    }

    // render the container
    renderer.render(stage);
}

