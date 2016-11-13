var numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
var tableData = [
    {title: 'Title', scale: d3.scaleOrdinal(numbers).domain(numbers), cell: 'th'},
    {title: 'N', scale: d3.scaleOrdinal(numbers).domain(numbers), cell: 'td'},
    {title: 'N-Square', scale: d3.scalePow().exponent(2), cell: 'td'},
    {title: 'LOG', scale: function (d) {return d3.scaleLog()(d).toFixed(3);}, cell: 'td'},
    {title: 'RANGE ROUND', scale: d3.scaleLog().rangeRound([0, 2]), cell: 'td'}
];

var addDataInRow = function (row, record) {
    row.append(record.cell).text(record.title);
    row.selectAll(record.cell)
        .data(numbers, function (d) {
            return d;
        })
        .enter()
        .append(record.cell)
        .text(function (d) {
            return record.scale(d);
        });
};

var visualize = function () {
    var container = d3.select('.container');

    var table = container.append('table');
    table.append('tbody');

    tableData.forEach(function (record) {
        var selection = d3.select('table tbody').append('tr');
        addDataInRow(selection, record);
    });
};

window.onload = visualize;