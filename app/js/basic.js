var bezier = require('bezier')
var PIXI = require('pixi.js')
var popmotion = require('popmotion')

var renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight,{backgroundColor : 0xF0F8FF});
document.body.appendChild(renderer.view);

// create the root of the scene graph
var stage = new PIXI.Container();
var points = [];
var max_points = 5;
var frame_pixels = 50;

for (var i = 0; i < max_points; i++)
{
    console.log('hfghgf')
    points.push({'x': frame_pixels + (Math.random() * (window.innerWidth - 2 * frame_pixels)), 'y': frame_pixels + (Math.random() * (window.innerHeight - 2 * frame_pixels))})
}

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

var renderPoints = function() {
    g.lineStyle(2,0xffc2c2);
    g.moveTo(points[0].x,points[0].y);

    for (var i = 1; i < points.length; i++) {
        g.lineTo(points[i].x,points[i].y);
    }

    for (var i = 0; i < points.length; i++) {
        g.beginFill(0xff0022);
        g.drawCircle(points[i].x,points[i].y,10);
        g.endFill();
    }
}

// start animating
animate();
function animate() {
    requestAnimationFrame(animate);

    // just for fun, let's rotate mr rabbit a little
    kapsel.rotation += 0.1;

    // render the container
    renderer.render(stage);
    renderPoints();
}

