let svg2 = d3.select("#graph2")
    .append("svg")
    .attr("width", graph_2_width)
    .attr("height", graph_2_height)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);
let tooltip = d3.select("#graph2")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0)
let x = d3.scaleLinear()
    .range([0, graph_2_width - margin.left - margin.right]);

// TODO: Create a scale band for the y axis (artist)
let y = d3.scaleBand()
    .range([0, graph_2_height - margin.top - margin.bottom])
    .padding(0.1);  // Improves readability
let y_axis_label = svg2.append("g")
let countRef2 = svg2.append("g")


svg2.append("text")
    .attr("transform", `translate(${(graph_2_width - margin.left - margin.right) / 2},
    ${(graph_2_height - margin.top - margin.bottom) + 30})`)       // HINT: Place this at the bottom middle edge of the graph
    .style("text-anchor", "middle")
    .text("Sales");


let y_axis_text = svg2.append("text")
    .attr("transform", `translate(-80, ${(graph_2_height - margin.top - margin.bottom) / 2})`)       // HINT: Place this at the center left edge of the graph
    .style("text-anchor", "middle")
    .style("text-anchor", "middle");


let title = svg2.append("text")
    .attr("transform", `translate(${(graph_2_width - margin.left - margin.right) / 2}, ${- 20})`)       // HINT: Place this at the top middle edge of the graph
    .style("text-anchor", "middle")
    .style("font-size", 15);

/*
action -> sales(depending on attr)
*/
function setData(attr) {
    d3.csv("data/video_games.csv").then(data => {
        let genres = {
            "Action": 0,
            "Adventure": 0,
            "Fighting": 0,
            "Misc": 0,
            "Platform": 0,
            "Puzzle": 0,
            "Racing": 0,
            "Role-Playing": 0,
            "Shooter": 0,
            "Simulation": 0,
            "Sports": 0,
            "Strategy": 0,
        }
        data.map(entry => {
            genres[entry['Genre']] += parseFloat(entry[attr])
        })
        data = Object.keys(genres).map((key) => { return { 'Genre': key, 'Sales': genres[key] } })
        data = cleanData(data, (a, b) => b['Sales'] - a['Sales'])
        console.log(data)

        x.domain([0, d3.max(data, function (d) {
            return parseFloat(d['Sales'])
        })]);

        // TODO: Update the y axis domains with the desired attribute
        y.domain(data.map(d => d["Genre"]));
        y_axis_label.call(d3.axisLeft(y).tickSize(0).tickPadding(10));
        let bars = svg2.selectAll("rect").data(data);
        let color = d3.scaleOrdinal()
            .domain(data.map(function (d) { return d["Genre"] }))
            .range(d3.quantize(d3.interpolateHcl("#66a0e2", "#81c2c3"), 12));
        let mouseover = function (d) {
            let color_span = `<span style="color: ${color(d.song)};">`;
            let html = `${d.Genre}<br/>
                        ${color_span}$${d.Sales.toFixed(2)} Million</span><br/>
                       </span>`;       // HINT: 
            tooltip.html(html)
                .style("left", `${(d3.event.pageX) + 100}px`)
                .style("top", `${(d3.event.pageY) - 30}px`)
                .style("box-shadow", `2px 2px 5px ${color(d.Genre)}`)    // OPTIONAL for students
                .transition()
                .duration(200)
                .style("opacity", 0.9)
        };

        // Mouseout function to hide the tool on exit
        let mouseout = function (d) {
            // Set opacity back to 0 to hide
            tooltip.transition()
                .duration(200)
                .style("opacity", 0);
        };
        bars.enter()
            .append("rect")
            .merge(bars)
            .transition()
            .duration(1000)
            .attr("fill", function (d) { return color(d['Genre']) })
            .attr("x", x(0))
            .attr("y", d => y(d['Genre']))               // HINT: Use function(d) { return ...; } to apply styles based on the data point
            .attr("width", d => parseInt(d['Sales'] + "px"))
            .attr("height", y.bandwidth())


        let counts = countRef2.selectAll("text").data(data);
        counts.enter()
            .append("text")
            .on("mouseover", mouseover) // HINT: Pass in the mouseover and mouseout functions here
            .on("mouseout", mouseout)
            .merge(counts)
            .transition()
            .duration(1000)
            .attr("x", d => x(d["Sales"]) + 80)       // HINT: Add a small offset to the right edge of the bar, found by x(d.count)
            .attr("y", d => y(d["Genre"]) + 15)       // HINT: Add a small offset to the top edge of the bar, found by y(d.artist)
            .style("text-anchor", "start")
            .text(d => parseFloat(d["Sales"]))
        // HINT: Get the count of the artist
        y_axis_text.text("Genres");
        title.text("Top Genres Per Region Sales");

        // Remove elements not in use if fewer groups in new dataset

        bars.exit().remove();
        counts.exit().remove();
    })
}

function cleanData(data, comparator) {
    // TODO: sort and return the given data with the comparator (extracting the desired number of examples)
    return data.sort(comparator)
}

setData("NA_Sales")