const WIDTH = 100;
const HEIGHT = 100;
const SPACING_BETWEEN_SHAPES = 50;
const DIMENSION = 100;
var initial = 0;
const yPos = 5;

var drawLine = function (svg) {
    svg.append('line')
        .attr('x1', initial + DIMENSION)
        .attr('y1', yPos)
        .attr('x2', initial)
        .attr('y2', DIMENSION);
};

var drawCircle = function (svg) {
    const RADIUS = DIMENSION / 2;

    svg.append('circle')
        .attr('cx', initial + RADIUS)
        .attr('cy', RADIUS + yPos)
        .attr('r', RADIUS);
};

var drawRect = function (svg) {
    svg.append('rect')
        .attr('x', initial)
        .attr('y', yPos)
        .attr('height', HEIGHT)
        .attr('width', WIDTH)
        .attr('rx',10)
        .attr('ry',10);
};

var createPolygon = function () {
    const x1 = initial + (DIMENSION / 2);
    const y1 = yPos;
    const x2 = initial;
    const y2 = DIMENSION;
    const x3 = initial + DIMENSION;
    const y3 = DIMENSION;
    return x1 + ',' + y1 + ' ' + x2 + ',' + y2 + ' ' + x3 + ',' + y3;
};

var drawTriangle = function (svg) {
    svg.append('polygon')
        .attr('points', createPolygon());
};

var shapesToDraw = [drawLine, drawCircle, drawRect, drawTriangle];

var visualize = function () {
    var svg = d3.select('.container')
        .append('svg')
        .attr('height', 850)
        .attr('width', 800);

    svg.selectAll('.shape')
        .data(shapesToDraw, function (d) {
            return d;
        })
        .enter()
        .each(function (shape) {
            shape(svg);
            initial = initial + DIMENSION + SPACING_BETWEEN_SHAPES;
        });
};

window.onload = visualize;