const INNER_WIDTH = 600;
var RANGE_OF_NUMBERS = 100;
var xScale, colorScale;

var generateRandomNumbers = function () {
    var randomNumbers = [];
    for (var index = 0; index < 10; index++) {
        var randomNumber = Math.floor(Math.random() * 100) + 1;
        randomNumbers.push({val:randomNumber,key:++RANGE_OF_NUMBERS});
    }
    return randomNumbers;
};


var createScale = function () {
    xScale = d3.scaleLinear()
        .domain([0, RANGE_OF_NUMBERS])
        .range([0, INNER_WIDTH]);

    colorScale = d3.scaleLinear()
        .domain([1, 100])
        .range(['#e7e7f0', '#686690']);
};

var loadChart = function (randomNumbers) {
    //bar-chart main div
    var div = d3.select('.bar-chart');
    //adding div's as per data
    var selectedDivs = div.selectAll('div')
        .data(randomNumbers, function (d) {
            return d.key;
        });

    selectedDivs.enter()
        .append('div')
        .style('width', function (d) {
            return xScale(d.val) + "px";
        })
        .style('background-color', function (d) {
            return colorScale(d.val);
        })
        .text(function (d) {
            return d.val;
        })
        .classed('horizontal-bar', true);

    selectedDivs.exit().remove();
};

var updateChart = function () {
    createScale();
    var randomNumbers = generateRandomNumbers();
    setInterval(function () {
        var num = Math.floor(Math.random() * 100) + 1;
        randomNumbers.push({val:num,key:++RANGE_OF_NUMBERS});
        loadChart(randomNumbers);
        randomNumbers.shift();
    }, 1000);
};

window.onload = updateChart;
