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

var addLineChart = function (lineGroup, valueType, title) {
    lineGroup.append('text').text(title);
    lineGroup.append('path')
        .datum(data)
        .attr('d', valueType)
};

var translate = function (x, y) {
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

var addAxis = function (axis, x, y, title) {
    d3.select('.'+title).append('g')
        .attr('transform', translate(x, y))
        .call(axis);
};

var generateLineScale = function (valueType, shiftBy, curveType) {
    return d3.line()
        .x(function (d) {
            return xScale(d.x / 10);
        })
        .y(function (d) {
            if (valueType)
                return yScale(Math.sin(d.x) / 10 + shiftBy);
            return yScale(d.y / 10);
        })
        .curve(curveType)
};

var xScale, yScale;

var showAllCharts = function () {
    var interpolationTechniques = [
        {curve:d3.curveLinear,title:'curveLinear'},
        {curve:d3.curveLinearClosed,title:'curveLinearClosed'},
        {curve:d3.curveStep,title:'curveStep'},
        {curve:d3.curveBasis,title:'curveBasis'},
        {curve:d3.curveBundle.beta(0.7),title:'curveBundle'},
        {curve:d3.curveCardinalClosed,title:'curveCardinalClosed'},
        {curve:d3.curveCatmullRom.alpha(0.25),title:'curveCatmullRom1'},
        {curve:d3.curveCatmullRom,title:'curveCatmullRom2'}
    ];

    interpolationTechniques.forEach(function (technique) {
       showLineChart(technique);
    });

};

var showLineChart = function (technique) {
    const MARGIN = 30;
    const HEIGHT = 500;
    const WIDTH = 500;
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
        .attr('width', WIDTH)
        .classed(technique.title,true);

    addAxis(xAxis, MARGIN, HEIGHT - MARGIN, technique.title);
    addAxis(yAxis, MARGIN, MARGIN, technique.title);

    var lineScale = generateLineScale(null,null,technique.curve);
    var lineWithSinScale = generateLineScale(Math.sin, shiftBy,technique.curve);

    var lineGroup = svg.append('g').classed('lineGroup', true);
    addLineChart(lineGroup, lineScale,technique.title);
    addCirclesToEdgeOfLine(lineGroup);

    var sinGroup = svg.append('g').classed('lineGroupWithSin', true);
    addLineChart(sinGroup, lineWithSinScale,technique.title);
    addCirclesToEdgeOfLine(sinGroup, Math.sin);

    d3.selectAll('.lineGroup')
        .attr('transform', translate(MARGIN, MARGIN));
    d3.selectAll('.lineGroupWithSin')
        .attr('transform', translate(MARGIN, MARGIN));
};

window.onload = showAllCharts;