var parseQuote = function(quote){
	quote['Date'] = new Date(quote['Date']);
	quote['Close Price'] = +quote['Close Price'];
	return quote;
}

const WIDTH = 1280;
const HEIGHT = 800;
const MARGIN = 30;

var loadChart = function(quotes){
	var svg = d3.select('.container').append('svg')
		.attr('width', WIDTH)
		.attr('height', HEIGHT);
	var dateRange = d3.extent(quotes, function(quote){
	    return quote['Date'];
	});

	var priceRange = d3.extent(quotes, function(quote){
    	return quote['Close Price'];
    });

    priceRange[0] -= 5;
    priceRange[1] += 5;
    dateRange = [new Date(dateRange[0]), new Date(dateRange[1])]
    dateRange[0].setDate(dateRange[0].getDate() - 5);
    dateRange[1].setDate(dateRange[1].getDate() + 5);

	var xScale = d3.scaleTime()
	    .domain(dateRange)
	    .range([0, WIDTH - (2 * MARGIN)]);

	var yScale = d3.scaleLinear()
	    .domain(priceRange)
	    .range([HEIGHT - (2 * MARGIN), 0]);

	var xAxis = d3.axisBottom(xScale).ticks(12);
	var yAxis = d3.axisLeft(yScale).ticks(10);

	svg.append('g')
		.attr('transform', 'translate('+MARGIN+', '+(HEIGHT - MARGIN)+')')
		.call(xAxis);

	svg.append('g')
		.attr('transform', 'translate('+(MARGIN)+', '+ MARGIN +')')
		.call(yAxis);

	var g = svg.append('g')
		.attr('transform', 'translate('+MARGIN+', '+MARGIN+')');

	g.selectAll('circle').data(quotes)
		.enter().append('circle')
		.attr('r', 5).append('title')
		.text(function(q){
			return 'Date: ' + q['Date'].toISOString().split('T')[0] + '\nPrice: ' + q['Close Price'];
		})
	
	var circles = g.selectAll('circle');
	
	circles.attr('cx', function(q){return xScale(q['Date'])})
		.attr('cy', function(q){return yScale(q['Close Price'])});

	g.selectAll('circle').exit().remove();

}

d3.csv('/equityAnalysis/public/data/tataSteel.csv', parseQuote, loadChart);

