const chartData = {};
var graphChart, pieChart;
var currentCode;

initCharts();

document.querySelectorAll(".ageListEntry").forEach((node) => {
    node.addEventListener("click", () => {
        showPieData(node.innerHTML);
    })
})

document.getElementById("chartSearchBar").addEventListener("keyup",(test) => {
    const text = document.getElementById("chartSearchBar").value.toLowerCase();

    document.querySelectorAll(".chartSearchEntry").forEach((node) => {
        if(node.innerHTML.toLowerCase().includes(text)){
            node.style.display = "block"
        }
        else{
            node.style.display = "none"
        }
    })
})

function getChartData(){
    const options = {
        method: 'GET',
        headers: {
            'content-type': 'application/json',
        }
    };

    Promise.all([
        fetch('https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/TPS00001?format=JSON&lang=de', options),
        fetch("https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/TPS00010?format=JSON&lang=de", options)
    ])
        .then(responses => Promise.all(responses.map(response => response.json())))
        .then(data => organiseChartData(...data))
        .catch(err => console.log(err));
}

function organiseChartData(populationData, ageData){
    let namespace;

    //Population on 1 Jan.
    namespace = populationData.dimension.geo.category;
    Object.keys(namespace.index).forEach(key => {
        if(namespace.index[key]<= 2){return}

        chartData[key] = {};
        chartData[key].name = namespace.label[key];
        chartData[key].index = namespace.index[key];
        chartData[key].data = {};

        let timenamespace = populationData.dimension.time.category;
        let i = 0;
        Object.keys(timenamespace.index).forEach(time => {
            chartData[key].data[time] = populationData.value[chartData[key].index * Object.keys(timenamespace.index).length + i];
            i++;
        })
    })

   
    //Age Distribution
    namespace = ageData.dimension.geo.category;
    Object.keys(namespace.index).forEach(key => {
        if(!chartData.hasOwnProperty(key)){return}

            chartData[key].ageIndex = namespace.index[key];
            chartData[key].ageData = {};

            let timenamespace = ageData.dimension.time.category;

            for(let j = 0;j < 6;j++){
                let i = 0;
                
                Object.keys(timenamespace.index).forEach(time => {
                    if(j == 0){
                        chartData[key].ageData[time] = [];
                    }
                    chartData[key].ageData[time].push(ageData.value[(chartData[key].ageIndex * 12+i) + (12*54*j)]);
                    i++;
                })
            }
    })
    
    const filteredNames = ["DE","FX","XK"];
    filteredNames.forEach( (el) => {
        chartData[el].name = filterNameString(chartData[el].name);
    })

    const removedNames = ["BA", "MC", "FX"];
    removedNames.forEach((el) =>{
        delete chartData[el];
    })

    listChartSearchResults();
}

function filterNameString(string){
    const index = string.indexOf("(");
    return index > 0 ? string.substring(0,index) : string;
}

function listChartSearchResults(){
    let code, name;
    stringArr = [];
    let i = 0;
    const resultArea =  document.getElementById("chartSearchResults");

    resultArea.innerHTML = "";
    
    for(key in chartData){
        code = key;
        name = chartData[key].name;
        stringArr[i] = `<div class="chartSearchEntry" data-code="${code}" onclick="showGraphData(this)">${name}</div>`;
        i++;
    }

    i = 0;
    myInterval = setInterval(() => {
        resultArea.innerHTML += stringArr[i];
        i++;

        if(i == stringArr.length-1){
            clearInterval(myInterval);
        }
    }, 75)
}

function showPieData(year){
    if(currentCode === undefined){
        return;
    }

    pieChart.data.datasets[0].data = chartData[currentCode].ageData[year];
    pieChart.update();

    document.getElementById("pieCountry").innerHTML = chartData[currentCode].name;
    document.getElementById("pieYear").innerHTML = year;
}


function showGraphData(element){
    currentCode = element.getAttribute("data-code");

    const valueArray = [];
    for(key in chartData[currentCode].data){
        valueArray.push(chartData[currentCode].data[key])
    }

    graphChart.data.datasets[0].data = valueArray;
    graphChart.data.datasets[0].label = "Bevölkerungsstand am 1. Januar in "+chartData[currentCode].name;
    graphChart.update();

    showPieData(2022);
}

function initCharts(){
    Chart.defaults.font.size = 18;
    graphChart = new Chart(document.getElementById('graphCanvas'),
        {
            type: 'line',
            data: {
                labels: [2011,2012,2013,2014,2015,2016,2017,2018,2019,2020,2021,2022],
                datasets: [{
                    data: [],
                    label: "Bevölkerungsstand am 1. Januar in (-)",
                }]
            }
        }
    );


    pieChart = new Chart(document.getElementById('pieCanvas'),
        {
            type: 'pie',
            data:  {
                labels: [
                  '0 - 14',
                  '15 - 24',
                  '25 - 49',
                  '50 - 64',
                  '65 - 79',
                  '80 +'
                ],
                datasets: [{
                  data: [0,0,0,0,0,0],
                  hoverOffset: 4,
                  backgroundColor: ["#36a2eb","#ffcd56","#ff6384","#32bd7b","#bd31b3","#9d651a"]
                }]
            }
        }
    );
}
