var data = [
    {x: 0, y: 5},
    {x: 1, y: 9},
    {x: 2, y: 7},
    {x: 3, y: 5},
    {x: 4, y: 3},
    {x: 6, y: 4},
    {x: 7, y: 2},
    {x: 8, y: 3},
    {x: 9, y: 2}
];

var addLineChart = function (lineGroup, valueType) {
    lineGroup.append('path')
        .datum(data)
        .attr('d', valueType);
};

var translate = function (x,y) {
    return 'translate(' + x + ', ' + y + ')';
};

var addCirclesToEdgeOfLine = function (group, valueType) {
    group.selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .attr('cx', function (d) {
            return xScale(d.x / 10);
        })
        .attr('cy', function (d) {
            if (valueType) {
                return yScale(valueType(d.x) / 10 + 0.5);
            }
            return yScale(d.y / 10);
        })
        .attr('r', 3);
};

var addAxis = function (axis, x, y) {
    d3.select('svg').append('g')
        .attr('transform', translate(x,y))
        .call(axis);
};
var generateLineScale = function (valueType, shiftBy) {
    return d3.line()
        .x(function (d) {
            return xScale(d.x / 10);
        })
        .y(function (d) {
            if (valueType)
                return yScale(Math.sin(d.x) / 10 + shiftBy);
            return yScale(d.y / 10);
        });
};

var xScale, yScale;

var visualize = function () {
    const MARGIN = 30;
    const HEIGHT = 750;
    const WIDTH = 1000;
    const shiftBy = 0.5;

    const INNERWIDTH = WIDTH - (2 * MARGIN);
    const INNERHEIGHT = HEIGHT - (2 * MARGIN);

    xScale = d3.scaleLinear().domain([0, 1]).range([0, INNERWIDTH]);
    yScale = d3.scaleLinear().domain([0, 1]).range([INNERHEIGHT, 0]);

    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale);

    var svg = d3.select('.container')
        .append('svg')
        .attr('height', HEIGHT)
        .attr('width', WIDTH);

    addAxis(xAxis, MARGIN, HEIGHT - MARGIN);
    addAxis(yAxis, MARGIN, MARGIN);

    var lineScale = generateLineScale();
    var lineWithSinScale = generateLineScale(Math.sin, shiftBy);

    var lineGroup = svg.append('g').classed('lineGroup', true);
    addLineChart(lineGroup, lineScale);
    addCirclesToEdgeOfLine(lineGroup);

    var sinGroup = svg.append('g').classed('lineGroup', true);
    addLineChart(sinGroup, lineWithSinScale);
    addCirclesToEdgeOfLine(sinGroup, Math.sin);

    d3.selectAll('.lineGroup')
        .attr('transform', translate(MARGIN,MARGIN));
};

window.onload = visualize;