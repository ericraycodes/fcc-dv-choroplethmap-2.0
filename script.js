	



/** Create a legend.
 * 1. Select a node and append an SVG.
 * 2. Prepare scales for the percentile axis and color representation.
 * 3. Plot the colored RECTs and labeled ticks.
 */
const createLegend = (obj) => {
	console.log("\ncreating a legend...", obj);

	// append legend
	const legend = d3.select(obj["node-id"]).append("svg")
		.attr("id", "legend")
		.attr("height", obj.height)
		.attr("width", obj.width);

	// percentile scale
	const axisScale = obj.scale.axis
		.domain(obj.domain)
		.range([obj.pad.hor, obj.width - obj.pad.hor]);

	// plot colored rects: [min, ...thresholds]
	legend.selectAll("rect")
		.data([obj.domain[0]].concat(obj.scale.color.domain()))
		.enter()
		.append("rect")
			.attr("class", "color")
			.attr("percentile-floor", d => d)
			.attr("height", obj.pad.ver)
			.attr("width", (d, i) => {
				if (i < 8) return axisScale(obj.scale.color.domain()[i] - d);
				else return axisScale(obj.domain[1] - d);
			})
			.attr("x", d => obj.scale.axis(d) )
			.attr("y", obj.pad.ver)
			.attr("fill", d => obj.scale.color(d));

	// plot customized ticks and labels: [min, ...thresholds, max]
	legend.selectAll("line")
		.data(obj.scale.color.domain())
		.enter()
		.append("line")
			.attr("class", "tick")
			.attr("data-percentile", d => d)
			.attr("x1", d => obj.scale.axis(d))
			.attr("x2", d => obj.scale.axis(d))
			.attr("y1", obj.pad.ver)
			.attr("y2", obj.pad.ver*2.5)
			.attr("stroke", "gray")
			.attr("stroke-width", 1.5)
	legend.selectAll("text")
		.data(obj.scale.color.domain())
		.enter()
		.append("text")
			.attr("class", "tick-value")
			.attr("data-percentile", d => d)
			.text(d => Math.round(d*100)/100 + "%")
			.style("font-size", obj.height/5 + "px" )
			.attr("x", d => obj.scale.axis(d))
			.attr("y", obj.pad.ver*4)
			.attr("transform", "translate(-7)");
};




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
 	* 7. Feature tooltip on counties on mouse-event.
 	* 8. Provide a legend of color-percentile-representation.
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
	const countiesFips = counties.features.map(obj => {
		obj.data = USEd.filter(data => data.fips === obj.id)[0];
		return obj;
	});

	
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




	// Educational rate and color representation scale
	// const edMin = d3.min(countiesFips, d => d.data.bachelorsOrHigher);
	// const edMax = d3.max(countiesFips, d => d.data.bachelorsOrHigher);
	const edExtent = d3.extent(countiesFips, d => d.data.bachelorsOrHigher);
	console.log("education data extent:", edExtent);
	const k = 9;
	const interval = (edExtent[1] - edExtent[0]) / k;
	console.log("interval:", interval);
	let percentileDomain = [];
	for (let i=1; i<k; i++) {
		percentileDomain.push(Math.floor(edExtent[0] + interval*i));
	}
	console.log("threshold domain:", percentileDomain);
	const edColorScale = d3.scaleThreshold()
		.domain(percentileDomain)
		.range(d3.schemeBlues[k]);
	// tooltip
	const tooltip = d3.select("#tooltip");


	// DRAW THE US MAP
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
			// TOOLTIP
			.on("mouseover", (e, d) => {
				const countyRect = e.target.getBoundingClientRect();
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
			.on("mouseout", (e, d) => {
				tooltip
					.style("visibility", "hidden")
					.style("top", "0px")
					.style("left", "0px")
					.html("")
					.attr("data-education", null);
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


	// LEGEND
	const legendObject ={
		"node-id" : "#legend-box",
		"height" : 50,
		"width" : 400,
		"pad" : { "hor" : 20, "ver" : 10 },
		"domain" : edExtent,
		"scale" : { "axis" : d3.scaleLinear(), "color" : edColorScale },
	}
	createLegend(legendObject);

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
			// console.log("Dataset fetched:", data[0], data[1]);
			createChoroplethMap(data[0], data[1]);
		})
		.catch(err => console.log("Error! lacking dataset:", err));
});