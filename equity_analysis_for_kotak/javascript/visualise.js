var parseQuote = function (quote) {
    quote['Date'] = new Date(quote['Date']);
    quote['High Price'] = +quote['High Price'];
    return quote;
};

const HEIGHT = 700;
const WIDTH = 1000;
const MARGIN = 20;


var loadData = function (quotes) {
    //svg creation

    var svg = d3.select('.container').append('svg')
        .attr('width', WIDTH)
        .attr('height', HEIGHT);

    var dateRange = d3.extent(quotes, function(quote){
        return quote['Date'];
    });

    var priceRange = d3.extent(quotes, function(quote){
        return quote['High Price'];
    });

    //scale x and y
    var xScale = d3.scaleTime()
        .domain([new Date(dateRange[0]), new Date(dateRange[1])])
        .range([0, WIDTH - (2 * MARGIN)]);

    var yScale = d3.scaleLinear()
        .domain(priceRange)
        .range([HEIGHT - (2 * MARGIN), 0]);

    //x and y axis
    var xAxis = d3.axisBottom(xScale);

    var yAxis = d3.axisLeft(yScale);

    //grouping both axis and main chart into a group
    var graph = svg.append('g');
    graph.attr('transform','translate('+ MARGIN+ ','+ (0)+')');

    graph.append('g')
        .attr('transform','translate('+(MARGIN*2)+ ','+(HEIGHT-MARGIN) +')')
        .call(xAxis);

    graph.append('g')
        .attr('transform','translate('+(MARGIN*2)+ ','+(MARGIN) +')')
        .call(yAxis);

    var g = graph.append('g');
    g.attr('transform','translate('+ MARGIN*2 +','+ (MARGIN) +')');

    // adding circles for each quote
    g.selectAll('circle').data(quotes)
        .enter().append('circle')
        .attr('r', 5).append('title')
        .text(function(q){
            return 'Date: ' + q['Date'].toISOString().split('T')[0] + '\nPrice: ' + q['High Price'];
        });

    var circles = g.selectAll('circle');

    circles.attr('cx', function(q){ return xScale(q['Date'])})
        .attr('cy', function(q){return yScale(q['High Price'])});

    
    //values to both axis pending
    // svg.append('text')
    //     .attr('transform', 'translate(0,300)')
    //     .attr('y', (HEIGHT/2+MARGIN*2))
    //     .attr('x',WIDTH/2)
    //     .attr('dy', '1em')
    //     .style('text-anchor', 'middle')
    //     .text('High Price');

    g.selectAll('circle').exit().remove();

};

d3.csv('/equityAnalysisForKotak/data/securityWisePriceVolumeArchive.csv', parseQuote, loadData);
