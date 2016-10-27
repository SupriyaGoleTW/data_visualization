const HEIGHT = 700;
const WIDTH = 1000;
const MARGIN = 20;
const RANDOM_NUMBER_SIZE = 10;

var generateRandomNumbers = function () {
    var randomNumbers = [];
    for (var index = 0; index < RANDOM_NUMBER_SIZE; index++) {
        var randomNumber = Math.abs(Math.random() * 100);
        randomNumbers.push(randomNumber);
    }
    return randomNumbers;
};

var createGrid = function (svg) {
    d3.selectAll('svg .xAxis .tick')
        .append('line')
        .classed('grid', true)
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', 0)
        .attr('y2', -(HEIGHT - MARGIN));

    d3.selectAll('svg .yAxis .tick')
        .append('line')
        .classed('grid', true)
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', (WIDTH - MARGIN))
        .attr('y2', 0);
};
var xScale, yScale;

var createAxis = function (svg) {
    xScale = d3.scaleLinear()
        .domain([0, RANDOM_NUMBER_SIZE - 1])
        .range([0, WIDTH - (2 * MARGIN)]);

    yScale = d3.scaleLinear()
        .domain([0, 100])
        .range([HEIGHT - (2 * MARGIN), 0]);

    var xAxis = d3.axisBottom(xScale).ticks(10);
    svg.append('g')
        .attr('transform', translate(MARGIN, HEIGHT - MARGIN))
        .classed('xAxis', true)
        .call(xAxis);

    var yAxis = d3.axisLeft(yScale).ticks(10);
    svg.append('g')
        .attr('transform', translate(MARGIN, MARGIN))
        .classed('yAxis', true)
        .call(yAxis);
};

var translate = function (x, y) {
    return 'translate(' + x + ',' + y + ')';
};

var createChart = function () {
    var svg = d3.select('.container').append('svg')
        .attr('height', HEIGHT)
        .attr('width', WIDTH);
    createAxis(svg);
    createGrid(svg);
    return svg;
};

var randomLineGenerator = function (line, svg) {
    var randomNumbers = generateRandomNumbers();
    var g = svg.append('g')
        .classed('lineGroup', true);

    g.append('path')
        .classed('randomLines', true)
        .attr('transform', translate(MARGIN, MARGIN))
        .attr('d', line(randomNumbers));
    return g;
};

var lineScale = function () {
    var line = d3.line()
        .x(function (q, index) {
            return xScale(index)
        })
        .y(function (q) {
            return yScale(q)
        });
    return line;
};

var loadLiveRandomNumbersData = function (svg) {
    var line = lineScale();
    var g = randomLineGenerator(line, svg);
    var lineInterval = setInterval(function () {
        svg.selectAll('.lineGroup').remove();
        randomLineGenerator(line, svg);
    }, 500);
    g.selectAll('path').exit().remove();

    return lineInterval;
};

var updateBarChart = function (svg, randomNumbers) {
    var g = svg.append('g')
        .classed('barGroup', true);
    g.selectAll('rect')
        .data(randomNumbers)
        .enter().append('rect')
        .attr('x', function (r, index) {
            return xScale(index)
        })
        .attr('y', function (r) {
            var barHeight = HEIGHT - yScale(r) - MARGIN;
            return barHeight
        })
        .attr('height', function (r) {
            return yScale(r)
        })
        .attr('width', 10)
        .attr('transform', translate(MARGIN, 0));
    return g;
};

var loadRandomBarChart = function (svg) {
    var randomNumbers = generateRandomNumbers();
    updateBarChart(svg, randomNumbers);

    var barInterval = setInterval(function () {
        svg.selectAll('.barGroup').remove();
        randomNumbers.shift();
        var aRandomNum = Math.abs(Math.random() * 100);
        randomNumbers.push(aRandomNum);
        updateBarChart(svg, randomNumbers);
    }, 500);
    return barInterval;
};

window.onload = function () {
    var barInterval,lineInterval;
    var svg = createChart();
    d3.select('#bar').on('click', function () {
        clearInterval(lineInterval);
        barInterval = loadRandomBarChart(svg);
        svg.selectAll('.lineGroup').remove();
        svg.selectAll('.barGroup').remove();
    });
    d3.select('#line').on('click', function () {
        clearInterval(barInterval);
        lineInterval = loadLiveRandomNumbersData(svg);
        svg.selectAll('.lineGroup').remove();
        svg.selectAll('.barGroup').remove();
    });
};