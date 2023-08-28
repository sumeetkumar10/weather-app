const API_KEY = "1ace1818afcf08dbedaca8e563b10700";

// let city="Ranchi";
// function renderWeatherInfo(data){
//     let newPara=document.createElement('p');
//     newPara.textContent=`The temperature of ${city} is ${data?.main?.temp.toFixed(2)}°C`;
//     document.body.appendChild(newPara);
// }

// async function showWeather() {
//     try {
//         const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);

//         const data = await response.json();

//         console.log("Weather data:-> ", data);

//         console.log(data);

//         renderWeatherInfo(data);
//     }
//     catch(err){
//         console.log("Error found",err);
//     }
// }

// showWeather();




const userTab = document.querySelector("[data-yourWeather]");
const searchTab = document.querySelector("[data-searchWeather]")
const userContainer = document.querySelector(".weather-container");
const grantLocation = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const weatherUserScreen = document.querySelector(".show-weather-info");
const datePara = document.querySelector("[data-showDate]");

let currentTab = userTab;
currentTab.classList.add("current-tab");
getFromSessionStorage();

// const themeSwitch = document.getElementById('themeSwitch');

// themeSwitch.addEventListener('click', function() {
//     console.log("I have Clicked on the Button.");

//     document.body.classList.toggle('dark-theme');
//     document.body.classList.toggle('light-theme');
// });

function switchTab(clickedTab) {
    if (clickedTab != currentTab) {
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");

        if (!searchForm.classList.contains("active")) {
            weatherUserScreen.classList.remove("active");
            grantLocation.classList.remove("active");
            searchForm.classList.add("active");
        }
        else {
            searchForm.classList.remove("active");
            weatherUserScreen.classList.remove("active");
            getFromSessionStorage();
        }
    }
}

userTab.addEventListener("click", () => {
    switchTab(userTab);
})

searchTab.addEventListener("click", () => {
    switchTab(searchTab);
})

function getFromSessionStorage() {
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if (!localCoordinates) {
        grantLocation.classList.add("active");
    }
    else {
        const coordinates = JSON.parse(localCoordinates);
        fetchWeatherInfo(coordinates);
    }
}

async function fetchWeatherInfo(coordinates) {
    const { lat, lon } = coordinates;

    grantLocation.classList.remove("active");
    loadingScreen.classList.add("active");

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );
        const data = await response.json();

        loadingScreen.classList.remove("active");
        weatherUserScreen.classList.add("active");
        renderWeatherInfo(data);
    }
    catch (err) {
        loadingScreen.classList.remove("active");
    }
}

function renderWeatherInfo(weatherInfo) {
    const cityName = document.querySelector("[data-city-name]");
    const countryIcon = document.querySelector("[data-country-icon]");
    const desc = document.querySelector("[data-wetherDescription]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloud]");

    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp}°C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed}m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds.all}%`;

    

}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else {
        weatherUserScreen.innerText = "Geolocation not available";
    }
}

function showPosition(position) {
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchWeatherInfo(userCoordinates);
}

const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click", getLocation);

const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let cityName = searchInput.value;

    if (cityName === ""){
        return ;
        // document.getElementById("weather-container").src="not-found.png";
        // userContainer.classList.remove("active");
    }
    else
        fetchSearchWeatherInfo(cityName);
})

async function fetchSearchWeatherInfo(city) {
    loadingScreen.classList.add("active");
    weatherUserScreen.classList.remove("active");
    grantLocation.classList.remove("active");

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );
        const data = await response.json();
        loadingScreen.classList.remove("active");
        weatherUserScreen.classList.add("active");
        renderWeatherInfo(data);
    }
    catch (err) {
        //hW

    }
}