var count = 0;

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
    var minVal = Object.keys(dataPerYear).reduce(function (year1, year2) {
        return year1 < year2 ? year1 : year2;
    });

    var maxVal = Object.keys(dataPerYear).reduce(function (year1, year2) {
        return year1 > year2 ? year1 : year2;
    });

    return [minVal,maxVal];
};

d3.csv('data/mortalityRatesData.csv', function (records) {
    var dataPerYear = getDataPerYear(records);
    var yearScale = d3.extent(Object.keys(dataPerYear));
    var mortalityRateScale = getExtentMortalityRatePerYear(dataPerYear);
    var xScale = d3.utcYears(yearScale);
    var yScale = d3.scaleLinear(mortalityRateScale);
});