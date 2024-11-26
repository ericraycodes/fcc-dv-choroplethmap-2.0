



/** DRAW CHOROPLETH
 	* @parameter Object USEd: a list of FIPS county codes on the percentage
 	*  of educational attainment in the US per county.
 	* @parameter Object USMap: a TopoJSON geodata for the map of the USA.
 	* 
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
	const nation = topojson.feature(USMap, USMap.objects["nation"]);
	const states = topojson.feature(USMap, USMap.objects["states"]);
	const counties = topojson.feature(USMap, USMap.objects["counties"]);
	console.log("geojson nation:", nation);
	console.log("geojson states:", states);
	console.log("geojson counties:", counties);
	const countiesFips = counties.features.map(obj => {
		obj.data = USEd.filter(data => data.fips === obj.id)[0];
		return obj;
	});
	console.log("geojson counties with fips data:", countiesFips);

	
	/** PROJECTION
	 * @projection: geoIdentity()
	 * 	This is to retain the pre-projection of geoAlbersUsa()
	 * 	from the TopoJSON data. It is applied with 'projection.fitExtent()'
	 * 	method to automatically position the map within the SVG's dimension.
	 */
	const pad = 5;
	const projection = d3.geoIdentity()
		.fitExtent([[pad, pad], [width - pad, height - pad]], nation);


	// PATH GENERATOR
	const path = d3.geoPath().projection(projection);
	// console.log("path generator:", path(nation), path(states), path(counties));




	// Educational rate and color representation scale
	const edMin = d3.min(countiesFips, d => d.data.bachelorsOrHigher);
	const edMax = d3.max(countiesFips, d => d.data.bachelorsOrHigher);
	const edColorScale = d3.scaleQuantize()
		.domain([edMin, edMax])
		.range(d3.schemeBlues[9]);
	console.log("color scale domain and range\n", edColorScale.domain(), edColorScale.range());
	// tooltip
	const tooltip = d3.select("#tooltip");


	// DRAW
	// counties
	svg.append("g")
		.selectAll("path")
		.data(countiesFips)
		.enter()
		.append("path")
			.attr("d", path)
			.attr("class", "county")
			// county data
			.attr("data-fips", d => d.id)
			.attr("data-education", d => d.data.bachelorsOrHigher)
			// county color fill
			.attr("fill", d => edColorScale(d.data.bachelorsOrHigher))
			.attr("stroke", "white")
			.attr("stroke-width", "0.15")
			// tooltip
			.on("mouseover", d => {
				console.count("mouseover");
				const countyRect = d3.event.target.getBoundingClientRect();
				tooltip
					// county data-education
					.attr("data-education", d.data.bachelorsOrHigher)
					.html(`
						<p class="area">${d.data.area_name}, ${d.data.state}:</p>
						<p class="percentage">${d.data.bachelorsOrHigher}&percnt;</p>
					`);
				const tooltipRect = document.querySelector("#tooltip").getBoundingClientRect();
				tooltip
					.style("top", countyRect.y - (tooltipRect.height / 2) + "px")
					.style("left", countyRect.right + 8 + "px")
					.style("visibility", "visible");
			})
			.on("mouseout", d => {
				console.count("mouseout");
				tooltip
					.style("visibility", "hidden")
					.style("top", "0px")
					.style("left", "0px")
					.html("");
			})
	// states
	svg.append("g")
		.selectAll("path")
		.data(states.features)
		.enter()
		.append("path")
			.attr("d", path)
			.attr("fill", "none")
			.attr("stroke", "white")
			.attr("stroke-width", "0.5");
	// nation
	svg.append("g")
		.selectAll("path")
		.data(nation.features)
		.enter()
		.append("path")
			.attr("d", path)
			.attr("fill", "none")
			.attr("stroke", "white")
			.attr("stroke-width", "1.5");
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