var dataPoints = d3.range(1, 11);

var addTextToCircle = function (expectedCircles, xScale, fontScale, operationType) {
    expectedCircles.append('text')
        .attr('x', function (d) {
            return xScale(d);
        })
        .attr('y', 150)
        .text(function (d) {
            if(operationType == 'sum')
                return d*10;
            return d;
        })
        .style('font-size', function (d) {
            return fontScale(d);
        });
};

var showCircles = function (svg, scales, record) {
    svg.selectAll('circle').remove();
    svg.selectAll('text').remove();
    var expectedCircles = svg.selectAll('circle')
        .data(record.data, function (d) {
            return d;
        })
        .enter();

    expectedCircles.append('circle')
        .attr('cx', function (d) {
            return scales.xScale(d);
        })
        .attr('cy', 150)
        .attr('r', function (d) {
            return scales.radiusScale(d);
        });

    addTextToCircle(expectedCircles, scales.xScale, scales.fontScale,record.name);
};
var showData = function (_div, type) {
    _div.selectAll('div')
        .data(dataPoints)
        .enter()
        .append('div')
        .text(function (d) {
            return d;
        })
        .classed(type, true);
};
var createScales = function () {
    var radiusScale = d3.scaleLinear().domain([1, 11]).range([10, 100]);
    var xScale = d3.scaleLinear().domain([1, 11]).range([150, 300]);
    var fontScale = d3.scaleLinear().domain([1, 11]).range([10, 50]);
    return {radiusScale: radiusScale, xScale: xScale, fontScale: fontScale};
};
var loadChart = function () {
    var arrayHelperFunctions = [
        {name: 'min', data: [d3.min(dataPoints)]},
        {name: 'max', data: [d3.max(dataPoints)]},
        {name: 'extent', data: d3.extent(dataPoints)},
        {name: 'mean', data: [d3.mean(dataPoints)]},
        {name: 'sum', data: [d3.sum(dataPoints)/10]},
        {name: 'variance', data: [Math.round(d3.variance(dataPoints))]},
        {name: 'deviation', data: [Math.round(d3.deviation(dataPoints))]}
    ];

    var quantileFunctions = [
        {name: 'quantile0', data: [d3.quantile(dataPoints, 0)]},
        {name: 'quantile0.25', data: [d3.quantile(dataPoints, 0.25)]},
        {name: 'quantile0.50', data: [d3.quantile(dataPoints, 0.50)]},
        {name: 'quantile0.75', data: [d3.quantile(dataPoints, 0.75)]},
        {name: 'quantile1', data: [d3.quantile(dataPoints, 1)]}
    ];

    var _div = d3.select('.numbers');

    showData(_div, 'shape');

    var scales = createScales();

    var svg = d3.select('.output')
        .append('svg')
        .attr('height', 300)
        .attr('width', 500);

    arrayHelperFunctions.forEach(function (record) {
        d3.select('#' + record.name)
            .on('click', function () {
                showCircles(svg, scales, record);
            });
    });

    d3.select('.quantile-list').on('change', function () {
        var select = d3.select('select');
        var selectedIndex = select.property('selectedIndex');
        var record = quantileFunctions[selectedIndex];
        showCircles(svg, scales, record);
    });
};

window.onload = loadChart;