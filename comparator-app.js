import { highlightRadar } from "./radarChart.js";

let margin = { top: 20, right: 60, bottom: 20, left: 60 },
  width = 850 - margin.left - margin.right,
  height = 780 - margin.top - margin.bottom;

function myFunction(x) {
  if (x.matches) {
    width = 720 - margin.left - margin.right;
    height = 620 - margin.top - margin.bottom;
  }
}
var x = window.matchMedia("(max-width: 1680px)")
myFunction(x);
// append the svg object to the body of the page

export function stackedArea(id, data) {
  d3.select(id).select("svg").remove();
  const svg = d3.select(id)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
      `translate(${margin.left}, ${margin.top})`);

  //Read the data

    // group the data: one array for each value of the X axis.
    const sumstat = d3.group(data, d => d.month);
    const [first] = sumstat.values();

    // Stack the data: each group will be represented on top of each other
    const mygroups = first.map(d => d.name) // list of group names
    const mygroup = [0, 1, 2] // list of group names
    const stackedData = d3.stack()
      .keys(mygroup)
      .value(function (d, key) {
        return d[1][key].n
      })
      (sumstat)

    let max = 0;
    stackedData.forEach(arr => {
      arr.forEach(d => {
        let sum = 0;
        d.data[1].forEach(e => {
          sum += parseInt(e.n);
        });
        if (sum > max) max = sum;
      })

    });
    let step = (width) / 13.5;
    // Add X axis --> it is a date format
    const x = d3.scaleOrdinal()
      .domain(["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov",
        "Dec"])
      .range(d3.range(0, margin.left + 13 * step, step));


    svg.append("g")
      .attr("id", 'stack-xaxis')
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x).tickSizeOuter(0).ticks(data.length / mygroups.length));

    console.log(data.length / mygroups.length);
    // Add Y axis
    const y = d3.scaleLinear()
      .domain([0, max + 15])
      .range([height, 0]);
    svg.append("g")
      .attr("id", "stack-yaxis")
      .call(d3.axisLeft(y).tickSizeOuter(0).tickFormat(d3.format(".3s")));

    svg
      .append('defs')
      .append('marker')
      .attr('id', 'arrowhead-st-right')
      .attr('refX', 5)
      .attr('refY', 4)
      .attr('markerWidth', 16)
      .attr('markerHeight', 13)
      .append('path')
      .attr('d', 'M 0 0 L 5 5 L 0 10')
      .attr('stroke', 'black')
      .attr('stroke-width', 1)
      .attr('fill', 'none');
    svg
      .append('defs')
      .append('marker')
      .attr('id', 'arrowhead-st-up')
      .attr('refX', 5)
      .attr('refY', 4)
      .attr('markerWidth', 16)
      .attr('markerHeight', 13)
      .append('path')
      .attr('d', 'M 10 10 L 5 5 L 0 10')
      .attr('stroke', 'black')
      .attr('stroke-width', 1)
      .attr('fill', 'none');

    svg.select("#stack-xaxis path.domain")
      .attr("marker-end", "url(#arrowhead-st-right)")


    svg.select("#stack-yaxis path.domain")
      .attr("marker-end", "url(#arrowhead-st-up)")

    // color palette
    const color = d3.scaleOrdinal()
      .domain(mygroups)
      .range(['#00A0B0', '#CC333F', '#EDC951'])

    // Show the areas
    svg
      .selectAll("mylayers")
      .data(stackedData)
      .join("path")
      .style("fill", function (d) { return color(mygroup[d.key - 1]); })
      .style("fill-opacity", 0.35)
      .style("filter", "url(#glow)")
      .style("stroke", "black")
      .attr("class", d => "stack c" + color(mygroup[d.key - 1]).replace("#", ""))
      .attr("d", d3.area()
        .x(function (d, i) { return x(d.data[0]); })
        .y0(function (d) { return y(d[0]); })
        .y1(function (d) { return y(d[1]); })
      )

    svg.append("text")
      .attr("class", "x label")
      .attr("text-anchor", "end")
      .attr("x", width + margin.left)
      .attr("y", height - 6)
      .text("Months (2022)");

    svg.append("text")
      .attr("class", "y label")
      .attr("text-anchor", "end")
      .attr("y", -2)
      .attr("x", 20)
      // .attr("dy", ".0em")
      .text("Views");

    const tip = d3.tip().attr('class', 'd3-tip').html(function (event, d) { return d; });
    svg.call(tip);

    function highlight(event, d) {
      svg.selectAll(".stack")
        .style("fill-opacity", 0.1);

      const elem = svg.select(".c" + color(mygroup[d.key - 1]).replace("#", ""));
      elem.style("fill-opacity", 0.7)
      highlightRadar("radarArea c" + color(mygroup[d.key - 1]).replace("#", ""));
      highlightBubble("bubbles c" + color(mygroup[d.key - 1]).replace("#", ""));
      tip.show(event, mygroups[d.key], elem.node())
    }
    function nohighlight(event, d) {
      svg.selectAll(".stack").style("fill-opacity", 0.35);
      let radar = document.getElementsByClassName("radarArea");
      for (let i = 0; i < radar.length; i++)
        radar[i].style["fill-opacity"] = 0.5;
      let bubble = document.getElementsByClassName("bubbles");
      for (let i = 0; i < bubble.length; i++) {
        bubble[i].style["fill-opacity"] = 0.7;
      }
      tip.hide();
    }
    svg.selectAll(".stack")
      .on("mouseenter", highlight)
      .on("mouseleave", nohighlight);
}
export function highlightStack(color) {
  let stack = document.getElementsByClassName("stack");
  for (let i = 0; i < stack.length; i++) {
    stack[i].style["fill-opacity"] = 0.1;
  }
  let selected = document.getElementsByClassName(color);
  selected[0].style["fill-opacity"] = 0.7;
}
export function highlightBubble(color) {
  let bubble = document.getElementsByClassName("bubbles");
  for (let i = 0; i < bubble.length; i++) {
    bubble[i].style["fill-opacity"] = 0.1;
  }
  let selected = document.getElementsByClassName(color);
  for (let i = 0; i < selected.length; i++)
    selected[i].style["fill-opacity"] = 0.7;
}

var data = await fetch("stacked-bar.json").then(resp => resp.json());
stackedArea("#my_dataviz", data);





