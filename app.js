import {
    Runtime,
    Inspector,
} from "https://cdn.jsdelivr.net/npm/@observablehq/runtime@4/dist/runtime.js";
import notebook from "./treemap.js";
import define from "https://api.observablehq.com/d/2f691757ac83a209@1325.js?v=3";
import bubble from "https://api.observablehq.com/d/591ec25efcb5dcd5@602.js?v=3";
import bubble1 from "https://api.observablehq.com/d/44fd2fbbc5f2d780@605.js?v=3";
import barchart from "./barplot.js";
import { RadarChart, radarChartOptions } from "./radarChart.js"
import { stackedArea } from "./comparator-app.js";
const main = new Runtime().module(notebook, (name) => {
    if (name === "viewof chart1") {
        return new Inspector(
            document.querySelector("#tree-container")
        );
    }
});

const flower = new Runtime().module(define, (name) => {
    if (name === "chart")
        return new Inspector(
            document.querySelector(".flower-container")
        );
});

const bubble_plot = new Runtime().module(bubble, (name) => {
    if (name === "chart")
        return new Inspector(
            document.querySelector("#bubble")
        );
})

const bar_plot = new Runtime().module(barchart, (name) => {
    if (name === "chart")
        return new Inspector(
            document.querySelector("#barplot")
        );
});

let pop_data, bubble_data, emo_data;
main.redefine("data", fetch("./data/pop_data.json").then((response) => response.json()));
bubble_plot.redefine("data",
    fetch("./data/bubble-data.json").then((resp) => resp.json())
        .then(data => {
            bubble_data = data;
            return data['Popular-bubble']
        })
);
bar_plot.redefine("data",
    fetch("./data/emo_data.json").then((resp) => resp.json())
        .then(data => {
            emo_data = data;
            return data['Popular-words']
        })
);
flower.redefine(
    "data",
    fetch("./data/emo_data.json").then((resp) => resp.json())
        .then(data => data['Popular-emotion'])
);


export function dataLoad(title) {
    title = title.replaceAll('/', '-');
    bubble_plot.redefine("data", bubble_data[title + '-bubble'])

    flower.redefine("data", emo_data[title + '-emotion']);
    bar_plot.redefine("data", emo_data[title + '-words']);
}
let regions = ['QA', 'AU', "IN", 'US', 'JP'];
let selectedInit = regions.map(d => d);
let checkboxElems = document.querySelectorAll(".fcheck");

checkboxElems.forEach(box => {
    box.addEventListener("click", e => {
        let idx = selectedInit.indexOf(e.target.value);
        if (idx > -1) {
            if (selectedInit.length === 1) {
                box.checked = true;
                return;
            }
            selectedInit.splice(idx, 1);
        }
        else
            selectedInit.push(e.target.value);
        console.log(selectedInit);
        regions = [...selectedInit];
        getData("filter");
    });
});

async function getData(type) {
    let r = regions.toString();
    const tree_url = 'https://yt-backend.lamrin.dev/popular/videos?region=' + r;
    const bubble_url = 'https://yt-backend.lamrin.dev/popular/bubbles?region=' + r;
    const emo_url = 'https://yt-backend.lamrin.dev/popular/emotions?region=' + r;

    document.querySelector(".modal-close").click();
    let vis = document.querySelector("#visulization");
    vis.innerHTML = "";
    vis.style.display = "block";
    vis.innerHTML = '<div id="overlay"><span class="loader1-text">Fetching Latest Data</span><br><span class="loader1"><span class="loader1-inner"></span></span></div>'
    const responses = await Promise.all(
        [
            fetch(tree_url),
            fetch(bubble_url),
            fetch(emo_url)
        ])
    if (responses[0].ok && responses[1].ok && responses[2].ok) {
        pop_data = await responses[0].json();
        bubble_data = await responses[1].json();
        emo_data = await responses[2].json();
    }
    else {
        window.alert("No data available for selected region");
        vis.innerHTML = "";
        return;
    }
    main.redefine("data", pop_data);
    bubble_plot.redefine("data", bubble_data['Popular-bubble'])

    flower.redefine("data", emo_data['Popular-emotion']);
    bar_plot.redefine("data", emo_data['Popular-words']);
    vis.innerHTML = "";

    if (type !== "filter") {
        let html = "";
        regions.forEach(r => {
            html += `
        <input type='checkbox' class="fcheck" value='`+ r + `' checked/>
        <span style="width:100px;">`+ isoCountries[r] + `</span>
        <br>`
        })
        document.getElementById("tree-filters").innerHTML = html +
            `<button id="live" data-modal="modal-one" title="Update visulization data">Data</button>`;

        let selected = regions.map(d => d);
        let checkboxElems = document.querySelectorAll(".fcheck");
        checkboxElems.forEach(box => {
            box.addEventListener("click", e => {
                let idx = selected.indexOf(e.target.value);
                if (idx > -1) {
                    if (selected.length === 1) {
                        box.checked = true;
                        return;
                    }
                    selected.splice(idx, 1);
                }
                else
                    selected.push(e.target.value);
                console.log(selected);
                regions = [...selected];
                getData("filter");
            });
        });
    }


    let modalButton = document.getElementById("live");
    modalButton.onclick = () => {
        let modal = document.getElementById("modal-one");
        modal.classList.add('open');
        const exits = modal.querySelectorAll('.modal-exit');
        exits.forEach(function (exit) {
            exit.addEventListener('click', function (event) {
                event.preventDefault();
                modal.classList.remove('open');
            });
        });
    }
}

let live = document.querySelector("#update");
live.addEventListener("click", getData);
const bubbleComp = new Runtime().module(bubble1, (name) => {
    if (name === "chart")
        return new Inspector(document.querySelector("#bubble1"));
})
bubbleComp.redefine("data", fetch("./multi-bubble.json")
    .then(resp => resp.json()));

let channelButton = document.getElementById("channelData");
channelButton.addEventListener("click", getChannelData);
let combinedData, radardata;
const delay = ms => new Promise(res => setTimeout(res, ms));
async function getChannelData() {
    let c1 = document.getElementById("c1").value;
    let c2 = document.getElementById("c2").value;
    let c3 = document.getElementById("c3").value;

    const url1 = "https://yt-backend.lamrin.dev/channels/channel_stat/?name=" + c1 + "," + c2 + "," + c3;
    const url2 = "https://yt-backend.lamrin.dev/channels/comments?name=" + c1 + "," + c2 + "," + c3;

    document.querySelector(".modal-close").click();
    let vis = document.querySelector("#visulization1");
    vis.innerHTML = "";
    vis.style.display = "block";
    vis.innerHTML = '<div id="overlay1"><span class="loader1-text">Fetching Latest Data</span><br><span class="loader1"><span class="loader1-inner"></span></span></div>'
    // await delay(5000);
    const responses = await Promise.all(
        [
            fetch(url1),
            fetch(url2)
        ])

    if (responses[0].ok && responses[1].ok) {
        combinedData = await responses[0].json();
        radardata = await responses[1].json();
    }
    else {
        window.alert("No data available for selected channels");
        vis.innerHTML = "";
        return;
    }
    stackedArea("#my_dataviz", combinedData['stack']);
    RadarChart(".radarChart", radardata, radarChartOptions);
    bubbleComp.redefine("data", combinedData['bubble']);

    document.getElementById("legend").innerHTML = `
    <div class="square" style="background-color:#00A0B0;"></div> `+ combinedData['bubble'][0]['name'] + `<br>
    <div class="square" style="background-color:#CC333F;"></div> `+ combinedData['bubble'][7]['name'] + `<br>
    <div class="square" style="background-color:#EDC951;"></div> `+ combinedData['bubble'][14]['name'] + `<br>`
    vis.innerHTML = "";
}


let slideIndex = 1;
showSlides(slideIndex);
// Next/previous controls
export function plusSlides(n) {
    showSlides(slideIndex += n);
}


for (let i = 1; i < 3; i++) {
    document.getElementById("header" + i).addEventListener("click", () => {
        // console.log("here slides ", i);
        showSlides(slideIndex = i);
    })
}
export function showSlides(n) {
    if (n == 1) {
        document.querySelector(".prev").style.display = "none";
    }

    let i;
    let slides = document.getElementsByClassName("mySlides");
    //   let dots = document.getElementsByClassName("dot");
    if (n > slides.length) { slideIndex = 1 }
    if (n < 1) { slideIndex = slides.length }
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    slides[slideIndex - 1].style.display = "block";
    // console.log(slideIndex, slides.length, n);
    for (let i = 1; i < 3; i++) {
        if (slideIndex != i)
            document.getElementById("header" + i).style.opacity = 0.3;
        else
            document.getElementById("header" + i).style.opacity = 1;
    }
    //   dots[slideIndex-1].className += " active";
}

// var burgerMenu = document.getElementById('burger-menu');
// var overlay = document.getElementById('menu');
// burgerMenu.addEventListener('click',function(){
//   this.classList.toggle("close");
//   overlay.classList.toggle("overlay");
// });

let theme_toggler = document.querySelector('#toggle-theme');

theme_toggler.addEventListener('click', function () {
    document.body.classList.toggle('light_mode');
    if (theme_toggler.innerHTML.includes("moon.svg")) {
        theme_toggler.innerHTML = '<img src="./sun.svg" style="width: 20px;">';
        theme_toggler.title = "Light Mode";
    }
    else {
        theme_toggler.innerHTML = '<img src="./moon.svg" style="width: 20px;">';
        theme_toggler.title = "Dark Mode";
    }
});

const modals = document.querySelectorAll('[data-modal]');

modals.forEach(function (trigger) {
    trigger.addEventListener('click', function (event) {
        console.log("here again ", trigger.dataset.moda);
        event.preventDefault();
        const modal = document.getElementById(trigger.dataset.modal);
        modal.classList.add('open');
        const exits = modal.querySelectorAll('.modal-exit');
        exits.forEach(function (exit) {
            exit.addEventListener('click', function (event) {
                event.preventDefault();
                modal.classList.remove('open');
            });
        });
    });
});


let selected = document.getElementById("field1");
selected.addEventListener("change", selectedRegions);

function selectedRegions() {
    regions = Array.from(this.selectedOptions).map(x => x.value);
}

var isoCountries = {
    'AF': 'Afghanistan',
    'AX': 'Aland Islands',
    'AL': 'Albania',
    'DZ': 'Algeria',
    'AS': 'American Samoa',
    'AD': 'Andorra',
    'AO': 'Angola',
    'AI': 'Anguilla',
    'AQ': 'Antarctica',
    'AG': 'Antigua And Barbuda',
    'AR': 'Argentina',
    'AM': 'Armenia',
    'AW': 'Aruba',
    'AU': 'Australia',
    'AT': 'Austria',
    'AZ': 'Azerbaijan',
    'BS': 'Bahamas',
    'BH': 'Bahrain',
    'BD': 'Bangladesh',
    'BB': 'Barbados',
    'BY': 'Belarus',
    'BE': 'Belgium',
    'BZ': 'Belize',
    'BJ': 'Benin',
    'BM': 'Bermuda',
    'BT': 'Bhutan',
    'BO': 'Bolivia',
    'BA': 'Bosnia And Herzegovina',
    'BW': 'Botswana',
    'BV': 'Bouvet Island',
    'BR': 'Brazil',
    'IO': 'British Indian Ocean Territory',
    'BN': 'Brunei Darussalam',
    'BG': 'Bulgaria',
    'BF': 'Burkina Faso',
    'BI': 'Burundi',
    'KH': 'Cambodia',
    'CM': 'Cameroon',
    'CA': 'Canada',
    'CV': 'Cape Verde',
    'KY': 'Cayman Islands',
    'CF': 'Central African Republic',
    'TD': 'Chad',
    'CL': 'Chile',
    'CN': 'China',
    'CX': 'Christmas Island',
    'CC': 'Cocos (Keeling) Islands',
    'CO': 'Colombia',
    'KM': 'Comoros',
    'CG': 'Congo',
    'CD': 'Congo, Democratic Republic',
    'CK': 'Cook Islands',
    'CR': 'Costa Rica',
    'CI': 'Cote D\'Ivoire',
    'HR': 'Croatia',
    'CU': 'Cuba',
    'CY': 'Cyprus',
    'CZ': 'Czech Republic',
    'DK': 'Denmark',
    'DJ': 'Djibouti',
    'DM': 'Dominica',
    'DO': 'Dominican Republic',
    'EC': 'Ecuador',
    'EG': 'Egypt',
    'SV': 'El Salvador',
    'GQ': 'Equatorial Guinea',
    'ER': 'Eritrea',
    'EE': 'Estonia',
    'ET': 'Ethiopia',
    'FK': 'Falkland Islands (Malvinas)',
    'FO': 'Faroe Islands',
    'FJ': 'Fiji',
    'FI': 'Finland',
    'FR': 'France',
    'GF': 'French Guiana',
    'PF': 'French Polynesia',
    'TF': 'French Southern Territories',
    'GA': 'Gabon',
    'GM': 'Gambia',
    'GE': 'Georgia',
    'DE': 'Germany',
    'GH': 'Ghana',
    'GI': 'Gibraltar',
    'GR': 'Greece',
    'GL': 'Greenland',
    'GD': 'Grenada',
    'GP': 'Guadeloupe',
    'GU': 'Guam',
    'GT': 'Guatemala',
    'GG': 'Guernsey',
    'GN': 'Guinea',
    'GW': 'Guinea-Bissau',
    'GY': 'Guyana',
    'HT': 'Haiti',
    'HM': 'Heard Island & Mcdonald Islands',
    'VA': 'Holy See (Vatican City State)',
    'HN': 'Honduras',
    'HK': 'Hong Kong',
    'HU': 'Hungary',
    'IS': 'Iceland',
    'IN': 'India',
    'ID': 'Indonesia',
    'IR': 'Iran, Islamic Republic Of',
    'IQ': 'Iraq',
    'IE': 'Ireland',
    'IM': 'Isle Of Man',
    'IL': 'Israel',
    'IT': 'Italy',
    'JM': 'Jamaica',
    'JP': 'Japan',
    'JE': 'Jersey',
    'JO': 'Jordan',
    'KZ': 'Kazakhstan',
    'KE': 'Kenya',
    'KI': 'Kiribati',
    'KR': 'Korea',
    'KW': 'Kuwait',
    'KG': 'Kyrgyzstan',
    'LA': 'Lao People\'s Democratic Republic',
    'LV': 'Latvia',
    'LB': 'Lebanon',
    'LS': 'Lesotho',
    'LR': 'Liberia',
    'LY': 'Libyan Arab Jamahiriya',
    'LI': 'Liechtenstein',
    'LT': 'Lithuania',
    'LU': 'Luxembourg',
    'MO': 'Macao',
    'MK': 'Macedonia',
    'MG': 'Madagascar',
    'MW': 'Malawi',
    'MY': 'Malaysia',
    'MV': 'Maldives',
    'ML': 'Mali',
    'MT': 'Malta',
    'MH': 'Marshall Islands',
    'MQ': 'Martinique',
    'MR': 'Mauritania',
    'MU': 'Mauritius',
    'YT': 'Mayotte',
    'MX': 'Mexico',
    'FM': 'Micronesia, Federated States Of',
    'MD': 'Moldova',
    'MC': 'Monaco',
    'MN': 'Mongolia',
    'ME': 'Montenegro',
    'MS': 'Montserrat',
    'MA': 'Morocco',
    'MZ': 'Mozambique',
    'MM': 'Myanmar',
    'NA': 'Namibia',
    'NR': 'Nauru',
    'NP': 'Nepal',
    'NL': 'Netherlands',
    'AN': 'Netherlands Antilles',
    'NC': 'New Caledonia',
    'NZ': 'New Zealand',
    'NI': 'Nicaragua',
    'NE': 'Niger',
    'NG': 'Nigeria',
    'NU': 'Niue',
    'NF': 'Norfolk Island',
    'MP': 'Northern Mariana Islands',
    'NO': 'Norway',
    'OM': 'Oman',
    'PK': 'Pakistan',
    'PW': 'Palau',
    'PS': 'Palestinian Territory, Occupied',
    'PA': 'Panama',
    'PG': 'Papua New Guinea',
    'PY': 'Paraguay',
    'PE': 'Peru',
    'PH': 'Philippines',
    'PN': 'Pitcairn',
    'PL': 'Poland',
    'PT': 'Portugal',
    'PR': 'Puerto Rico',
    'QA': 'Qatar',
    'RE': 'Reunion',
    'RO': 'Romania',
    'RU': 'Russian Federation',
    'RW': 'Rwanda',
    'BL': 'Saint Barthelemy',
    'SH': 'Saint Helena',
    'KN': 'Saint Kitts And Nevis',
    'LC': 'Saint Lucia',
    'MF': 'Saint Martin',
    'PM': 'Saint Pierre And Miquelon',
    'VC': 'Saint Vincent And Grenadines',
    'WS': 'Samoa',
    'SM': 'San Marino',
    'ST': 'Sao Tome And Principe',
    'SA': 'Saudi Arabia',
    'SN': 'Senegal',
    'RS': 'Serbia',
    'SC': 'Seychelles',
    'SL': 'Sierra Leone',
    'SG': 'Singapore',
    'SK': 'Slovakia',
    'SI': 'Slovenia',
    'SB': 'Solomon Islands',
    'SO': 'Somalia',
    'ZA': 'South Africa',
    'GS': 'South Georgia And Sandwich Isl.',
    'ES': 'Spain',
    'LK': 'Sri Lanka',
    'SD': 'Sudan',
    'SR': 'Suriname',
    'SJ': 'Svalbard And Jan Mayen',
    'SZ': 'Swaziland',
    'SE': 'Sweden',
    'CH': 'Switzerland',
    'SY': 'Syrian Arab Republic',
    'TW': 'Taiwan',
    'TJ': 'Tajikistan',
    'TZ': 'Tanzania',
    'TH': 'Thailand',
    'TL': 'Timor-Leste',
    'TG': 'Togo',
    'TK': 'Tokelau',
    'TO': 'Tonga',
    'TT': 'Trinidad And Tobago',
    'TN': 'Tunisia',
    'TR': 'Turkey',
    'TM': 'Turkmenistan',
    'TC': 'Turks And Caicos Islands',
    'TV': 'Tuvalu',
    'UG': 'Uganda',
    'UA': 'Ukraine',
    'AE': 'United Arab Emirates',
    'GB': 'United Kingdom',
    'US': 'United States',
    'UM': 'United States Outlying Islands',
    'UY': 'Uruguay',
    'UZ': 'Uzbekistan',
    'VU': 'Vanuatu',
    'VE': 'Venezuela',
    'VN': 'Viet Nam',
    'VG': 'Virgin Islands, British',
    'VI': 'Virgin Islands, U.S.',
    'WF': 'Wallis And Futuna',
    'EH': 'Western Sahara',
    'YE': 'Yemen',
    'ZM': 'Zambia',
    'ZW': 'Zimbabwe'
};