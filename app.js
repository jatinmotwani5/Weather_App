let container = document.querySelector(".container");
let inputPart = container.querySelector(".info-part");
let InfoPart = inputPart.querySelector(".info-text");
let inputField = inputPart.querySelector("input");
let locationBtn = inputPart.querySelector("button");
let wIcon = document.querySelector(".Weather-part img");
let arrowBack = container.querySelector("header i");

let api;
inputField.addEventListener('keyup', e =>{
   if(e.key == "Enter" && inputField.value!=""){
    requestApi(inputField.value)
   }
});

locationBtn.addEventListener("click", ()=>{
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    } else {
        alert("Your browser doesnot support geolocation api");
    }
})

function onSuccess(position){
   const {latitude, longitude} = position.coords;
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=ff7549486d36a5c82f3f2c075fbec0a9`
    fetchData();
}

function onError(error){
    InfoPart.innerText = error.message;
    InfoPart.classList.add("error");
}

function requestApi(city){
     api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=ff7549486d36a5c82f3f2c075fbec0a9`;
    fetchData();
}

function fetchData(){
    InfoPart.innerText = "Getting weather details...";
    InfoPart.classList.add("pending");
    fetch(api).then(response => response.json()).then(result => weatherDetails(result));
}
function weatherDetails(info){
    InfoPart.classList.replace("pending", "error");
    if (info.cod == "404") {
        InfoPart.innerText = `${inputField.value} is not a valid city name`;   
    }else{
        const city = info.name;
        const country = info.sys.country;
        const {description, id} = info.weather[0];
        const {feels_like, humidity, temp} = info.main;

        if(id == 800){
            wIcon.src = "icons/clear.svg"
        }
        else if(id >= 200 && id <= 232){
            wIcon.src = "icons/strom.svg"
        }
        else if(id >= 600 && id <= 622){
            wIcon.src = "icons/snow.svg"
        }
        else if(id >= 701 && id <= 781){
            wIcon.src = "icons/haze.svg"
        }
        else if(id >= 801 && id <= 804){
            wIcon.src = "icons/cloud.svg"
        }
        else if((id >= 300 && id <= 321) || (id >=500 && id<=531)){
            wIcon.src = "icons/rain.svg"
        }

        container.querySelector(".temp .num").innerText = Math.floor(temp);
        container.querySelector(".weather").innerText = description;
        container.querySelector(".location span").innerText = `${city}, ${country}`;
        container.querySelector(".temp .num-2").innerText = Math.floor(feels_like);
        container.querySelector(".column-humidity span").innerText = `${humidity}%`;

        InfoPart.classList.remove("pending", "error");
        container.classList.add("active");
    } 
}

arrowBack.addEventListener("click", ()=>{
    container.classList.remove("active");
   window.location.reload();
})