const width = 700
const height = 700
const padding = 50

const canvas = d3.select(".canvas")
const svg = canvas.append("svg")
                  .attr('width', width)
                  .attr('height', height)
                  .attr('padding', 50)
                  .attr('background-color', 'red')

// let dataset = []

// var xScale = d3.scale.linear()  // xScale is width of graphic
//     .domain([0, d3.max(dataset, function (d) {
//         return d[0];  // input domain
//     })])
//     .range([padding, width - padding * 2]); // output range

//     var yScale = d3.scale.linear()  // yScale is height of graphic
//     .domain([0, d3.max(dataset, function (d) {
//         return d[1];  // input domain
//     })])
//     .range([height - padding, padding]);  // remember y starts on top going down so we flip

//     // Define X axis
//     var xAxis = d3.svg.axis()
//     .scale(xScale)
//     .orient("bottom")
//     .ticks(5);

//     // Define Y axis
//     var yAxis = d3.svg.axis()
//     .scale(yScale)
//     .orient("left")
//     .ticks(5);

//     // Create SVG element
//     var svg = d3.select("canvas")  // This is where we put our vis
//     .append("svg")
//     .attr("width", width)
//     .attr("height", height)
    

//     svg.select("this")
//     .attr("color", "red")