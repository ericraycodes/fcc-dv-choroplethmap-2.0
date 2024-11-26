# About
Visualizing dataset as a choropleth map with D3. The fourth certification project of freeCodeCamp's Data Visualization Course.

# Workflow
1. Setup *Vite* and *GitHub* repository.
1. Prepared the initial *html* structure; worked primarily on the *logic*; *styled* when needed.
1. *Passed* all tests; did the finishing touches; *deployed* with GitHub pages.

# D3 Mapping Concept
[Making Maps with D3](https://www.d3indepth.com/geographic/)
- *GeoJSON* (a JSON-based format for specifying geographic data)
- *projections* (functions that convert from latitude/longitude co-ordinates to x & y co-ordinates)
- geographic *path generators* (functions that convert GeoJSON shapes into SVG or Canvas paths)

# Data
1. The *GeoJSON* data is the native format supported by D3.
1. The *TopoJSON* data is the efficient way to format larger GeoJSON data.
1. Use the *topojson.feature()* to convert a TopoJSON data to a GeoJSON *FeatureCollection* and isolate its *features* using dot notation.



# Choropleth
1. The base map is drawn first.

# Logic


# References / Readings
- Introduction to Digital Cartography: GeoJson and D3. [reference](https://medium.com/@amy.degenaro/introduction-to-digital-cartography-geojson-and-d3-js-c27f066aa84)
- Extract GeoJSON data from a TopoJSON data. [reference](https://medium.com/@amy.degenaro/introduction-to-digital-cartography-geojson-and-d3-js-c27f066aa84)


# Notables
- The d3 cdn is not *deferred*. The module scripts are automatically deferred. [Read about the script tag.](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script)


# Additional Study
1. How to draw using the SVG Path - `<path>` element, as basic understanding. [Paths MDN reference](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Paths)
1. Learn about the use of geodata formats: *GeoJSON, TopoJSON*. [GeoJSON RFC 7946](https://datatracker.ietf.org/doc/html/rfc7946)
1. Learn about *Projections*.
1. Learn about *Path generators*.
