const url = 'https://wft-geo-db.p.rapidapi.com/v1/geo/';
const searchParam = 'limit=10&namePrefixDefaultLangResults=false'
const languageParam = 'languageCode=De';
var nextURL = "";

function callGeoApi(URLstring, functionName){
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '92e8b6d801msh3c45a4cadfc2a5fp129240jsn9ba603872649',
            'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com',
        }
    };

    fetch(URLstring, options)
	.then(response => response.json())
    .then(responseJSON => window[functionName](responseJSON))
    .catch(err => console.error(err));
}


//Search Button
function getCountrySearch(){
    const search = document.getElementById("geoSearch").value;
    if(search == ""){
        alert("Die Eingabe muss mindestens ein Zeichen lang sein!")
        return;
    }
    callGeoApi(url+'countries?'+searchParam+'&'+languageParam+'&namePrefix='+search, "showCountrySearch");
}

//shows the api results in the searchResponseArea
function showCountrySearch(response){
    const resultBody = document.getElementById("geoSearchResults");
    resultBody.innerHTML = "";
    Object.keys(response.data).forEach(element => {
        resultBody.innerHTML += 
        '<div onclick="getCountryInformation(this)" class="geoSearchEntry" '+
        'data-countryCode="'+response.data[element].code+'">'+response.data[element].name+'</div>';
    })
}


function getCountryInformation(element){
    const countryCode = element.getAttribute("data-countryCode");
    callGeoApi(url+'countries/'+countryCode+'?'+languageParam, 'showCountryInformation');
    document.getElementById("getRegionsButton").setAttribute("data-countryCode", countryCode)
}

function showCountryInformation(response){
    changeBoardVisibility(false);
    document.getElementById("regionTableBody").innerHTML = "";
    nextURL = "empty";

    const countryNameLabel = document.getElementById("countryNameLabel");
    const capitalLabel = document.getElementById("countryCapital");
    const currencyLabel = document.getElementById("countryCurrency");
    const countryFlag = document.getElementById("countryFlag");

    countryNameLabel.innerHTML = response.data.name;
    capitalLabel.innerHTML = response.data.capital;
    currencyLabel.innerHTML = "";
    Object.keys(response.data.currencyCodes).forEach(el => {
        currencyLabel.innerHTML += response.data.currencyCodes[el];
    })
    countryFlag.src = response.data.flagImageUri;

    setTimeout(() => {
        changeBoardVisibility(true);
    },800)
}


function getRegionInformation(element){
    const countryCode = element.getAttribute("data-countryCode");
    if(nextURL == "empty"){
        callGeoApi(url+'countries/'+countryCode+'/regions?'+languageParam+'&'+searchParam, 'showRegionInformation');
    } else if (nextURL == "none"){
        return;
    } else {
        callGeoApi("https://wft-geo-db.p.rapidapi.com"+nextURL, 'showRegionInformation');
    }
}

function showRegionInformation(response){
    Object.keys(response.data).forEach(key=> {
        document.getElementById("regionTableBody").innerHTML += '<tr><td>'+response.data[key].name+'</td></tr>';
    })

    nextURL = "none";
    if(response.hasOwnProperty("links")){
        Object.keys(response.links).forEach(key=> {
            if(response.links[key].rel == "next"){
                nextURL = response.links[key].href;
            }
        })
    }
}


function changeBoardVisibility(bool){
    if(bool){
        document.querySelectorAll('.hiddenTransition').forEach((element) => {
            element.style.visibility = "visible";
            element.style.opacity = 1;
        });
    } else {
        document.querySelectorAll('.hiddenTransition').forEach((element) => {
            element.style.visibility = "hidden";
            element.style.opacity = 0;
        });
    }
}

document.getElementById("openGeoManual").addEventListener("click", () => {
    const area = document.getElementById("geoAnleitung");

    if(area.style.visibility == "visible"){
        area.style.visibility = "hidden";
        area.style.height = "0px";
    }
    else{
        area.style.visibility = "visible";
        area.style.height = "230px";
    }
})



