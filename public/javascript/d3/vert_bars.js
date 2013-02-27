var verticalBars = function(dataset, json_loc) {
    //SVG dimensions
    var w = 800;           //SVG object width in pixels
    var h = 600;            //SVG object height in pixels
    var vertPadding = 25;   //Vertical padding (for the bottom of the SVG object)
    var socket = io.connect('http://localhost');    //Socket.IO connection
    
    //SVG element creation
    var svg = d3.select("#bar-display")
        .append("svg")
        .attr("width", w)
        .attr("height", h);
        
    //D3 Scales
    //Access the "value" element and scale it to the height of the SVG object
    var yScale = d3.scale.linear()
        .domain([0, d3.max(dataset, function(d){
                return d.Value;
            })
        ])
        .range([0, h - vertPadding]);
        
    var xScale = d3.scale.ordinal()
        .domain(d3.range(dataset.length))       //returns 'domain' an array '0' to 'n' equal to the length of dataset
        .rangeRoundBands([0, w], 0.03);         //last parameter is the space between data elements ('bars' in this case)
    
    //Easy colors accessible via a 10-step ordinal scale
    var color = d3.scale.category10();
    
    //---------------------------------- ADD NEW ELEMENTS ----------------------------------
    //Add attributes to the SVG rectangles
    svg.selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("x", function(d, i){
            return xScale(i);
        })
        .attr("y", function(d) {
            return h - vertPadding - yScale(d.Value);
        })
        .attr("width", xScale.rangeBand())
        .attr("height", function(d) {
            return yScale(d.Value) - (vertPadding);
        })
        .attr("fill", function(d, i) {
            //Make the bar bluer as it increases in height
            //return "rgb(0, 0, " + (d.value * 10) + ")";
            return color(i);
        });
        
    //Add labels
    svg.selectAll("text")
        .data(dataset)
        .enter()
        .append("text")
        .text(function (d) {
            return d.Content + ": " + d.Value;
        })
        .attr("x", function(d, i) {
            return xScale(i) + xScale.rangeBand() / 2;
        })
        .attr("y", function(d) {
            return h - (vertPadding * 0.5);
        })
        .attr("font-family", "sans-serif")
        .attr("font-size", "16px")
        .attr("fill", "black")
        .attr("text-anchor", "middle");
    
    // -------------------------------------------- UPDATE ------------------------------------------------
    //Upon clicking "p", UPDATE with new data from SCRdata.json
    function refresh() {
        //Assume new data is in SCRdata.json
        d3.json(json_loc, function(json) {
            //console.log(json);
            dataset = json;
        });
        
        // * * * Assume the same number of data elements * * *
        
        //Update the yScale domain (since new elements could be larger/smaller)
        yScale.domain([0, d3.max(dataset, function(d){
            return d.Value;
            })
        ]);
        
        //Select all of the existing 'rect's & update them
        svg.selectAll("rect")
            .data(dataset)
            .transition().duration(1000)
            .attr("y", function(d){
                return h - vertPadding - yScale(d.Value);
            })
            .attr("height", function(d) {
                return yScale(d.Value) - vertPadding;
            })
            .attr("fill", function(d, i) {
                //return "rgb(0, 0, " + (d.value * 10) + ")";
                return color(i);
            });
            
        //Select all of the existing 'text's & update them
        svg.selectAll("text")
            .data(dataset)
            .transition().delay(750).duration(1000)
            .text(function(d) {
                return d.Content + ": " + d.Value;
            })
            .attr("x", function(d, i) {
                return xScale(i) + xScale.rangeBand() / 2;
            })
            .attr("y", function (d) {
                return h - (vertPadding * 0.5);
            });
        }
        
        //Listen for socket.io event and trigger the D3 update function
        socket.on('push-response', function(data) {
        var qid = $("#questionID").val();
    
        if(data.questionID == qid) {
            refresh();
        }
    });
};
