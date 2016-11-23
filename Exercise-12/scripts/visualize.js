var xScale, yScale;
var x = 0;
var createAreaScale = function (startOfChart) {
    return d3.area()
        .x(function (d) {
            return xScale(d / 10);
        })
        .y0(startOfChart)
        .y1(function (d) {
            return yScale((3 * Math.sin(d) + 5) / 10)
        });
};

var createLineScale = function () {
    return d3.line()
        .x(function (d) {
            return xScale(d / 10);
        })
        .y(function (d) {
            return yScale(((3 * Math.sin(d)) + 5) / 10);
        });
};

var addPath = function (dataPoints, scale, type, co_ord,util) {
    util.addCurveToGraph(scale,xScale,yScale,co_ord,co_ord,d3.select('svg'),dataPoints, type);
    util.addCircles(dataPoints,'.line',3,5);
};

var loadChart = function () {
    var dataPoints = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9,10];
    const WIDTH = 500;
    const HEIGHT = 500;
    const MARGIN = 50;
    var util = new Util(HEIGHT, WIDTH, MARGIN);
    var svg = util.createSvg(d3.select('.container'), 'areaChart');
    var scales = util.createScales(d3.scaleLinear(), d3.scaleLinear(), [0, 1], [0, 1]);
    xScale = scales.xScale;
    yScale = scales.yScale;

    var area = createAreaScale(HEIGHT - (2*MARGIN));
    addPath(dataPoints, area, 'area', MARGIN, util);
    var line = createLineScale();
    addPath(dataPoints, line, 'line', MARGIN, util);
};

window.onload = loadChart;
