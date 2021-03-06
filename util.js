var Util = function (height, width, margin) {
    this.height = height;
    this.width = width;
    this.margin = margin;
};

Util.prototype = {
    createSvg: function (classType, title, xDomain, yDomain) {
        var svg = classType
            .append('svg')
            .attr('height', this.height)
            .attr('width', this.width)
            .classed(title, true);

        this.addAxis(title,xDomain,yDomain);
        return svg;
    },

    addAxis: function (title,xDomain,yDomain) {
        var scales = this.createScales(d3.scaleLinear(), d3.scaleLinear(), xDomain, yDomain);
        var xAxis, yAxis;
        xAxis = d3.axisBottom(scales.xScale);
        yAxis = d3.axisLeft(scales.yScale);
        this.addAxisToSvg(xAxis, this.margin, this.height - this.margin, title);
        this.addAxisToSvg(yAxis, this.margin, this.margin, title);

    },

    addAxisToSvg: function (axis, x, y, title) {
        d3.select('.' + title).append('g')
            .attr('transform', this.translate(x, y))
            .call(axis);
    },

    translate: function (x, y) {
        return 'translate(' + x + ', ' + y + ')';
    },

    createScales: function (xScaleType, yScaleType, xDomain, yDomain) {
        const INNERWIDTH = this.width - (2 * this.margin);
        const INNERHEIGHT = this.height - (2 * this.margin);
        var xScale = xScaleType.domain(xDomain).range([0, INNERWIDTH]);
        var yScale = yScaleType.domain(yDomain).range([INNERHEIGHT, 0]);
        return {xScale: xScale, yScale: yScale};
    },

    addCurveToGraph: function (scale, xScale, yScale, x, y, svg, dataPoints, type) {
        var chart = svg.append('g')
            .classed(type, true)
            .append('path')
            .datum(dataPoints)
            .attr('d', scale);
        d3.selectAll('.' + type).attr('transform', 'translate(' + x + ',' + y + ')');
        return chart;
    },

    addCircles: function (dataPoints, type, multiplier, adder) {
        var chart = d3.selectAll('.' + type);

        chart.selectAll('circle')
            .data(dataPoints)
            .enter()
            .append('circle')
            .attr('cx', function (d) {
                return xScale(d / 10);
            })
            .attr('cy', function (d) {
                return yScale((multiplier * Math.sin(d) + adder) / 10);
            })
            .attr('r', 5);
    },

    generateDropdownList: function (data, type) {
        var options = d3.select('.' + type)
            .append('select');

        options.selectAll('option')
            .data(data)
            .enter()
            .append('option')
            .text(function (d) {
                return d.title;
            })
            .attr("value", function (d) {
                return d.title;
            });
        return options;
    }
};