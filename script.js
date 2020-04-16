var citySearch = document.getElementById("city-search");
var cityArray = [];
var apiKey = "40c8ddef7d6dcf0fa45ee70ad6205851";

$(document).ready(function() {

	// Look for city name input
	$("form").submit(function(e) {
		e.preventDefault();

		getCityWeather(citySearch.value);
	});
});

function getCityWeather(input) {
	console.log(input);
	var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + input + "&appid=" + apiKey;

	$.ajax({
		url: queryURL,
		method: "GET"
	}).then(function(res) {
		console.log(res);
	});
}