function _1(md){return(
    md`# Bar Chart`
    )}
    
    function _chart(d3,width,height,xAxis,yAxis,d3tip,data,x,y,margin,step)
    {
      const svg = d3.create("svg")
          .attr("viewBox", [0, 0, width, height])
          .attr("id", "barviz");
      // svg.style("background", "blue");
      svg.append("g")
          .attr("id", "axis")
          .call(xAxis);
    
      svg.append("g")
          .attr("id", "yaxis")
          .attr("class","myYaxis")
          .call(yAxis);
          
    
      svg
        .append('defs')
        .append('marker')
            .attr('id', 'arrowhead-right')
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
            .attr('id', 'arrowhead-up')
        .attr('refX', 5)
        .attr('refY', 4)
        .attr('markerWidth', 16)
        .attr('markerHeight', 13)
        .append('path')
        .attr('d', 'M 10 10 L 5 5 L 0 10')
        .attr('stroke', 'black')
        .attr('stroke-width', 1)
        .attr('fill', 'none');
          
      // svg.select("#axis")
      //   .transition()
      //   .duration(1000)
      //   .attr("opacity", "1")
    
      svg.select("#yaxis")
        .transition()
        .duration(1000)
        .attr("opacity", "1")
      
       svg.select("#axis path.domain")
          .attr("marker-end","url(#arrowhead-right)")
        
    
      svg.select("#yaxis path.domain")
        .attr("marker-end","url(#arrowhead-up)")
    
      const tooltip = d3tip()
        .style("background-color", "black")
          .style("border-radius", "5px")
          .style("padding", "10px")
          .style("color", "white")
        .attr("class", "d3-tip")
        .html(
          (event, d) => `
          <div style='float: right'>
            ${d.x}<br>${d.y}
          </div>`
        );
      tooltip.direction("n");
      svg.call(tooltip);
      
      svg.selectAll("rect")
         .data(data)
         .join("rect")
          .attr("class", "bars")
         // .on("mouseover.animate", onMouseOver )
         .on("mouseover", tooltip.show)
        // .on("mousemove", tooltip.show )
          // .on("mouseleave.animate", onMouseOut )
          .on("mouseleave", tooltip.hide)
         .transition()
         .duration(1000)
         .attr("x", d => x(d.x))
         .attr("y", d => y(d.y))
         .attr("width", x.bandwidth())
         .attr("height", d => height - margin.bottom -y(d.y))
          .attr('stroke', "#008080")
          
         .attr("fill", "#008080")
        .attr("fill-opacity", 0.1)
        // .attr('stroke', "#008080");
    
      function onMouseOver(d, i) {
            // console.log("here ", tooltip.show())
            // d3.select(this).attr('class', 'highlight');
            d3.select(this)
              .transition()     // adds animation
              .duration(400)
              .attr('width', x.bandwidth() + 5)
              .attr("y", function(d) { return y(d.y) - 10; })
              .attr("height", function(d) { return height - margin.bottom - y(d.y) + 10; })
              .attr("stroke", "black");
        }
    
        function onMouseOut(d, i) {
            // use the text label class to remove label on mouseout
            // d3.select(this).attr('class', 'bar');
            d3.select(this)
              .transition()     // adds animation
              .duration(400)
              .attr('width', x.bandwidth())
              .attr("y", function(d) { return y(d.y); })
              .attr("height", function(d) { return height - margin.bottom- y(d.y); })
              .attr("stroke", "none");
    
            d3.selectAll('.val')
              .remove()
        }
        svg.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("x", step-5)
        .attr("y", margin.top-5)
        .style("font-size", 20)
         // .style("fill", "#69a3b2")
        .text("Word Count");
      
        svg.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", 25*step+30)
        .attr("y", height - margin.bottom - 10)
        // .attr("transform", "translate(10,0)rotate(-45)")
        .style("font-size", 20)
        .text("Words");
      return svg.node();
    }
    
    
    function _data(FileAttachment){return(
    FileAttachment("words@3.json").json()
    )}
    
    function _step(width,margin){return(
    (width-margin.right-margin.left)/25
    )}
    
    function _x(d3,margin,width,data){return(
    d3.scaleBand()
        .range([ margin.left, width - margin.left-margin.right ]).padding(.25)
        .domain(data.map(d => d.x))
    )}
    
    function _6(x){return(
    x.bandwidth()
    )}
    
    function _y(d3,data,height,margin){return(
    d3.scaleLinear()
        .domain([0, data.reduce((acc, value) => {
      return Math.floor(acc = acc > value.y ? acc : value.y);
    }, 0) + 5])
        .range([height-margin.bottom, margin.top])
    )}
    
    function _xAxis(height,margin,d3,x){return(
    g => g
        .attr("id", "axis")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .transition().duration(1000).call(d3.axisBottom(x).tickSizeOuter(0))
        .selectAll("text")
        .attr("transform", "translate(0,0)rotate(-25)")
        .style("text-anchor", "end")
        .attr("font-size", 18)
        .style("fill", "#69a3b2")
    )}
    
    function _yAxis(margin,d3,y){return(
    g => g
        .attr("id","yaxis")
        .attr("transform", `translate(${margin.left},0)`) 
        .call(d3.axisLeft(y).tickSizeOuter(0))
        .attr("opacity", "0")
        .selectAll("text")
        .style("text-anchor", "end")
        .style("font-size", 18)
        .style("fill", "#69a3b2")
    )}
    
    function _width(){return(
    3000
    )}
    
    function _height(){return(
    550
    )}
    
    function _margin(){return(
    {top: 25, right: 20, bottom: 80, left: 50}
    )}
    
    function _d3(require){return(
    require("d3@6")
    )}
    
    function _d3tip(require){return(
    require("d3-tip")
    )}
    
    export default function define(runtime, observer) {
      const main = runtime.module();
      function toString() { return this.url; }
      const fileAttachments = new Map([
        ["words@3.json", {url: new URL("./files/c3b4d8457982714a639171653637f03470cf97a418c1013758d0cdd89f2896308d6dfb0c51d8a39753456dc5b08ff63aea537f296303ee4edd297acf8ad2d971.json", import.meta.url), mimeType: "application/json", toString}]
      ]);
      main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
      main.variable(observer()).define(["md"], _1);
      main.variable(observer("chart")).define("chart", ["d3","width","height","xAxis","yAxis","d3tip","data","x","y","margin","step"], _chart);
      main.variable(observer("data")).define("data", ["FileAttachment"], _data);
      main.variable(observer("step")).define("step", ["width","margin"], _step);
      main.variable(observer("x")).define("x", ["d3","margin","width","data"], _x);
      main.variable(observer()).define(["x"], _6);
      main.variable(observer("y")).define("y", ["d3","data","height","margin"], _y);
      main.variable(observer("xAxis")).define("xAxis", ["height","margin","d3","x"], _xAxis);
      main.variable(observer("yAxis")).define("yAxis", ["margin","d3","y"], _yAxis);
      main.variable(observer("width")).define("width", _width);
      main.variable(observer("height")).define("height", _height);
      main.variable(observer("margin")).define("margin", _margin);
      main.variable(observer("d3")).define("d3", ["require"], _d3);
      main.variable(observer("d3tip")).define("d3tip", ["require"], _d3tip);
      return main;
    }
    