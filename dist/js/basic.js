'use strict';

var bezier = require('bezier');
var PIXI = require('pixi.js');
var popmotion = require('popmotion');
var distance = require('euclidean-distance');
var seedrandom = require('seedrandom');
require('sugar');

var renderer = new PIXI.CanvasRenderer(window.innerWidth, window.innerHeight, { backgroundColor: 0xF0F8FF });
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

for (var i = 0; i < max_points; i++) {
    points.push({ x: borderPixels + randomGenerator() * (window.innerWidth - 2 * borderPixels), y: borderPixels + randomGenerator() * (window.innerHeight - 2 * borderPixels) });
}

sorted_points_indexes.push(0);
while (sorted_points_indexes.length < max_points) {
    var min_distance = 999999999;
    var min_distance_point_index = 0;
    for (var i = 1; i < points.length; i++) {
        if (sorted_points_indexes.findIndex(i) == -1) {
            var dist_temp = distance(Object.values(points[sorted_points_indexes.last()]), Object.values(points[i]));
            if (dist_temp < min_distance) {
                min_distance = dist_temp;
                min_distance_point_index = i;
            }
        }
    }
    sorted_points_indexes.push(min_distance_point_index);
}

sortedPoints = sorted_points_indexes.map(function (i) {
    return points[i];
});
sortedPoints.each(function (value, index) {
    sorted_points_corrected.push(value);
    if (index < sortedPoints.length - 2) {
        var nextValue = sortedPoints[index + 1];
        var random = randomGenerator() * 1.5 + 0.5;
        sorted_points_corrected.push({
            x: (nextValue.x - value.x) * random + nextValue.x,
            y: (nextValue.y - value.y) * random + nextValue.y
        });
    }
});

var sorted_points_indexes_without_first = sorted_points_indexes.clone().removeAt(0);

var xbezier = [];
var ybezier = [];

sorted_points_corrected.each(function (point) {
    xbezier.push(point.x);
    ybezier.push(point.y);
});

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
    onUpdate: function onUpdate(output) {
        console.log(output);
    }
});

var tween = new popmotion.Tween({
    values: {
        x: 300,
        y: 300
    }
});

actorKapsel.start(tween);

(function renderRoad() {
    var strip = new PIXI.mesh.Rope(PIXI.Texture.fromImage('img/road.jpg'), superPoints);
    stage.addChild(strip);
})();
(function renderPoints() {
    var g = new PIXI.Graphics();
    g.clear();
    g.lineStyle(2, 0xffc2c2);
    g.moveTo(sorted_points_indexes[0].x, sorted_points_indexes[0].y);

    superPoints.each(function (point) {
        g.lineTo(point.x, point.y);
    });

    for (var i = 0; i < superPoints.length; i++) {
        g.beginFill(0xff0022);
        g.drawCircle(superPoints[i].x, superPoints[i].y, 10);
        g.endFill();
    }
    stage.addChild(g);
})();
(function renderKapsel() {
    kapsel.anchor.x = 0.5;
    kapsel.anchor.y = 0.5;

    kapsel.position.x = superPoints[1].x;
    kapsel.position.y = superPoints[1].y;

    stage.addChild(kapsel);
})();
(function animate() {
    requestAnimationFrame(animate);

    kapsel.rotation = kapsel.rotation + 0.1;
    if (kapsel.rotation > Full360) {
        kapsel.rotation = kapsel.rotation - Full360;
    }

    // render the container
    renderer.render(stage);
})();
//# sourceMappingURL=data:application/json;base64,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QUFDLENBQUMsQ0FBQyxDQUFBOztBQUVwQyxTQUFLLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0NBQzFCLENBQUEsRUEvQ2EsQ0FBQztBQUNmLENBRUEsU0FBUyxPQUFPLEdBQUc7QUFDZix5QkFBcUIsQ0FBQyxPQUFPLENBQUMsQ0FBQzs7QUFFL0IsVUFBTSxDQUFDLFFBQVEsR0FBSSxNQUFNLENBQUMsUUFBUSxHQUFHLEdBQUcsQUFBQyxDQUFBO0FBQ3pDLFFBQUcsTUFBTSxDQUFDLFFBQVEsR0FBRSxPQUFPLEVBQUM7QUFDeEIsY0FBTSxDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUMsUUFBUSxHQUFDLE9BQU8sQ0FBQztLQUM3Qzs7O0FBR0QsWUFBUSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztDQUMxQixDQUFBLEVBWlEsQ0FBQyIsImZpbGUiOiJqcy9iYXNpYy5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBiZXppZXIgPSByZXF1aXJlKCdiZXppZXInKVxudmFyIFBJWEkgPSByZXF1aXJlKCdwaXhpLmpzJylcbnZhciBwb3Btb3Rpb24gPSByZXF1aXJlKCdwb3Btb3Rpb24nKVxudmFyIGRpc3RhbmNlID0gcmVxdWlyZSgnZXVjbGlkZWFuLWRpc3RhbmNlJylcbnZhciBzZWVkcmFuZG9tID0gcmVxdWlyZSgnc2VlZHJhbmRvbScpXG5yZXF1aXJlKCdzdWdhcicpXG5cbnZhciByZW5kZXJlciA9IG5ldyBQSVhJLkNhbnZhc1JlbmRlcmVyKHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQse2JhY2tncm91bmRDb2xvciA6IDB4RjBGOEZGfSk7XG5kb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHJlbmRlcmVyLnZpZXcpO1xuXG52YXIgc3RhZ2UgPSBuZXcgUElYSS5Db250YWluZXIoKTtcbnZhciBwb2ludHMgPSBbXTtcbnZhciBzb3J0ZWRfcG9pbnRzX2luZGV4ZXMgPSBbXTtcbnZhciBzb3J0ZWRQb2ludHMgPSBbXTtcbnZhciBzb3J0ZWRfcG9pbnRzX2NvcnJlY3RlZCA9IFtdO1xudmFyIG1heF9wb2ludHMgPSAxNTtcbnZhciBib3JkZXJQaXhlbHMgPSA1MDtcbnZhciBGdWxsMzYwID0gTWF0aC5QSSAqIDI7XG5cbnZhciByYW5kb21HZW5lcmF0b3IgPSBzZWVkcmFuZG9tKGxvY2F0aW9uLmhhc2gpO1xuXG5mb3IgKHZhciBpID0gMDsgaSA8IG1heF9wb2ludHM7IGkrKylcbntcbiAgICBwb2ludHMucHVzaCh7J3gnOiBib3JkZXJQaXhlbHMgKyAocmFuZG9tR2VuZXJhdG9yKCkgKiAod2luZG93LmlubmVyV2lkdGggLSAyICogYm9yZGVyUGl4ZWxzKSksICd5JzogYm9yZGVyUGl4ZWxzICsgKHJhbmRvbUdlbmVyYXRvcigpICogKHdpbmRvdy5pbm5lckhlaWdodCAtIDIgKiBib3JkZXJQaXhlbHMpKX0pXG59XG5cbnNvcnRlZF9wb2ludHNfaW5kZXhlcy5wdXNoKDApXG53aGlsZSAoc29ydGVkX3BvaW50c19pbmRleGVzLmxlbmd0aCA8IG1heF9wb2ludHMpIHtcbiAgICB2YXIgbWluX2Rpc3RhbmNlID0gOTk5OTk5OTk5O1xuICAgIHZhciBtaW5fZGlzdGFuY2VfcG9pbnRfaW5kZXggPSAwO1xuICAgIGZvciggdmFyIGkgPTE7IGk8IHBvaW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoc29ydGVkX3BvaW50c19pbmRleGVzLmZpbmRJbmRleChpKSA9PSAtMSkge1xuICAgICAgICAgICAgdmFyIGRpc3RfdGVtcCA9IGRpc3RhbmNlKE9iamVjdC52YWx1ZXMocG9pbnRzW3NvcnRlZF9wb2ludHNfaW5kZXhlcy5sYXN0KCldKSwgT2JqZWN0LnZhbHVlcyhwb2ludHNbaV0pKVxuICAgICAgICAgICAgaWYgKGRpc3RfdGVtcCA8IG1pbl9kaXN0YW5jZSkge1xuICAgICAgICAgICAgICAgIG1pbl9kaXN0YW5jZSA9IGRpc3RfdGVtcFxuICAgICAgICAgICAgICAgIG1pbl9kaXN0YW5jZV9wb2ludF9pbmRleCA9IGlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBzb3J0ZWRfcG9pbnRzX2luZGV4ZXMucHVzaChtaW5fZGlzdGFuY2VfcG9pbnRfaW5kZXgpXG59XG5cblxuXG5zb3J0ZWRQb2ludHMgPSBzb3J0ZWRfcG9pbnRzX2luZGV4ZXMubWFwKChpKT0+cG9pbnRzW2ldKTtcbnNvcnRlZFBvaW50cy5lYWNoKFxuICAgICh2YWx1ZSxpbmRleCk9PntcbiAgICAgICAgc29ydGVkX3BvaW50c19jb3JyZWN0ZWQucHVzaCh2YWx1ZSk7XG4gICAgICAgIGlmKGluZGV4PHNvcnRlZFBvaW50cy5sZW5ndGgtMikge1xuICAgICAgICAgICAgbGV0IG5leHRWYWx1ZSA9IHNvcnRlZFBvaW50c1tpbmRleCArIDFdXG4gICAgICAgICAgICBsZXQgcmFuZG9tID0gcmFuZG9tR2VuZXJhdG9yKCkgKiAxLjUgKyAwLjU7XG4gICAgICAgICAgICBzb3J0ZWRfcG9pbnRzX2NvcnJlY3RlZC5wdXNoKHtcbiAgICAgICAgICAgICAgICB4OiAoKG5leHRWYWx1ZS54IC0gdmFsdWUueCkgKiByYW5kb20pICsgbmV4dFZhbHVlLngsXG4gICAgICAgICAgICAgICAgeTogKChuZXh0VmFsdWUueSAtIHZhbHVlLnkpICogcmFuZG9tKSArIG5leHRWYWx1ZS55XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxufSlcblxudmFyIHNvcnRlZF9wb2ludHNfaW5kZXhlc193aXRob3V0X2ZpcnN0ID0gc29ydGVkX3BvaW50c19pbmRleGVzLmNsb25lKCkucmVtb3ZlQXQoMClcblxudmFyIHhiZXppZXIgPSBbXTtcbnZhciB5YmV6aWVyID0gW107XG5cbnNvcnRlZF9wb2ludHNfY29ycmVjdGVkLmVhY2goZnVuY3Rpb24ocG9pbnQpIHtcbiAgICB4YmV6aWVyLnB1c2gocG9pbnQueClcbiAgICB5YmV6aWVyLnB1c2gocG9pbnQueSlcbn0pXG5cbnZhciBzdXBlclBvaW50cyA9IFtdO1xuZm9yICh2YXIgdCA9IDA7IHQgPD0gMTsgdCArPSAwLjAxKSB7XG4gICAgc3VwZXJQb2ludHMucHVzaCh7XG4gICAgICAgIHg6IGJlemllcih4YmV6aWVyLCB0KSxcbiAgICAgICAgeTogYmV6aWVyKHliZXppZXIsIHQpXG4gICAgfSk7XG59XG5cbnZhciBrYXBzZWxUZXh0dXJlID0gUElYSS5UZXh0dXJlLmZyb21JbWFnZSgnaW1nL2thcHNlbC5wbmcnKTtcblxudmFyIGthcHNlbCA9IG5ldyBQSVhJLlNwcml0ZShrYXBzZWxUZXh0dXJlKTtcblxuXG52YXIgYWN0b3JLYXBzZWwgPSBuZXcgcG9wbW90aW9uLkFjdG9yKHtcbiAgICBvblVwZGF0ZTogZnVuY3Rpb24gKG91dHB1dCkge1xuICAgICAgICBjb25zb2xlLmxvZyhvdXRwdXQpO1xuICAgIH1cbn0pO1xuXG52YXIgdHdlZW4gPSBuZXcgcG9wbW90aW9uLlR3ZWVuKHtcbiAgICB2YWx1ZXM6IHtcbiAgICAgICAgeDogMzAwLFxuICAgICAgICB5OiAzMDBcbiAgICB9XG59KTtcblxuYWN0b3JLYXBzZWwuc3RhcnQodHdlZW4pXG5cbnJlbmRlclJvYWQoKTtcbnJlbmRlclBvaW50cygpO1xucmVuZGVyS2Fwc2VsKCk7XG5hbmltYXRlKCk7XG5cbmZ1bmN0aW9uIGFuaW1hdGUoKSB7XG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGFuaW1hdGUpO1xuXG4gICAga2Fwc2VsLnJvdGF0aW9uID0gKGthcHNlbC5yb3RhdGlvbiArIDAuMSlcbiAgICBpZihrYXBzZWwucm90YXRpb24+IEZ1bGwzNjApe1xuICAgICAgICBrYXBzZWwucm90YXRpb24gPSBrYXBzZWwucm90YXRpb24tRnVsbDM2MDtcbiAgICB9XG5cbiAgICAvLyByZW5kZXIgdGhlIGNvbnRhaW5lclxuICAgIHJlbmRlcmVyLnJlbmRlcihzdGFnZSk7XG59XG5cbmZ1bmN0aW9uIHJlbmRlclBvaW50cygpIHtcbiAgICB2YXIgZyA9IG5ldyBQSVhJLkdyYXBoaWNzKCk7XG4gICAgZy5jbGVhcigpO1xuICAgIGcubGluZVN0eWxlKDIsMHhmZmMyYzIpO1xuICAgIGcubW92ZVRvKHNvcnRlZF9wb2ludHNfaW5kZXhlc1swXS54LHNvcnRlZF9wb2ludHNfaW5kZXhlc1swXS55KTtcblxuICAgIHN1cGVyUG9pbnRzLmVhY2goKHBvaW50KT0+e1xuICAgICAgICBnLmxpbmVUbyhwb2ludC54LHBvaW50LnkpXG4gICAgfSlcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc3VwZXJQb2ludHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgZy5iZWdpbkZpbGwoMHhmZjAwMjIpO1xuICAgICAgICBnLmRyYXdDaXJjbGUoc3VwZXJQb2ludHNbaV0ueCxzdXBlclBvaW50c1tpXS55LDEwKTtcbiAgICAgICAgZy5lbmRGaWxsKCk7XG4gICAgfVxuICAgIHN0YWdlLmFkZENoaWxkKGcpXG59XG5cblxuZnVuY3Rpb24gcmVuZGVyUm9hZCgpIHtcbiAgICB2YXIgc3RyaXAgPSBuZXcgUElYSS5tZXNoLlJvcGUoUElYSS5UZXh0dXJlLmZyb21JbWFnZSgnaW1nL3JvYWQuanBnJyksIHN1cGVyUG9pbnRzKTtcbiAgICBzdGFnZS5hZGRDaGlsZChzdHJpcCk7XG59XG5cbmZ1bmN0aW9uIHJlbmRlckthcHNlbCgpIHtcbiAgICBrYXBzZWwuYW5jaG9yLnggPSAwLjU7XG4gICAga2Fwc2VsLmFuY2hvci55ID0gMC41O1xuXG4gICAga2Fwc2VsLnBvc2l0aW9uLnggPSBzdXBlclBvaW50c1sxXS54XG4gICAga2Fwc2VsLnBvc2l0aW9uLnkgPSBzdXBlclBvaW50c1sxXS55XG5cbiAgICBzdGFnZS5hZGRDaGlsZChrYXBzZWwpO1xufVxuXG5cblxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9