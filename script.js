const apiKey = "a56bcdd94d28443fa0284117261605";

async function getWeather() {

  const location = document.getElementById("locationInput").value;

  if (location === "") {
    alert("Please enter a city name");
    return;
  }

  try {

    // Current Weather
    const currentResponse = await fetch(
      `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}&aqi=yes`
    );

    const currentData = await currentResponse.json();

    // Forecast Weather
    const forecastResponse = await fetch(
      `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=7&aqi=yes&alerts=yes`
    );

    const forecastData = await forecastResponse.json();

    displayCurrentWeather(currentData);
    displayForecast(forecastData);

  } catch (error) {
    alert("Error fetching weather data");
    console.log(error);
  }
}

function displayCurrentWeather(data) {

  document.getElementById("cityName").innerText =
    `${data.location.name}, ${data.location.country}`;

  document.getElementById("temperature").innerText =
    `${data.current.temp_c}°C`;

  document.getElementById("condition").innerText =
    data.current.condition.text;

  document.getElementById("weatherIcon").src =
    "https:" + data.current.condition.icon;

  document.getElementById("humidity").innerText =
    data.current.humidity + "%";

  document.getElementById("precipitation").innerText =
    data.current.precip_mm + " mm";

  document.getElementById("wind").innerText =
    data.current.wind_kph + " kph";

  // Air Quality
  const air = data.current.air_quality;

  document.getElementById("airQuality").innerText =
    `PM2.5: ${air.pm2_5.toFixed(1)}`;
}

function displayForecast(data) {

  const forecastContainer = document.getElementById("forecastContainer");

  forecastContainer.innerHTML = "";

  // Skip today and show next 6 days
  const forecastDays = data.forecast.forecastday.slice(1, 7);

  forecastDays.forEach(day => {

    const date = new Date(day.date);

    const card = `
      <div class="forecast-card">

        <h3>
          ${date.toLocaleDateString("en-US", {
            weekday: "short"
          })}
        </h3>

        <img src="https:${day.day.condition.icon}" alt="">

        <p>${day.day.condition.text}</p>

        <h2>${day.day.avgtemp_c}°C</h2>

        <p>Humidity: ${day.day.avghumidity}%</p>

        <p>Rain: ${day.day.totalprecip_mm} mm</p>

      </div>
    `;

    forecastContainer.innerHTML += card;

  });
}

// Default city on load
window.onload = () => {
  document.getElementById("locationInput").value = "London";
  getWeather();
};