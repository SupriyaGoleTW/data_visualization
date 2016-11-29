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

var generateLineScale = function (curveType, valueType, shiftBy) {
    var scale = d3.line()
        .x(function (d) {
            return xScale(d.x / 10);
        })
        .y(function (d) {
            if (valueType)
                return yScale(Math.sin(d.x) / 10 + shiftBy);
            return yScale(d.y / 10);
        });
    
    if (curveType)
        scale.curve(curveType);
    return scale;

};

var xScale, yScale,util;

var createSvg = function (classType,title) { // todo pass x and y domain in util ; WIP
    const WIDTH = 500;
    const HEIGHT = 500;
    const MARGIN = 50;
    util = new Util(HEIGHT,WIDTH,MARGIN);
    var scales = util.createScales(d3.scaleLinear(),d3.scaleLinear(),[0,1],[0,1]);
    xScale = scales.xScale;
    yScale = scales.yScale;
    return util.createSvg(classType, title);
};

var createLineChart = function (svg, isCircleRequired, curveType, title) {
    const MARGIN = 50;
    var shiftBy = 0.5;
    var lineScale = generateLineScale(curveType);
    var lineWithSinScale = generateLineScale(curveType, Math.sin, shiftBy);
    
    svg.append('title').text(title);

    if (!isCircleRequired) {
        var lineGroup = svg.append('g').classed('lineGroup', true);
        var lineGroupWithSin = svg.append('g').classed('lineGroupWithSin', true);

        addLineChart(lineGroup, lineScale);
        addLineChart(lineGroupWithSin, lineWithSinScale);
    } else {
        addCirclesToEdgeOfLine('lineGroup');
        addCirclesToEdgeOfLine('lineGroupWithSin', Math.sin)
    }

    d3.selectAll('.lineGroup')
        .attr('transform', Util.prototype.translate(MARGIN, MARGIN));
    d3.selectAll('.lineGroupWithSin')
        .attr('transform', Util.prototype.translate(MARGIN, MARGIN));
};

var addLineChartToGraph = function (isCircleRequired, curveType, title) {
    if (!isCircleRequired) {
        d3.select('svg').select('.lineGroup').remove();
        d3.select('svg').select('.lineGroupWithSin').remove();
    }
    createLineChart(svg, isCircleRequired, curveType, title);
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

    var options = util.generateDropdownList(interpolationTechniques,'.curves');
    
        options.on('change', function () {
            var select = d3.select('select');
            var selectedIndex = select.property('selectedIndex');
            var curveType = interpolationTechniques[selectedIndex];
            addLineChartToGraph(false, curveType.curve, curveType.title);
            addLineChartToGraph(true, curveType.curve, curveType.title);
        });
    
};

var visualize = function () {
    svg = createSvg(d3.select('.container'),'lines');
    showDropdown();
};

window.onload = visualize;