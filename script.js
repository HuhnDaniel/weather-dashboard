var citySearch = document.getElementById("city-search");
var cityArray = [];
var apiKey = "40c8ddef7d6dcf0fa45ee70ad6205851";

// If there is a previous city array, get it and populate the city list
if (localStorage.getItem("cityArray") !== null) {
	cityArray = localStorage.getItem("cityArray").split(",");
	populateCityList();
}

// If there was a previously searched city load most recent search results
if (localStorage.getItem("lastCity") !== null) {
	getCityWeather(localStorage.getItem("lastCity"));
}

$(document).ready(function() {

	// Look for city name input
	$("form").submit(function(e) {
		e.preventDefault();

		getCityWeather(citySearch.value);

		citySearch.value = "";
	});
});

// Function to take input city and search for its weather
function getCityWeather(input) {
	var currentWeatherURL = "https://api.openweathermap.org/data/2.5/weather?q=" + input + "&units=imperial&appid=" + apiKey;

	$.ajax({
		url: currentWeatherURL,
		method: "GET"
	}).then(function(res) {
		console.log(res);

		// Check if city is on citylist already
		if (!cityArray.includes(input)) {

			// Only add a city to the city list if a response is recieved, so it is confirmed to be a real city
			cityArray.push(input);
			// Add updated city array to localstorage
			localStorage.setItem("cityArray", cityArray.toString());
			// Update shown cities
			populateCityList();
		}

		// Saves this city as the last city searched
		localStorage.setItem("lastCity", input);

		populateCurrentWeather(res);
		populateUVIndex(res);
	});
}

// Function to populate searched city list
function populateCityList() {
	$(".city-list").empty();

	// Make a listing for each city name
	cityArray.forEach(function(city) {
		var newCity = $("<li>").addClass("city")
							   .text(city);

		$(".city-list").prepend(newCity);
	});
}

function populateCurrentWeather(weatherObj) {
	$(".weather-current").empty();
	
	// City, date, and icon for city weather header
	var today = moment.unix(weatherObj.dt).format("(M/D/YYYY)");
	var weatherHeader = $("<p>").addClass("weather-city")
								.text(weatherObj.name + " " + today)
	var weatherIcon = $("<img>").attr("src", "http://openweathermap.org/img/wn/" + weatherObj.weather[0].icon + ".png")
								.addClass("weather-icon");
	$(".weather-current").append(weatherHeader.append(weatherIcon));

	// Current temperature line
	var tempEl = $("<p>").text("Temperature: " + (Math.round(weatherObj.main.temp * 10) / 10) + "° F")
						 .addClass("weather-details");
	$(".weather-current").append(tempEl);

	// Current humidity line
	var humidEl = $("<p>").text("Humidity: " + weatherObj.main.humidity + "%")
						  .addClass("weather-details");
	$(".weather-current").append(humidEl);

	// Wind speed line
	var windEl = $("<p>").text("Wind Speed: " + weatherObj.wind.speed + " MPH")
						 .addClass("weather-details");
	$(".weather-current").append(windEl);
}

function populateUVIndex(weatherObj) {
	var uvIndexURL = "https://api.openweathermap.org/data/2.5/uvi?lat=" + weatherObj.coord.lat + "&lon=" + weatherObj.coord.lon + "&appid=" + apiKey;

	$.ajax({
		url: uvIndexURL,
		method: "GET"
	}).then(function(res) {
		console.log(res);

		var uvEl = $("<p>").html("UV index: <span id=\"uv-value\">" + res.value + "</span>")
						   .addClass("weather-details");
		$(".weather-current").append(uvEl);

		// Determine what severity the UV level is and color accordingly
		if (res.value < 3) {
			$("#uv-value").addClass("low");
		} else if (3 <= res.value && res.value < 6) {
			$("#uv-value").addClass("moderate");
		} else if (6 <= res.value && res.value < 8) {
			$("#uv-value").addClass("high");
		} else if (8 <= res.value && res.value < 11) {
			$("#uv-value").addClass("very-high");
		} else {
			$("#uv-value").addClass("extreme");
		}
	});
}