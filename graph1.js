// top 10 video games of all time
// static
let svg = d3.select("#graph1")
    .append("svg")
    .attr("width", graph_1_width)
    .attr("height", graph_1_height)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

let countRef = svg.append("g")

d3.csv("data/video_games.csv").then(data => {
    data = data.slice(0, 10)
    console.log(data)
    let x = d3.scaleLinear()
        .domain([0, d3.max(data, d => parseFloat(d['Global_Sales']))])
        .range([0, graph_1_width - margin.left - margin.right]);
    let y = d3.scaleBand()
        .domain(data.map(d => d['Name']))
        .range([0, graph_1_height - margin.top - margin.bottom])
        .padding(0.1)
    svg.append("g")
        .call(d3.axisLeft(y).tickSize(0).tickPadding(10))
    let bars = svg.selectAll("rect").data(data)
    let color = d3.scaleOrdinal()
        .domain(data.map(function (d) { return d["Name"] }))
        .range(d3.quantize(d3.interpolateHcl("#66a0e2", "#81c2c3"), 10));
    bars.enter()
        .append("rect")
        .merge(bars)
        .attr("fill", function (d) { return color(d['Name']) }) // Here, we are using functin(d) { ... } to return fill colors based on the data point d
        .attr("x", x(0))
        .attr("y", d => y(d['Name']))               // HINT: Use function(d) { return ...; } to apply styles based on the data point (d)
        .attr("width", d => parseInt(d['Global_Sales']) + "px")
        .attr("height", y.bandwidth());

    let counts = countRef.selectAll("text").data(data)
    counts.enter()
        .append("text")
        .merge(counts)
        .attr("x", d => x(parseInt(d["Global_Sales"])))
        .attr("y", d => y(d["Name"]) + 15)
        .style("text_anchor", "start")
        .text(d => parseFloat(d['Global_Sales']))
    svg.append("text")
        .attr("transform", `translate(${(graph_1_width - margin.left - margin.right) / 2},
    ${(graph_1_height - margin.top - margin.bottom) + 30})`)       // HINT: Place this at the bottom middle edge of the graph - use translate(x, y) that we discussed earlier
        .style("text-anchor", "middle")
        .text("Global Sales");

    // TODO: Add y-axis label
    svg.append("text")
        .attr("transform", `translate(-160, ${(graph_1_height - margin.top - margin.bottom) / 2})`)       // HINT: Place this at the center left edge of the graph - use translate(x, y) that we discussed earlier
        .style("text-anchor", "middle")
        .text("Game");

    // TODO: Add chart title
    svg.append("text")
        .attr("transform", `translate(${(graph_1_width - margin.left - margin.right) / 2}, ${-20})`)       // HINT: Place this at the top middle edge of the graph - use translate(x, y) that we discussed earlier
        .style("text-anchor", "middle")
        .style("font-size", 15)
        .text("Top 10 Overall Games");
})