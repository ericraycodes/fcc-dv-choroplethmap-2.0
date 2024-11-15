



/** DRAW CHOROPLETH
 	* 1. Append the page's title and description texts.
 	* 2. Setup the SVG's dimensions.
 	* 3. Prepare the map's geodata.
 	* 4. Select the map projection.
 	* 5. Create the path generator.
 	* 6. Draw the map in to the SVG.
 	*/
function createChoroplethMap(USEd, USMap) {
	console.log("C H O R O P L E T H");


	// HEADING & DESCRIPTION
	d3.select("#title").html("United States Educational Attainment");
	d3.select("#description").html(`
		Percentage of adults age 25 and older with a bachelor's degree or higher (2010 - 2014)
	`);


	// SVG DIMENSIONS
	const height = 600;
	const width = 1000;
	const svg = d3.select("#choropleth-box")
		.append("svg")
		.attr("id", "choropleth")
		.attr("height", height)
		.attr("width", width);




	// GEODATA: convert TopoJSON data to GeoJSON data
	const nation = topojson.feature(USMap, USMap.objects.nation);
	const states = topojson.feature(USMap, USMap.objects["states"]);
	const counties = topojson.feature(USMap, USMap.objects["counties"]);
	console.log("geojson nation:", nation);
	console.log("geojson states:", states);
	console.log("geojson counties:", counties);
	const usGeoJSON = {
		"type"		: "FeatureCollection",
		"features"	: nation.features.concat(states.features).concat(counties.features)
	};
	
	// PROJECTION
	const pad = 5;
	const projection = d3.geoIdentity()
		.fitExtent([[pad, pad], [width - pad, height - pad]], usGeoJSON);


	// PATH GENERATOR
	const path = d3.geoPath().projection(projection);
	console.log("path generator:", path(nation), path(states), path(counties));



	// DRAW
	svg.append("g")
		.selectAll("path")
		.data(usGeoJSON.features)
		.enter()
		.append("path")
			.attr("d", path)
			.attr("fill", "none")
			.attr("stroke", "blue");
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
			console.log("Dataset fetched:", data[0], data[1]);
			createChoroplethMap(data[0], data[1]);
		})
		.catch(err => console.log("Error! lacking dataset:", err));
});