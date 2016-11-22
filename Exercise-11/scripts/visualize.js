var dataPoints = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
var xScale, yScale;
var addCircles = function (xScale, yScale) {
    var chart = d3.selectAll('.lines');
    chart.selectAll('circle')
        .data(dataPoints)
        .enter()
        .append('circle')
        .attr('cx', function (d) {
            return xScale(d / 10);
        })
        .attr('cy', function (d) {
            return yScale(((Math.sin(3 * d) + 1) / 2));
        })
        .attr('r', 5);
};

var createLineScale = function (xScale, yScale, curve) {
    return d3.line()
        .x(function (d) {
            return xScale(d / 10);
        })
        .y(function (d) {
            return yScale(((Math.sin(3 * d) + 1) / 2));
        })
        .curve(curve);
};

var addCurveToGraph = function (lineScale, xScale, yScale, MARGIN, svg) {
    svg.append('g')
        .classed('lines', true)
        .append('path')
        .datum(dataPoints)
        .attr('d', lineScale);

    addCircles(xScale, yScale);
    d3.selectAll('.lines').attr('transform', 'translate(' + MARGIN + ',' + MARGIN + ')');
};

var processAllCurves = function () {
    var curveWithTensionValue = [
        {curve: d3.curveCardinal.tension(0.20), title: 'curveCardinal1'},
        {curve: d3.curveCardinal.tension(0.40), title: 'curveCardinal2'},
        {curve: d3.curveCardinal.tension(0.60), title: 'curveCardinal3'},
        {curve: d3.curveCardinal.tension(0.80), title: 'curveCardinal4'},
        {curve: d3.curveCardinal.tension(1), title: 'curveCardinal5'}
    ];

    curveWithTensionValue.forEach(function (curveType) {
        loadChart(curveType)
    });
};

var loadChart = function (curve) {
    const WIDTH = 500;
    const HEIGHT = 500;
    const MARGIN = 50;
    var util = new Util(HEIGHT, WIDTH, MARGIN);
    var svg = util.createSvg(d3.select('.container'), curve.title);
    var scales = util.createScales(d3.scaleLinear(), d3.scaleLinear(), [0, 1], [0, 1]);
    xScale = scales.xScale;
    yScale = scales.yScale;
    var lineScale = createLineScale(xScale, yScale, curve.curve);
    addCurveToGraph(lineScale, xScale, yScale, MARGIN, svg);
};

window.onload = processAllCurves;