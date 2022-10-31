import {
    Runtime,
    Inspector,
} from "https://cdn.jsdelivr.net/npm/@observablehq/runtime@4/dist/runtime.js";
import notebook from "./temp.js";
import define from "https://api.observablehq.com/d/2f691757ac83a209@1281.js?v=3";
import bubble from "https://api.observablehq.com/d/591ec25efcb5dcd5@267.js?v=3";

const main = new Runtime().module(notebook, (name) => {
    switch (name) {
        case "viewof chart1": return new Inspector(
            document.querySelector("#observablehq-chart1-935c21d9")
        );
        case "initial title": return { fulfilled(value) { console.log(value) } };
    }
});
main.redefine(
    "data",
    fetch("pop.json").then((response) => response.json())
);
const flower = new Runtime().module(define, (name) => {
    if (name === "chart")
        return new Inspector(
            document.querySelector("#observablehq-chart-1f0a2129")
        );
});
const bubble_plot = new Runtime().module(bubble, (name) => {
    if(name === "chart")
        return new Inspector(
            document.querySelector("#bubble")
        );
})
flower.redefine(
    "data",
    fetch("Popular.json").then((resp) => resp.json())
);

export function temp(title){
    console.log(title.replaceAll('/','-'));
    title = title.replaceAll('/','-');
    flower.redefine(
        "data",
        fetch(title+".json").then((resp) => resp.json())
    );
}