var loadChart = function () {
    const WIDTH = 500;
    const HEIGHT = 500;
    const MARGIN = 50;
    var util = new Util(HEIGHT, WIDTH, MARGIN);
    var svg = util.createSvg(d3.select('.container'), curve.title);
    var scales = util.createScales(d3.scaleLinear(), d3.scaleLinear(), [0, 1], [0, 1]);
    xScale = scales.xScale;
    yScale = scales.yScale;
    // var lineScale = createLineScale(xScale, yScale, curve.curve);
    // addCurveToGraph(lineScale, xScale, yScale, MARGIN, svg);
};

window.onload = loadChart;
