var numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

var font_Scale = d3.scaleLinear().domain([0,10]).range(['italic bold 12px/30px Georgia, serif','italic bold 120px/180px Georgia, serif']);

var visualize = function () {
    var container = d3.select('.container');
    container.selectAll('div')
        .data(numbers)
        .enter()
        .append('div')
        .style('font', function (d) {
            return font_Scale(d)+'px';
        })
        .text(function (d) {
            return d;
        })
        .classed('numbers',true);
};

window.onload = visualize;
