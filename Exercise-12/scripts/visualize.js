var xScale, yScale;
var x = 0;
var createAreaScale = function (startOfChart, curve) {
    var area = d3.area()
        .x(function (d) {
            return xScale(d / 10);
        })
        .y0(startOfChart)
        .y1(function (d) {
            return yScale((3 * Math.sin(d) + 5) / 10)
        });

    if (curve)
        area.curve(curve);
    return area;
};

var createLineScale = function (technique) {
    var line = d3.line()
        .x(function (d) {
            return xScale(d / 10);
        })
        .y(function (d) {
            return yScale(((3 * Math.sin(d)) + 5) / 10);
        });

    if (technique)
        line.curve(technique);

    return line;

};

var addAreaPath = function (svg, dataPoints, scale, type, co_ord, util) {
    var chart = util.addCurveToGraph(scale, xScale, yScale, co_ord, co_ord, svg, dataPoints, type);
    chart.classed('areaChart', true);
};

var addLinePath = function (svg, dataPoints, scale, type, co_ord, util) {
    var chart = util.addCurveToGraph(scale, xScale, yScale, co_ord, co_ord, svg, dataPoints, type);
    chart.classed('lineChart', true);
    util.addCircles(dataPoints, type, 3, 5);
};

var processAllInterpolationTechniques = function () {
    var interpolationTechniques = [
        {curve: d3.curveLinear, title: 'curveLinear'},
        {curve: d3.curveLinearClosed, title: 'curveLinearClosed'},
        {curve: d3.curveStep, title: 'curveStep'},
        {curve: d3.curveCardinalClosed, title: 'curveCardinalClosed'},
        {curve: d3.curveBasisOpen, title: 'curveBasisOpen'},
        {curve: d3.curveBundle.beta(1), title: 'curveBundle'}
    ];

    interpolationTechniques.forEach(function (technique) {
        loadChart(technique);
    });
};

var loadChart = function (technique) {
    var dataPoints = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const WIDTH = 500;
    const HEIGHT = 500;
    const MARGIN = 50;
    var util = new Util(HEIGHT, WIDTH, MARGIN);
    var svg = util.createSvg(d3.select('.container'), technique.title + 'curve');
    var scales = util.createScales(d3.scaleLinear(), d3.scaleLinear(), [0, 1], [0, 1]);
    xScale = scales.xScale;
    yScale = scales.yScale;

    var area = createAreaScale(HEIGHT - (2 * MARGIN), technique.curve);
    addAreaPath(svg, dataPoints, area, technique.title + 'area', MARGIN, util);

    var line = createLineScale(technique.curve);
    addLinePath(svg, dataPoints, line, technique.title + 'line', MARGIN, util);
};

window.onload = processAllInterpolationTechniques;
