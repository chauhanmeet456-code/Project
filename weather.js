const result1 = document.getElementById("result1");
const result2 = document.getElementById("result2");

const city1Input = document.getElementById("city1");
const city2Input = document.getElementById("city2");

const suggestions1 = document.getElementById("suggestions1");
const suggestions2 = document.getElementById("suggestions2");

const compareBtn = document.getElementById("compareBtn");


// Weather code map

function getWeatherData(code) {
  const map = {
    0: { text: "Clear Sky", icon: "☀️" },
    1: { text: "Mainly Clear", icon: "🌤️" },
    2: { text: "Partly Cloudy", icon: "⛅" },
    3: { text: "Overcast", icon: "☁️" },
    45: { text: "Fog", icon: "🌫️" },
    48: { text: "Rime Fog", icon: "🌫️" },
    51: { text: "Light Drizzle", icon: "🌦️" },
    53: { text: "Moderate Drizzle", icon: "🌦️" },
    55: { text: "Dense Drizzle", icon: "🌧️" },
    61: { text: "Slight Rain", icon: "🌦️" },
    63: { text: "Moderate Rain", icon: "🌧️" },
    65: { text: "Heavy Rain", icon: "🌧️" },
    71: { text: "Slight Snow", icon: "🌨️" },
    73: { text: "Moderate Snow", icon: "❄️" },
    75: { text: "Heavy Snow", icon: "❄️" },
    80: { text: "Rain Showers", icon: "🌦️" },
    81: { text: "Moderate Showers", icon: "🌧️" },
    82: { text: "Violent Showers", icon: "⛈️" },
    95: { text: "Thunderstorm", icon: "⛈️" }
  };
  return map[code] || { text: "Unknown", icon: "❓" };
}


// Extract clean city name

function getCleanCityName(place) {
  return (
    place.address?.city ||
    place.address?.town ||
    place.address?.municipality ||
    place.address?.county ||
    place.address?.state_district ||
    place.address?.village ||
    place.address?.suburb ||
    place.name ||
    place.display_name.split(",")[0]
  );
}

// Loading Card UI

function showLoading(card, cityLabel = "Loading...") {
  card.innerHTML = `
    <div class="placeholder">
      <div class="weather-icon">⏳</div>
      <h2>${cityLabel}</h2>
      <p class="loading">Fetching weather data...</p>
    </div>
  `;
}


// Error Card UI

function showError(card, message) {
  card.innerHTML = `
    <div class="placeholder">
      <div class="weather-icon">⚠️</div>
      <h2>Something went wrong</h2>
      <p class="error">${message}</p>
    </div>
  `;
}


// Search Suggestions (Only India)

async function fetchSuggestions(query, suggestionBox, inputField) {
  if (query.trim().length < 2) {
    suggestionBox.innerHTML = "";
    return;
  }

  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query + ", India")}&format=json&addressdetails=1&countrycodes=in&limit=8`;

    const response = await fetch(url, {
      headers: { "Accept-Language": "en" }
    });

    const data = await response.json();
    suggestionBox.innerHTML = "";

    const uniqueCities = [
      ...new Map(
        data.map(place => {
          const city = getCleanCityName(place);
          return [city.toLowerCase(), city];
        })
      ).values()
    ];

    uniqueCities.forEach(city => {
      const li = document.createElement("li");
      li.textContent = city;
      li.addEventListener("click", () => {
        inputField.value = city;
        suggestionBox.innerHTML = "";
      });
      suggestionBox.appendChild(li);
    });

  } catch (error) {
    suggestionBox.innerHTML = "";
  }
}

// Get coordinates

async function getCoordinates(city) {
  const geoUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city + ", India")}&format=json&addressdetails=1&countrycodes=in&limit=1`;

  const response = await fetch(geoUrl, {
    headers: { "Accept-Language": "en" }
  });

  const data = await response.json();

  if (data.length === 0) {
    throw new Error(`Indian city not found: ${city}`);
  }

  return {
    name: getCleanCityName(data[0]),
    lat: data[0].lat,
    lon: data[0].lon
  };
}


// Get weather

async function getWeather(lat, lon) {
  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code,apparent_temperature,surface_pressure&timezone=auto`;

  const response = await fetch(weatherUrl);
  const data = await response.json();

  return {
    temp: data.current.temperature_2m,
    humidity: data.current.relative_humidity_2m,
    wind: data.current.wind_speed_10m,
    code: data.current.weather_code,
    feelsLike: data.current.apparent_temperature,
    pressure: data.current.surface_pressure
  };
}

// Display premium weather card
function displayWeather(card, cityData, weatherData) {
  const weather = getWeatherData(weatherData.code);

  card.innerHTML = `
    <div class="weather-premium">
      <div class="weather-top">
        <div>
          <p class="city-tag">📍 Indian City</p>
          <h2 class="city-name">${cityData.name}</h2>
          <p class="weather-condition">${weather.icon} ${weather.text}</p>
        </div>
        <div class="temp-box">
          <span class="main-temp">${weatherData.temp}°</span>
          <span class="temp-unit">C</span>
        </div>
      </div>

      <div class="condition-badge">${weather.text}</div>

      <div class="weather-grid">
        <div class="weather-item">
          <span>💧</span>
          <div>
            <small>Humidity</small>
            <strong>${weatherData.humidity}%</strong>
          </div>
        </div>

        <div class="weather-item">
          <span>🌬️</span>
          <div>
            <small>Wind</small>
            <strong>${weatherData.wind} km/h</strong>
          </div>
        </div>

        <div class="weather-item">
          <span>🥵</span>
          <div>
            <small>Feels Like</small>
            <strong>${weatherData.feelsLike}°C</strong>
          </div>
        </div>

        <div class="weather-item">
          <span>🌡️</span>
          <div>
            <small>Pressure</small>
            <strong>${weatherData.pressure} hPa</strong>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Compare weather
async function compareWeather() {
  const city1 = city1Input.value.trim();
  const city2 = city2Input.value.trim();

  if (!city1 || !city2) {
    alert("Please enter both Indian city names.");
    return;
  }

  showLoading(result1, city1);
  showLoading(result2, city2);

  compareBtn.disabled = true;
  compareBtn.textContent = "Comparing...";

  try {
    const cityData1 = await getCoordinates(city1);
    const cityData2 = await getCoordinates(city2);

    const weather1 = await getWeather(cityData1.lat, cityData1.lon);
    const weather2 = await getWeather(cityData2.lat, cityData2.lon);

    displayWeather(result1, cityData1, weather1);
    displayWeather(result2, cityData2, weather2);

  } catch (error) {
    showError(result1, error.message);
    showError(result2, error.message);
  } finally {
    compareBtn.disabled = false;
    compareBtn.textContent = "Compare Now";
  }
}

// Input events
city1Input.addEventListener("input", () => {
  fetchSuggestions(city1Input.value, suggestions1, city1Input);
});

city2Input.addEventListener("input", () => {
  fetchSuggestions(city2Input.value, suggestions2, city2Input);
});

compareBtn.addEventListener("click", compareWeather);

// Enter key support
city1Input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") compareWeather();
});

city2Input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") compareWeather();
});

// Close suggestions
document.addEventListener("click", (e) => {
  if (!e.target.closest(".input-wrapper")) {
    suggestions1.innerHTML = "";
    suggestions2.innerHTML = "";
  }
});