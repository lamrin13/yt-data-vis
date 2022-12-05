import { dataLoad } from './app.js'

function _1(md){return(
    md`# Zoomable Treemap
    
    This [treemap](/@d3/treemap) supports zooming: click any cell to zoom in, or the top to zoom out.`
    )}
    
    function _chart1(d3,width,height,treemap,data,name,DOM,format,$0)
    {
      const x = d3.scaleLinear().rangeRound([0, width]);
      const y = d3.scaleLinear().rangeRound([0, height]);
    
      const svg = d3
        .create("svg")
        .attr("viewBox", [0.5, -30.5, width, height + 30])
        .style("font", "22px sans-serif");
    
      let group = svg.append("g").call(render, treemap(data));
      var filter = group.selectAll("g").append('defs').append('filter').attr('id', 'glow'),
      feGaussianBlur = filter.append('feGaussianBlur').attr('stdDeviation', '2.5').attr('result', 'coloredBlur'),
      feMerge = filter.append('feMerge'),
      feMergeNode_1 = feMerge.append('feMergeNode').attr('in', 'coloredBlur'),
      feMergeNode_2 = feMerge.append('feMergeNode').attr('in', 'SourceGraphic');
      function render(group, root) {
        const node = group
          .selectAll("g")
          .data(root.children.concat(root))
          .join("g");
    
        node
          .filter((d) => (d === root ? d.parent : d.children))
          .attr("cursor", "pointer")
          .on("click", (event, d) => (d === root ? zoomout(root) : zoomin(d)));
    
        node.append("title").text((d) => `${name(d).split("/")[name(d).split("/").length-1]}: ${d.value}`);
    
        node
          .append("rect")
          .attr("id", (d) => (d.leafUid = DOM.uid("leaf")).id)
          .attr("class", (d) => (d === root ? "root-rect" : d.children ? "child-rect" : "leaf-rect"))
          .attr("fill", (d) => (d === root ? "#0c7994" : d.children ? "#5caec2" : "#81b9c7"))
          .attr("stroke", "#fff");
          // .style("filter", "url(#glow)");
    
        node
          .append("clipPath")
          .attr("id", (d) => (d.clipUid = DOM.uid("clip")).id)
          .append("use")
          .attr("xlink:href", (d) => d.leafUid.href);
    
        node
          .append("text")
    
          .attr("clip-path", (d) => d.clipUid)
          .attr("font-weight", (d) => (d === root ? "bold" : null))
          .attr("font-size", "28px")
          .selectAll("tspan")
          .data((d) =>
            (d === root ? name(d) : d.data.name)
              .split(/(?=[^A-Z][[^a-z]])/g) 
              .concat(d3.formatPrefix(".1", d.value)(d.value))
          )
          .join("tspan")
          // .attr("transform", function (d) {
          //   return "translate(" + d.x + "," + d.y + ")";
          // })
          .attr("x", 3)
          .attr(
            "y",
            (d, i, nodes) => `${(i === nodes.length - 1) * 0.3 + 1.1 + i * 0.9}em`
          )
          // .attr("text-anchor", "middle")
    
          .attr("fill-opacity", (d, i, nodes) =>
            i === nodes.length - 1 ? 0.7 : null
          )
          .attr("font-weight", (d, i, nodes) =>
            i === nodes.length - 1 ? "normal" : null
          )
          .text((d) => d);
        group.call(position, root);
      }
    
      function position(group, root) {
        group
          .selectAll("g")
          .attr("transform", (d) =>
            d === root ? `translate(0,-30)` : `translate(${x(d.x0)},${y(d.y0)})`
          )
          .select("rect")
          .attr("width", (d) => (d === root ? width : x(d.x1) - x(d.x0)))
          .attr("height", (d) => (d === root ? 40 : y(d.y1) - y(d.y0)))
          // .attr("opacity", (d) => {
          //   if(d===root)  return 1;
          //   else{
          //     console.log("opacity ",((x(d.x1) - x(d.x0))*(y(d.y1) - y(d.y0)))/(width*height) + 0.5)
          //     //  return ((x(d.x1) - x(d.x0))*(y(d.y1) - y(d.y0)))/(width*height) + 0.2;
          //     return 1;
          //   }
          // })
          .attr("fill", (d,i) => {
            if(d===root)  return "#4390a3";
            else{
              if(i==0) return "#6eb3c4";
              else if(i==1) return "#80bccb";
              else if(i==2) return "#92c6d3";
              else if(i==3) return "#a4cfda";
              else return "#b7d9e1";
            }
          });
      }
    
      // When zooming in, draw the new nodes on top, and fade them in.
      function zoomin(d) {
        const group0 = group.attr("pointer-events", "none");
        const group1 = (group = svg.append("g").call(render, d));
    
        x.domain([d.x0, d.x1]);
        y.domain([d.y0, d.y1]);
    
        svg
          .transition()
          .duration(750)
          .call((t) => group0.transition(t).remove().call(position, d.parent))
          .call((t) =>
            group1
              .transition(t)
              .attrTween("opacity", () => d3.interpolate(0, 1))
              .call(position, d)
          );
          dataLoad(name(d));
      }

      // When zooming out, draw the old nodes on top, and fade them out.
      function zoomout(d) {
        const group0 = group.attr("pointer-events", "none");
        const group1 = (group = svg.insert("g", "*").call(render, d.parent));
    
        x.domain([d.parent.x0, d.parent.x1]);
        y.domain([d.parent.y0, d.parent.y1]);
    
        svg
          .transition()
          .duration(750)
          .call((t) =>
            group0
              .transition(t)
              .remove()
              .attrTween("opacity", () => d3.interpolate(1, 0))
              .call(position, d)
          )
          .call((t) => group1.transition(t).call(position, d.parent));

          dataLoad(name(d.parent));
      }
    
      return svg.node();
    }
    
    
    function _title(){return(
    "default"
    )}
    
    function _data(FileAttachment){return(
    FileAttachment("pop@1.json").json()
    )}
    
    function _treemap(d3,tile){return(
    data => d3.treemap()
        .tile(tile)
      (d3.hierarchy(data)
        .sum(d => d.value)
        .sort((a, b) => b.value - a.value))
    )}
    
    function _6(md){return(
    md`This custom tiling function adapts the built-in binary tiling function for the appropriate aspect ratio when the treemap is zoomed-in.`
    )}
    
    function _tile(d3,width,height){return(
    function tile(node, x0, y0, x1, y1) {
      d3.treemapBinary(node, 0, 0, width, height);
      for (const child of node.children) {
        child.x0 = x0 + child.x0 / width * (x1 - x0);
        child.x1 = x0 + child.x1 / width * (x1 - x0);
        child.y0 = y0 + child.y0 / height * (y1 - y0);
        child.y1 = y0 + child.y1 / height * (y1 - y0);
      }
    }
    )}
    
    function _name(){return(
    d => d.ancestors().reverse().map(d => d.data.name).join("/")
    )}
    
    function _width(){return(
    1250
    )}
    
    function _height(){return(
    700
    )}
    
    function _format(d3){return(
    d3.format(".4s")
    )}
    
    function _d3(require){return(
    require("d3@6")
    )}
    
    export default function define(runtime, observer) {
      const main = runtime.module();
      function toString() { return this.url; }
      const fileAttachments = new Map([
        ["flare-2.json", {url: "https://static.observableusercontent.com/files/e65374209781891f37dea1e7a6e1c5e020a3009b8aedf113b4c80942018887a1176ad4945cf14444603ff91d3da371b3b0d72419fa8d2ee0f6e815732475d5de", mimeType: null, toString}],
        ["pop@1.json", {url: "https://static.observableusercontent.com/files/0d8672dc5a1a2d9b1a3bcfb561fa75713718764e8c5e4440483b60e7bb809b635bbea2609f33481b712a197b1704671d1b8e77050ba00782c7e2938a2ce05a67", mimeType: "application/json", toString}]
      ]);
      main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
      main.variable(observer()).define(["md"], _1);
      main.variable(observer("viewof chart1")).define("viewof chart1", ["d3","width","height","treemap","data","name","DOM","format","mutable title"], _chart1);
      main.variable(observer("chart1")).define("chart1", ["Generators", "viewof chart1"], (G, _) => G.input(_));
      main.define("initial title", _title);
      main.variable(observer("mutable title")).define("mutable title", ["Mutable", "initial title"], (M, _) => new M(_));
      main.variable(observer("title")).define("title", ["mutable title"], _ => _.generator);
      main.variable(observer("data")).define("data", ["FileAttachment"], _data);
      main.variable(observer("treemap")).define("treemap", ["d3","tile"], _treemap);
      main.variable(observer()).define(["md"], _6);
      main.variable(observer("tile")).define("tile", ["d3","width","height"], _tile);
      main.variable(observer("name")).define("name", _name);
      main.variable(observer("width")).define("width", _width);
      main.variable(observer("height")).define("height", _height);
      main.variable(observer("format")).define("format", ["d3"], _format);
      main.variable(observer("d3")).define("d3", ["require"], _d3);
      return main;
    }