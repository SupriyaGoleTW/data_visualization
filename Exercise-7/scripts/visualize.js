var data = [{x: 0, y: 5}, {x: 1, y: 9}, {x: 2, y: 7}, {x: 3, y: 5}, {x: 4, y: 3}, {x: 6, y: 4},
    {x: 7, y: 2}, {x: 8, y: 3}, {x: 9, y: 2}
];

var addLineChart = function (group, scale) {
    group.select('path').remove();
    group.selectAll('circle').remove();

    return group.append('path')
        .datum(data)
        .attr('d', scale);
};

var translate = function (x, y) {
    return 'translate(' + x + ', ' + y + ')';
};

var addCirclesToEdgeOfLine = function (groupType, valueType) {
    var chart = d3.select('.' + groupType);
    chart.selectAll('circle')
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
        .attr('transform', translate(x, y))
        .call(axis);
};

var generateLineScale = function (curveType,valueType, shiftBy) {
    var scale = d3.line()
        .x(function (d) {
            return xScale(d.x / 10);
        })
        .y(function (d) {
            if (valueType)
                return yScale(Math.sin(d.x) / 10 + shiftBy);
            return yScale(d.y / 10);
        });
    if(curveType)
        scale.curve(curveType);
    return scale;

};

var xScale, yScale;

var createSvg = function () {
    const WIDTH = 500;
    const HEIGHT = 500;
    const MARGIN = 50;
    var xAxis,yAxis;

    const INNERWIDTH = WIDTH - (2 * MARGIN);
    const INNERHEIGHT = HEIGHT - (2 * MARGIN);

    xScale = d3.scaleLinear().domain([0, 1]).range([0, INNERWIDTH]);
    yScale = d3.scaleLinear().domain([0, 1]).range([INNERHEIGHT, 0]);

    xAxis = d3.axisBottom(xScale);
    yAxis = d3.axisLeft(yScale);

    var svg = d3.select('.container')
        .append('svg')
        .attr('height', HEIGHT)
        .attr('width', WIDTH);

    addAxis(xAxis, MARGIN, HEIGHT - MARGIN);
    addAxis(yAxis, MARGIN, MARGIN);
    return svg;
};

var createLineChart = function (svg, isCircleRequired, curveType) {
    const MARGIN = 50;
    var shiftBy = 0.5;
    var lineScale = generateLineScale(curveType);
    var lineWithSinScale = generateLineScale(curveType,Math.sin, shiftBy);

    if (!isCircleRequired) {
        var lineGroup = svg.append('g').classed('lineGroup', true);
        var lineGroupWithSin = svg.append('g').classed('lineGroupWithSin', true);

        addLineChart(lineGroup, lineScale);
        addLineChart(lineGroupWithSin, lineWithSinScale);
    } else {
        addCirclesToEdgeOfLine('lineGroup');
        addCirclesToEdgeOfLine('lineGroupWithSin',Math.sin)
    }

    d3.selectAll('.lineGroup')
        .attr('transform', translate(MARGIN, MARGIN));
    d3.selectAll('.lineGroupWithSin')
        .attr('transform', translate(MARGIN, MARGIN));
};

var addLineChartToGraph = function (isCircleRequired,curveType) {
    if (!isCircleRequired) {
        d3.select('svg').select('.lineGroup').remove();
        d3.select('svg').select('.lineGroupWithSin').remove();
    }
    createLineChart(svg, isCircleRequired, curveType);
};

var svg;
var showDropdown = function () {
    var interpolationTechniques = [
        {curve: d3.curveLinear, title: 'curveLinear'},
        {curve: d3.curveLinearClosed, title: 'curveLinearClosed'},
        {curve: d3.curveStep, title: 'curveStep'},
        {curve: d3.curveBasis, title: 'curveBasis'},
        {curve: d3.curveBundle.beta(0.7), title: 'curveBundle'},
        {curve: d3.curveCardinalClosed, title: 'curveCardinalClosed'},
        {curve: d3.curveCatmullRom.alpha(0.25), title: 'curveCatmullRom1'},
        {curve: d3.curveCatmullRom, title: 'curveCatmullRom2'}
    ];

    var options = d3.select('.curves')
        .append('select')
        .on('change',function () {
            var select = d3.select('select');
            var selectedIndex = select.property('selectedIndex');
            var curveType = interpolationTechniques[selectedIndex].curve;
            addLineChartToGraph(false,curveType);
            addLineChartToGraph(true,curveType);
        });

    options.selectAll('option')
        .data(interpolationTechniques)
        .enter()
        .append('option')
        .text(function (d) {
            return d.title;
        })
        .attr("value", function (d) {
            return d.title;
        });


};

var visualize = function () {
    svg = createSvg();
    showDropdown();
};

window.onload = visualize;