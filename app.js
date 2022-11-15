import {
    Runtime,
    Inspector,
} from "https://cdn.jsdelivr.net/npm/@observablehq/runtime@4/dist/runtime.js";
import notebook from "./treemap.js";
import define from "https://api.observablehq.com/d/2f691757ac83a209@1324.js?v=3";
import bubble from "https://api.observablehq.com/d/591ec25efcb5dcd5@588.js?v=3";
import bubble1 from "https://api.observablehq.com/d/44fd2fbbc5f2d780@552.js?v=3";
import barchart from "https://api.observablehq.com/d/72ed590acb359427@168.js?v=3";

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
    fetch("./data/new_pop.json").then((response) => response.json())
);
const flower = new Runtime().module(define, (name) => {
    if (name === "chart")
        return new Inspector(
            document.querySelector("#flowerroot")
        );
});
const bubble_plot = new Runtime().module(bubble, (name) => {
    if (name === "chart")
        return new Inspector(
            document.querySelector("#bubble")
        );
})
const bubble_plot1 = new Runtime().module(bubble1, (name) => {
    if (name === "chart")
        return new Inspector(
            document.querySelector("#bubble1")
        );
})
bubble_plot.redefine("data",
    fetch("./data/Popular-bubble.json").then((resp) => resp.json()))
// bubble_plot1.redefine("data",
// fetch("Popular-bubble.json").then((resp)=>resp.json()))
const bar_plot = new Runtime().module(barchart, (name) => {
    if (name === "chart")
        return new Inspector(
            document.querySelector("#barplot")
        );
})
bar_plot.redefine("data",
    fetch("./data/Popular-bar.json").then((resp) => resp.json()))
flower.redefine(
    "data",
    fetch("./data/Popular.json").then((resp) => resp.json())
);

export function dataLoad(title) {
    title = "./data/"+title.replaceAll('/', '-');
    flower.redefine(
        "data",
        fetch(title + ".json").then((resp) => resp.json())
    );
    bar_plot.redefine("data", fetch(title + "-bar.json")
        .then((resp) => resp.json()))
    bubble_plot.redefine("data", fetch(title + "-bubble.json")
        .then(resp => resp.json()))
}
let slideIndex = 1;
showSlides(slideIndex);

// Next/previous controls
export function plusSlides(n) {
    showSlides(slideIndex += n);
}

export function showSlides(n) {
    let i;
    let slides = document.getElementsByClassName("mySlides");
    //   let dots = document.getElementsByClassName("dot");
    if (n > slides.length) { slideIndex = 1 }
    if (n < 1) { slideIndex = slides.length }
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    slides[slideIndex - 1].style.display = "block";
    //   dots[slideIndex-1].className += " active";
}
