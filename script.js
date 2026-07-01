const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const weatherInfo = document.getElementById('weather-info');
const errorMessage = document.getElementById('error-message');

// WMO Weather interpretation codes (Open-Meteo specific)
function getWeatherDescription(code) {
    const weatherCodes = {
        0: 'Clear sky',
        1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
        45: 'Fog', 48: 'Depositing rime fog',
        51: 'Light drizzle', 53: 'Moderate drizzle', 55: 'Dense drizzle',
        61: 'Slight rain', 63: 'Moderate rain', 65: 'Heavy rain',
        71: 'Slight snow fall', 73: 'Moderate snow fall', 75: 'Heavy snow fall',
        95: 'Thunderstorm', 96: 'Thunderstorm with light hail', 99: 'Thunderstorm with heavy hail'
    };
    return weatherCodes[code] || 'Unknown weather';
}

async function getWeatherData(city) {
    try {
        // Step 1: Geocoding API to get Latitude and Longitude from City Name
        const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
        const geoResponse = await fetch(geoUrl);
        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            throw new Error('City not found');
        }

        const { latitude, longitude, name, country } = geoData.results[0];

        // Step 2: Weather API using coordinates
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
        const weatherResponse = await fetch(weatherUrl);
        const weatherData = await weatherResponse.json();

        updateDOM(weatherData.current_weather, `${name}, ${country}`);

    } catch (error) {
        showError();
    }
}

function updateDOM(data, locationName) {
    // Hide error, show info
    errorMessage.style.display = 'none';
    weatherInfo.style.display = 'block';

    // Update fields
    document.getElementById('city-name').textContent = locationName;
    document.getElementById('temp').textContent = Math.round(data.temperature);
    document.getElementById('weather-desc').textContent = getWeatherDescription(data.weathercode);
    document.getElementById('wind-speed').textContent = `${data.windspeed} km/h`;
}

function showError() {
    weatherInfo.style.display = 'none';
    errorMessage.style.display = 'block';
}

// Event Listeners
searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        getWeatherData(city);
    }
});

cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const city = cityInput.value.trim();
        if (city) {
            getWeatherData(city);
        }
    }
});
