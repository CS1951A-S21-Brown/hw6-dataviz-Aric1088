
let svg3 = d3.select("#graph3")
    .append("svg")
    .attr("width", graph_3_width)
    .attr("height", graph_3_height)
    .append("g")
    .attr("transform", `translate(300, 300)`);
function setPieData(genre) {
    d3.csv("data/video_games.csv").then(data => {
        // let svg3 = d3.select("#graph3").remove()
        //     .append("svg")
        //     .attr("width", graph_3_width)
        //     .attr("height", graph_3_height)
        //     .append("g")
        //     .attr("transform", `translate(${margin.left}, ${margin.top})`);
        console.log("sheeesh")
        const radius = 250
        let publisher_map = new Map()
        data.map(entry => {
            if (entry['Genre'] === genre) {
                let publisher = entry['Publisher']
                let sales = parseFloat(entry['Global_Sales'])
                if (publisher_map.has(publisher)) {
                    let current_sales = publisher_map.get(publisher)
                    sales += current_sales
                }
                publisher_map.set(publisher, sales)
            }
        })
        data = []
        let total = 0
        publisher_map.forEach((value, key) => {
            data.push({ key, value }
            )
            total += value
        })
        data = data.sort((a, b) => b['Sales'] - a['Sales']).slice(0, 5)
        console.log(data[0])
        let transformed = {}
        transformed[data[0].key] = data[0].value
        transformed[data[1].key] = data[1].value
        transformed[data[2].key] = data[2].value
        transformed[data[3].key] = data[3].value
        transformed[data[4].key] = data[4].value
        console.log(transformed)
        data = transformed
        // set the color scale
        var color = d3.scaleOrdinal()
            .domain(data)
            .range(d3.schemeSet2);

        // Compute the position of each group on the pie:
        var pie = d3.pie()
            .value(function (d) { return d.value; })
        var data_ready = pie(d3.entries(data))
        // Now I know that group A goes from 0 degrees to x degrees and so on.

        // shape helper to build arcs:
        var arcGenerator = d3.arc()
            .innerRadius(0)
            .outerRadius(radius)

        // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
        let hooli = svg3.selectAll("mySlices").data(data_ready)
        hooli
            .enter()
            .append('path')
            .merge(hooli)
            .transition()
            .duration(1000)
            .attr('d', arcGenerator)
            .attr('fill', function (d) { return (color(d.data.key)) })
            .attr("stroke", "black")
            .style("stroke-width", "2px")
        // .style("opacity", 0.7)
        hooli.exit()
            .remove()

        // Now add the annotation. Use the centroid method to get the best coordinates
        let sheesh = svg3.selectAll("mySlices").data(data_ready)
        sheesh
            .enter()
            .append('text')
            .merge(sheesh)
            .transition()
            .duration(1000)
            .text(function (d) { return d.data.key + ":\n $" + d.data.value.toFixed(2) + " Million" })
            .attr("transform", function (d) { return "translate(" + (arcGenerator.centroid(d) + 200) + ")"; })
            .style("text-anchor", "middle")
            .style("font-size", 5)
        sheesh.exit()
            .remove()



    })
}
setPieData("Action")