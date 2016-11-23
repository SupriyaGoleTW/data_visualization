var dataPoints = [1, 1, 2, 2, 1, 2, 1];
const WIDTH = 500;
const HEIGHT = 500;
const outerRadius = Math.min(WIDTH, HEIGHT) / 2;

var createPieChart = function (colorScale, chart) {
    d3.select('g').remove();
    var arc = d3.arc()
        .outerRadius(outerRadius - 10)
        .innerRadius(chart.innerRadius);

    var pie = d3.pie()
        .value(function (d) {
            return d;
        })
        .startAngle(0)
        .endAngle(chart.endAngle)(dataPoints);

    var g = d3.select('svg').append('g')
        .classed(chart.title, true);

    g.selectAll('.pie')
        .data(pie)
        .enter()
        .append('path')
        .attr('d', arc)
        .style('fill', function (d) {
            return colorScale(d.index);
        });

    d3.select('.' + chart.title).attr("transform", "translate(" + [WIDTH / 2, HEIGHT / 2] + ")");

};

var visualizePieCharts = function (colorScale) {
    var util = new Util(HEIGHT,WIDTH,50);
    var charts = [
        {title: 'fullPie', innerRadius: 0, endAngle: 360},
        {title: 'halfPie', innerRadius: 0, endAngle: Math.PI},
        {title: 'donutPie', innerRadius: outerRadius/2, endAngle: 360},
        {title: 'halfDonutPie', innerRadius: outerRadius/2, endAngle: Math.PI}
    ];

    var options = util.generateDropdownList(charts,'curves');

    options.on('change', function () {
        var select = d3.select('select');
        var selectedIndex = select.property('selectedIndex');
        var curveType = charts[selectedIndex];
        createPieChart(colorScale,curveType);
    });
};

var loadPieChart = function () {
    var colorScale = d3.scaleOrdinal(d3.schemeCategory20).domain([0, dataPoints.length]);
    var svg = d3.select('.container')
        .append('svg')
        .attr('height', HEIGHT)
        .attr('width', WIDTH);
    visualizePieCharts(colorScale);
};

window.onload = loadPieChart;