const base_url = "https://api.openweathermap.org/data/2.5/weather";
const api_key = "102c33fff53c828dad5259653c3f3db7";

// Add event listener for Enter key in search input
document.getElementById("search").addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
        getWeather();
    }
});

function getWeather() {
    const city = document.getElementById("search").value.trim();

    if (!city) {
        showError("Please enter a city name");
        return;
    }

    // Show loading state
    showLoading();

    const url = `${base_url}?q=${city}&appid=${api_key}&units=metric`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`City not found or API error (${response.status})`);
            }
            return response.json();
        })
        .then(data => {
            hideLoading();
            display(data);
        })
        .catch(error => {
            hideLoading();
            showError(error.message);
            console.error("Error:", error);
        });
}

function showLoading() {
    // Clear previous results
    clearWeatherData();
    clearError();

    // Change button text to loading
    const button = document.querySelector('.btn');
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
    button.disabled = true;
}

function hideLoading() {
    // Restore button text
    const button = document.querySelector('.btn');
    button.innerHTML = '<i class="fas fa-search"></i> Get Weather';
    button.disabled = false;
}

function showError(message) {
    clearWeatherData();

    // Display error message
    const errorContainer = document.getElementById('error-container');
    errorContainer.innerHTML = `
        <div class="error-message">
            <i class="fas fa-exclamation-circle"></i> ${message}
        </div>
    `;
}

function clearError() {
    const errorContainer = document.getElementById('error-container');
    errorContainer.innerHTML = '';
}

function clearWeatherData() {
    document.querySelector('.city-name').textContent = '';
    document.querySelector('.p1').textContent = '';
    document.querySelector('.h2').textContent = '';
    document.querySelector('.p4').textContent = '';
    document.querySelector('.p5').textContent = '';
    document.querySelector('.p11').textContent = '';
    document.querySelector('.p12').textContent = '';
    document.querySelector('.p13').textContent = '';
    document.querySelector('.p14').textContent = 'Sunrise: ';
    document.querySelector('.p15').textContent = 'Sunset: ';
    document.querySelector('.weather-condition-icon').className = 'weather-condition-icon';
}

function formatTime(timestamp) {
    const date = new Date(timestamp * 1000);
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;

    return `${hours}:${minutes} ${ampm}`;
}

function getWeatherIcon(weatherCondition) {
    switch(weatherCondition.toLowerCase()) {
        case 'clear':
            return 'fas fa-sun';
        case 'clouds':
            return 'fas fa-cloud';
        case 'rain':
            return 'fas fa-cloud-rain';
        case 'drizzle':
            return 'fas fa-cloud-rain';
        case 'thunderstorm':
            return 'fas fa-bolt';
        case 'snow':
            return 'fas fa-snowflake';
        case 'mist':
        case 'fog':
        case 'haze':
            return 'fas fa-smog';
        default:
            return 'fas fa-cloud';
    }
}

function setWeatherBackground(weatherCondition) {
    const resultsDiv = document.getElementById('results');
    let gradient;

    switch(weatherCondition.toLowerCase()) {
        case 'clear':
            gradient = 'linear-gradient(to right, #2980b9, #6dd5fa, #ffffff)';
            break;
        case 'clouds':
            gradient = 'linear-gradient(to right, #606c88, #3f4c6b)';
            break;
        case 'rain':
        case 'drizzle':
            gradient = 'linear-gradient(to right, #373b44, #4286f4)';
            break;
        case 'thunderstorm':
            gradient = 'linear-gradient(to right, #283048, #859398)';
            break;
        case 'snow':
            gradient = 'linear-gradient(to right, #e6dada, #274046)';
            break;
        case 'mist':
        case 'fog':
        case 'haze':
            gradient = 'linear-gradient(to right, #757f9a, #d7dde8)';
            break;
        default:
            gradient = 'linear-gradient(to right, #0f2027, #203a43, #2c5364)';
    }

    resultsDiv.style.background = gradient;
}

function display(data) {
    console.log("Weather data:", data);

    // Set weather icon
    const weatherIcon = document.querySelector('.weather-condition-icon');
    weatherIcon.className = `weather-condition-icon ${getWeatherIcon(data.weather[0].main)}`;

    // City name
    document.querySelector(".city-name").innerText = `${data.name}, ${data.sys.country}`;

    // Weather description with capitalized first letter
    const description = data.weather[0].description;
    const formattedDescription = description.charAt(0).toUpperCase() + description.slice(1);
    document.querySelector(".p1").innerText = formattedDescription;

    // Temperature
    document.querySelector(".h2").innerHTML = `${Math.round(data.main.temp)}<sup>°</sup>C`;

    // Weather details
    document.querySelector(".p4").innerText = `Pressure: ${data.main.pressure} hPa`;
    document.querySelector(".p5").innerText = `Clouds: ${data.clouds.all}%`;
    document.querySelector(".p11").innerText = `Humidity: ${data.main.humidity}%`;
    document.querySelector(".p12").innerText = `Wind Speed: ${data.wind.speed} m/s`;
    document.querySelector(".p13").innerText = `Country: ${data.sys.country}`;
    document.querySelector(".p14").innerText = `Sunrise: ${formatTime(data.sys.sunrise)}`;
    document.querySelector(".p15").innerText = `Sunset: ${formatTime(data.sys.sunset)}`;

    // Change background based on weather condition
    setWeatherBackground(data.weather[0].main);
}
