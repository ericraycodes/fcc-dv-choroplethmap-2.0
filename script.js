



document.addEventListener("DOMContentLoaded", () => {
	console.count("f e t c h i n g\t\t d a t a");

	// XHR objects for requesting the us education and county datasets, respectively.
	const request1 = new XMLHttpRequest();
	const request2 = new XMLHttpRequest();

	// URLs for US education and county data.
	const url1 = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json";
	const url2 = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json";

	// requests
	request1.open("GET", url1, true);
	request1.send();
	request2.open("GET", url2, true);
	request2.send();

	// storage for the datasets
	let json1 = null;
	let json2 = null;

	// Request 1 returned
	request1.onload = () => {
		console.log("request 1 successful");
		json1 = JSON.parse(request1.responseText);
		console.log("US Ed data:", json1);
		if (json1 && json2) console.log("choropleth ready...");
	};
	// Request 2 returned
	request2.onload = () => {
		console.log("request 2 successful");
		json2 = JSON.parse(request2.responseText);
		console.log("US County data:", json2);
		if (json1 && json2) console.log("choropleth ready...");
	};
});