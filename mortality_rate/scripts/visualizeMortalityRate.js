var getAllYears = function (firstRecord) {
    var keys = Object.keys(firstRecord);
    keys.splice(keys.length - 2, 2);
    return keys;
};

var calculateMortalityRateOfAllCountry = function (records, year, allCountriesSize) {
    var countPerYear = 0;
    records.forEach(function (record) {
        var perYear = record[year] == "" ? 0 : parseInt(record[year]);
        countPerYear += perYear;
    });
    return countPerYear / allCountriesSize;
};

var getDataPerYear = function (records) {
    var dataOfAllYears = {};
    var allYears = getAllYears(records[0]);
    allYears.forEach(function (year) {
        dataOfAllYears[year] = calculateMortalityRateOfAllCountry(records, year, allYears.length);
    });
    return dataOfAllYears;
};

var getExtentMortalityRatePerYear = function (dataPerYear) { //todo refactor the duplication
    var yearWiseData = Object.keys(dataPerYear).map(function (record) {
        return dataPerYear[record];
    });

    var minVal = Math.min.apply(null, yearWiseData);
    var maxVal = Math.max.apply(null, yearWiseData);

    return [_minVal, maxVal];
};

const OUTER_WIDTH = 1000;
const OUTER_HEIGHT = 750;
const MARGIN = 20;
const INNER_HEIGHT = OUTER_HEIGHT - (2 * MARGIN);
const INNER_WIDTH = OUTER_HEIGHT - (2 * MARGIN);

d3.csv('data/mortalityRatesData.csv', function (records) {
    var svg = d3.select('.container').append('svg')
        .attr('height', OUTER_HEIGHT)
        .attr('width', OUTER_WIDTH);

    var dataPerYear = getDataPerYear(records);
    var yearScale = d3.extent(Object.keys(dataPerYear));
    var mortalityRateScale = getExtentMortalityRatePerYear(dataPerYear);

    var xScale = d3.scaleLinear()
        .domain(yearScale)
        .range([0, INNER_WIDTH]);

    var yScale = d3.scaleLinear()
        .domain(mortalityRateScale)
        .range([INNER_HEIGHT, 0]);

    var g = svg.append('g')
        .attr('transform','translate('+MARGIN +','+MARGIN+')');

    var line = d3.line()
        .x(function(q){return xScale(q)})
        .y(function(q){return yScale(dataPerYear[q])});

    g.append('path')
        .classed('mortality-rate', true)
        .attr('d', line(dataPerYear));


    g.selectAll('circle')
        .data(Object.keys(dataPerYear))
        .enter().append('circle')
        .attr('r', 5);

    g.selectAll('circle')
        .attr('cx', function (r) {
            return xScale(r);
        })
        .attr('cy', function (r) {
            return yScale(dataPerYear[r])
        })
        .attr('class', 'rateToken');

    g.selectAll('circle').exit().remove();
});