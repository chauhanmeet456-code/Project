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

// Loading UI

function showLoading(card, cityLabel = "Loading...") {
  card.innerHTML = `
    <div class="placeholder">
      <div class="weather-icon">⏳</div>
      <h2>${cityLabel}</h2>
      <p class="loading">Fetching live weather data...</p>
    </div>
  `;
}

// Error UI

function showError(card, message) {
  card.innerHTML = `
    <div class="placeholder">
      <div class="weather-icon">⚠️</div>
      <h2>Something went wrong</h2>
      <p class="error">${message}</p>
    </div>
  `;
}

// Debounce helper

function debounce(fn, delay = 400) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

// Fetch city suggestions

async function fetchSuggestions(query, suggestionBox, inputField) {
  if (query.trim().length < 2) {
    suggestionBox.innerHTML = "";
    return;
  }

  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=8&language=en&format=json&countryCode=IN`;

    const response = await fetch(url);
    const data = await response.json();

    suggestionBox.innerHTML = "";

    if (!data.results || data.results.length === 0) {
      return;
    }

    const uniqueCities = [
      ...new Map(
        data.results.map(place => [
          `${place.name}-${place.admin1 || ""}`.toLowerCase(),
          {
            name: place.name,
            state: place.admin1 || ""
          }
        ])
      ).values()
    ];

    uniqueCities.forEach(city => {
      const li = document.createElement("li");
      li.textContent = city.state ? `${city.name}, ${city.state}` : city.name;

      li.addEventListener("click", () => {
        inputField.value = city.name;
        suggestionBox.innerHTML = "";
      });

      suggestionBox.appendChild(li);
    });

  } catch (error) {
    console.error("Suggestion error:", error);
    suggestionBox.innerHTML = "";
  }
}

// Get coordinates

async function getCoordinates(city) {
  const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json&countryCode=IN`;

  const response = await fetch(geoUrl);
  const data = await response.json();

  if (!data.results || data.results.length === 0) {
    throw new Error(`City not found: ${city}`);
  }

  const place = data.results[0];

  return {
    name: place.name,
    state: place.admin1 || "",
    lat: place.latitude,
    lon: place.longitude
  };
}

// Get live weather

async function getWeather(lat, lon) {
  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code,apparent_temperature,surface_pressure&timezone=auto&temperature_unit=celsius&wind_speed_unit=kmh`;

  const response = await fetch(weatherUrl);
  const data = await response.json();

  if (!data.current) {
    throw new Error("Weather data not available");
  }

  return {
    temp: data.current.temperature_2m,
    humidity: data.current.relative_humidity_2m,
    wind: data.current.wind_speed_10m,
    code: data.current.weather_code,
    feelsLike: data.current.apparent_temperature,
    pressure: data.current.surface_pressure,
    time: data.current.time
  };
}

// Display weather card

function displayWeather(card, cityData, weatherData) {
  const weather = getWeatherData(weatherData.code);

  card.innerHTML = `
    <div class="weather-premium">
      <div class="weather-top">
        <div>
          <p class="city-tag">📍 India${cityData.state ? " • " + cityData.state : ""}</p>
          <h2 class="city-name">${cityData.name}</h2>
          <p class="weather-condition">${weather.icon} ${weather.text}</p>
          <p class="weather-time">🕒 ${weatherData.time.replace("T", " ")}</p>
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

// Comparison summary

function showComparisonSummary(cityData1, weather1, cityData2, weather2) {
  let summary = "";

  if (weather1.temp > weather2.temp) {
    summary += `🔥 ${cityData1.name} is hotter than ${cityData2.name}. `;
  } else if (weather2.temp > weather1.temp) {
    summary += `🔥 ${cityData2.name} is hotter than ${cityData1.name}. `;
  } else {
    summary += `🌡️ Both cities have the same temperature. `;
  }

  if (weather1.humidity > weather2.humidity) {
    summary += `💧 ${cityData1.name} is more humid. `;
  } else if (weather2.humidity > weather1.humidity) {
    summary += `💧 ${cityData2.name} is more humid. `;
  }

  if (weather1.wind > weather2.wind) {
    summary += `🌬️ ${cityData1.name} is windier.`;
  } else if (weather2.wind > weather1.wind) {
    summary += `🌬️ ${cityData2.name} is windier.`;
  }

  const summaryBox = document.getElementById("comparisonSummary");
  if (summaryBox) {
    summaryBox.innerHTML = `<div class="summary-box">${summary}</div>`;
  }
}

// Compare weather

async function compareWeather() {
  const city1 = city1Input.value.trim();
  const city2 = city2Input.value.trim();

  if (!city1 || !city2) {
    alert("Please enter both city names.");
    return;
  }

  showLoading(result1, city1);
  showLoading(result2, city2);

  compareBtn.disabled = true;
  compareBtn.textContent = "Comparing...";

  try {
    const [cityData1, cityData2] = await Promise.all([
      getCoordinates(city1),
      getCoordinates(city2)
    ]);

    const [weather1, weather2] = await Promise.all([
      getWeather(cityData1.lat, cityData1.lon),
      getWeather(cityData2.lat, cityData2.lon)
    ]);

    displayWeather(result1, cityData1, weather1);
    displayWeather(result2, cityData2, weather2);

    showComparisonSummary(cityData1, weather1, cityData2, weather2);

  } catch (error) {
    console.error("Compare error:", error);
    showError(result1, error.message);
    showError(result2, error.message);
  } finally {
    compareBtn.disabled = false;
    compareBtn.textContent = "Compare Weather";
  }
}

// Debounced suggestions

const debouncedSuggestions1 = debounce(() => {
  fetchSuggestions(city1Input.value, suggestions1, city1Input);
}, 400);

const debouncedSuggestions2 = debounce(() => {
  fetchSuggestions(city2Input.value, suggestions2, city2Input);
}, 400);

city1Input.addEventListener("input", debouncedSuggestions1);
city2Input.addEventListener("input", debouncedSuggestions2);

// Compare button

compareBtn.addEventListener("click", compareWeather);

// Enter key support

city1Input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") compareWeather();
});

city2Input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") compareWeather();
});

// Close suggestions on outside click

document.addEventListener("click", (e) => {
  if (!e.target.closest(".input-wrapper")) {
    suggestions1.innerHTML = "";
    suggestions2.innerHTML = "";
  }
});

// Optional auto refresh every 60 sec

setInterval(() => {
  if (city1Input.value.trim() && city2Input.value.trim()) {
    compareWeather();
  }
}, 60000);