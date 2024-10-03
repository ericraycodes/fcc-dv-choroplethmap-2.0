



/** DRAW CHOROPLETH
 	* 1. Append the page's title and description texts.
 	* 2.
 	*/
function createChoroplethMap(data1, data2) {
	console.log("C H O R O P L E T H");


	// HEADING & DESCRIPTION
	d3.select("#title").html("United States Educational Attainment");
	d3.select("#description").html(`
		Percentage of adults age 25 and older with a bachelor's degree or higher (2010 - 2014)
	`);


	// SVG
	const svg = d3.select("#choropleth-box")
		.append("svg")
		.attr("id", "choropleth");
}




/** FETCH DATA
	* 1. Run two requests for two different dataset.
	* 2. Proceed to draw choropleth when all dataset are secured.
	*/
document.addEventListener("DOMContentLoaded", () => {
	console.log("f e t c h i n g\t\t d a t a");

	// URLs for US education and county data.
	const url1 = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json";
	const url2 = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json";

	// Fetches all dataset
	Promise
		.all([
			d3.json(url1), 
			d3.json(url2)
		])
		.then(data => {
			console.log("Dataset fetched:\n", data);
			createChoroplethMap(data[0], data[1]);
		})
		.catch(err => console.log("Error! lacking dataset:", err));
});