import { highlightRadar } from "./radarChart.js";

const margin = { top: 10, right: 30, bottom: 30, left: 60 },
  width = 460 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3.select("#my_dataviz")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform",
    `translate(${margin.left}, ${margin.top})`);

//Read the data
d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/5_OneCatSevNumOrdered.csv").then(function (data) {

  // group the data: one array for each value of the X axis.
  const sumstat = d3.group(data, d => d.year);

  // Stack the data: each group will be represented on top of each other
  const mygroups = ["Helen", "Amanda", "Ashley"] // list of group names
  const mygroup = [1, 2, 3] // list of group names
  const stackedData = d3.stack()
    .keys(mygroup)
    .value(function (d, key) {
      return d[1][key].n
    })
    (sumstat)

  // Add X axis --> it is a date format
  const x = d3.scaleLinear()
    .domain(d3.extent(data, function (d) { return d.year; }))
    .range([0, width]);
  svg.append("g")
    .attr("class", 'stack-xaxis')
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x).ticks(5));

  // Add Y axis
  const y = d3.scaleLinear()
    .domain([0, d3.max(data, function (d) { return +d.n; }) * 1.2])
    .range([height, 0]);
  svg.append("g")
    .attr("id", "stack-yaxis")
    .call(d3.axisLeft(y));

    svg.select("#stack-xaxis path.domain")
    .attr("marker-end","url(#arrowhead-right)")
  

svg.select("#stack-yaxis path.domain")
  .attr("marker-end","url(#arrowhead-stack-up)")

  // color palette
  const color = d3.scaleOrdinal()
    .domain(mygroups)
    .range(['#00A0B0', '#CC333F', '#EDC951'])

  // Show the areas
  svg
    .selectAll("mylayers")
    .data(stackedData)
    .join("path")
    .style("fill", function (d) { return color(mygroups[d.key - 1]); })
    .style("fill-opacity", 0.35)
    .style("filter", "url(#glow)")
    .style("stroke", "black" )
    .attr("class", d => "stack c" + color(mygroup[d.key - 1]).replace("#", ""))
    .attr("d", d3.area()
      .x(function (d, i) { return x(d.data[0]); })
      .y0(function (d) { return y(d[0]); })
      .y1(function (d) { return y(d[1]); })
    )

  function highlight(event, d) {
    svg.selectAll(".stack")
      .style("fill-opacity", 0.1);

    svg.select(".c" + color(mygroup[d.key - 1]).replace("#", ""))
      .style("fill-opacity", 0.7)
    highlightRadar("radarArea c" + color(mygroup[d.key - 1]).replace("#", ""));
  }
  function nohighlight(event, d) {
    svg.selectAll(".stack").style("fill-opacity", 0.35);
    let radar = document.getElementsByClassName("radarArea");
    for (let i = 0; i < radar.length; i++)
      radar[i].style["fill-opacity"] = 0.35;
  }
  svg.selectAll(".stack")
    .on("mouseover", highlight)
    .on("mouseleave", nohighlight);
})
export function highlightStack(color){
  let stack = document.getElementsByClassName("stack");
  for(let i=0;i<stack.length;i++){
    stack[i].style["fill-opacity"] = 0.1;
  }
  let selected = document.getElementsByClassName(color);
  selected[0].style["fill-opacity"] = 0.7;
}


