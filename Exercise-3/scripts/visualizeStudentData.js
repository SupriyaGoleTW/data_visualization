const INNER_WIDTH = 500;
var xScale, enteredDivs, colorScale;

var getAllSubjects = function () {
    return students_data.map(function (record) {
        return record.subject;
    });
};

var createScale = function () {
    var maxScore = d3.max(students_data, function (record) {
        return record.score;
    });

    var subjects = getAllSubjects();

    xScale = d3.scaleLinear()
        .domain([0, maxScore])
        .range([0, INNER_WIDTH]);

    colorScale = d3.scaleOrdinal(d3.schemeCategory10).domain(subjects);
};

var getUniqueSubjects = function (allSubjects) {
    return allSubjects.filter(function (ele, index, array) {
        return array.indexOf(ele) == index;
    });
};

var showLegends = function () {
    var allSubjects = getAllSubjects();
    d3.selectAll('.subjects').data(getUniqueSubjects(allSubjects))
        .enter().append('div')
        .text(function (d) {
            return d;
        })
        .style('background-color', function (d) {
            return colorScale(d);
        })
        .classed('subjects', true);
};

var loadMarksData = function () {
    createScale();
    var allDivs = d3.select('.container').selectAll('div').data(students_data);

    enteredDivs = allDivs
        .enter()
        .append('div')
        .style('width', function (d) {
            return xScale(d.score) + "px";
        })
        .classed('marks-chart', true)
        .text(function (d) {
            return d.name + " " + d.score;
        })
        .style('background-color', function (record) {
            return colorScale(record.subject);
        });

    allDivs.exit().remove();

    showLegends();
};

var sortByChoice = function (choice) {
    d3.select('.container').selectAll('div')
        .sort(function (first, second) {
            return d3.ascending(first[choice], second[choice]);
        });
};

window.onload = loadMarksData;