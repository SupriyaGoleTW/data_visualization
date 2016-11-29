var dataPoints = [3, 6, 7, 5, 2, 4, 6, 1, 2, 6, 6, 1, 6, 1, 3, 5, 1, 1, 3, 4, 4, 5, 7, 1, 8, 1, 6, 6, 6, 6, 1, 5, 2, 5];

var countPeoplePerLevel = function (skillPoint) {
    var count = 0;
    dataPoints.forEach(function (point) {
        point == skillPoint ? count += 1 : count;
    });
    return count;
};

var arrangeData = function () {
    var skillPointTable = {};
    dataPoints.forEach(function (skillPoint) {
        if (!skillPointTable[skillPoint])
            skillPointTable[skillPoint] = countPeoplePerLevel(skillPoint);
    });
    return skillPointTable;
};
var chart;

var addSkillChart = function (records,name,skillChart) {
    chart ? d3.selectAll('.glow').classed('glow', false) : chart;

    chart = skillChart.selectAll('rect')
        .data(records.data, function (d) {
            return d;
        });

    chart.transition()
        .duration(1000)
        .style("fill","#717D8E");

    chart.classed("glow",true);

    if(records.actualVal)
        showLineAccToData(records,name);

    chart.enter()
        .append('rect')
        .attr('x', function (d) {
            return xScale(d);
        })
        .attr('y', function (d) {
            return yScale(skillPerLevel[d]) + MARGIN;
        })
        .attr('height', function (d) {
            return INNER_HEIGHT - yScale(skillPerLevel[d]);
        })
        .classed('start', true)
        .attr('transform', 'translate(' + MARGIN + ',' + 0 + ')');
};

var skillPerLevel;
const MARGIN = 50;
const HEIGHT = 550;
const WIDTH = 600;
const INNER_HEIGHT = HEIGHT - (2 * MARGIN);


var showLineAccToData = function (method,name) {
    d3.selectAll('.glow').classed('glow', false);
    var line = d3.select('.skillChart').append('g').classed(name,true);

        line.append('line')
        .attr('x1', function () {
            return xScale(xScale.domain()[0]);
        })
        .attr('y1', function () {
            return yScale(method.actualVal);
        })
        .attr('x2', function () {
            return xScale(xScale.domain()[1]);
        })
        .attr('y2', function () {
            return yScale(method.actualVal);
        });

    line.append('text')
        .attr('x',function () {
            return xScale(xScale.domain()[1]);
        })
        .attr('y',function () {
            return yScale(method.actualVal);
        })
        .text(name);

    line.attr('transform', 'translate(' + MARGIN + ',' + MARGIN + ')');

};

var removeUnnecessaryValues = function (val) {
    return val != undefined;
};

var getAppropriateRect = function (skillPerLevel, func) {
    var keys = Object.keys(skillPerLevel);
    var values = Object.values(skillPerLevel);
    var expected = Math.round(func(values));

    var dataOfValues = values.map(function (val, index) {
        if (val == expected && values.indexOf(val) > -1) {
            return index;
        }

    }).filter(removeUnnecessaryValues);

    return dataOfValues.map(function (d) {
        return keys[d];
    });
};

var xScale, yScale;
var glowRect = function (methods, func,skillChart) {
    methods.forEach(function (method) {
        d3.select('#' + method.name)
            .on('click', function () {
                func(method.data,method.name,skillChart);
            });
    });
};
var addLabelToAxis = function (svg, title, x, y, rotateWith) {
    var label = svg.append("text")
        .attr("text-anchor", "middle")
        .text(title);

    var translateWith = "translate(" + x + "," + y + ")";
    rotateWith ?
        label.attr("transform", translateWith+rotateWith) :
        label.attr("transform", translateWith);
};
var visualize = function () {
    skillPerLevel = arrangeData();
    var arrayMethods = [
        {name: 'min', data: {data:getAppropriateRect(skillPerLevel, d3.min),actualVal:d3.min(Object.values(skillPerLevel))}},
        {name: 'max', data: {data:getAppropriateRect(skillPerLevel, d3.max),actualVal:d3.max(Object.values(skillPerLevel))}}
    ];

    var otherMethods = [
        {name: 'mean', data: {actualVal: d3.mean(Object.keys(skillPerLevel))}},
        {name: 'deviation', data: {actualVal: d3.deviation(Object.keys(skillPerLevel))}}
    ];
    var util = new Util(HEIGHT, WIDTH, MARGIN);
    var svg = util.createSvg(d3.select('.container'), 'ttSkillChart', [1, 10], [0, 10]);
    var scales = util.createScales(d3.scaleLinear(), d3.scaleLinear(), [1, 10], [0, 10]);
    xScale = scales.xScale;
    yScale = scales.yScale;

    var skillChart = svg.append('g').classed('skillChart', true);
    addSkillChart({data:Object.keys(skillPerLevel)},'basicChart',skillChart);

    glowRect(arrayMethods,addSkillChart, skillChart);

    glowRect(otherMethods,showLineAccToData);

    addLabelToAxis(svg,'Count Of People',(MARGIN / 2),(HEIGHT / 2),'rotate(-90)');
    addLabelToAxis(svg,'Skill Level',(WIDTH/2),(HEIGHT-(MARGIN/3)));
};

window.onload = visualize;