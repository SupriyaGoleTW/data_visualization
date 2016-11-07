var numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
var addDataInRow = function (row, scale) {
    row.selectAll('td')
        .data(numbers, function (d) {return d;})
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
    var container = d3.select('.container');

    var table = container.append('table');
    table.append('tbody');

    appendRow(d3.scaleOrdinal(numbers).domain(numbers), 'Title');
    appendRow(d3.scaleOrdinal(numbers).domain(numbers), 'N');
    appendRow(d3.scalePow().exponent(2), 'Square');
    appendRow(function(d){return d3.scaleLog()(d).toFixed(3)}, 'Log(n)');
    appendRow(d3.scaleLog().rangeRound([0, 2]), 'Round Log(n)');
};

window.onload = visualize;