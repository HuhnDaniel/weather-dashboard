var citySearch = document.getElementById("city-search");
var cityArray = [];
var apiKey = "40c8ddef7d6dcf0fa45ee70ad6205851";

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
	var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + input + "&appid=" + apiKey;

	$.ajax({
		url: queryURL,
		method: "GET"
	}).then(function(res) {
		console.log(res);

		// Check if city is on citylist already
		if (!cityArray.includes(input)) {
			// Only add a city to the city list if a response is recieved, so it is confirmed to be a real city
			cityArray.push(input);
			populateCityList();
		}
	});
}

// Function to populate searched city list
function populateCityList() {
	$(".city-list").empty();

	cityArray.forEach(function(city) {
		var newCity = $("<li>");
		newCity.addClass("city");
		newCity.text(city);
		$(".city-list").prepend(newCity);
	});
}