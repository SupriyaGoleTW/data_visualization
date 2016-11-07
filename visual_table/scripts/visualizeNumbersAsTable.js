const INNER_HEIGHT = 780;
const INNER_WIDTH = 1000;

var numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
var numberScale = d3.scaleOrdinal().domain(numbers).range(numbers);
var squareScale = d3.scalePow().exponent(2);
var logScale = function (d) {
    return d3.scaleLog()(d).toFixed(3);
};
var roundLogScale = d3.scaleLog().rangeRound([0, 2]);

var addDataInRow = function (row, scale) {
    row.selectAll('td')
        .data(numbers, function (d) {
            return d;
        })
        .enter()
        .append('td')
        .text(function (d) {
            return scale(d);
        });
};

var appendRow = function (scale, title) {
    var selection = d3.select('table tbody').append('tr');
    selection.append('td').text(title);
    addDataInRow(selection, scale);
};

var visualize = function () {
    var container = d3.select('.container')
        .attr('height', INNER_HEIGHT)
        .attr('width', INNER_WIDTH);

    var table = container.append('table');
    table.append('tbody');

    appendRow(numberScale, 'Title');
    appendRow(numberScale, 'Value');
    appendRow(squareScale, 'Square');
    appendRow(logScale, 'Log(n)');
    appendRow(roundLogScale, 'Round Log(n)');
};

window.onload = visualize;