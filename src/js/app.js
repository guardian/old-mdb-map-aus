import * as d3 from "d3"
import * as topojson from "topojson"

var zoomOn = null;

function makeMap(states, places, rivers, boundary) {

	var statusMessage = d3.select("#statusMessage");
	// console.log(data, places);
	var width = document.querySelector("#mapContainer").getBoundingClientRect().width
	var height = width * 0.6
	var mobile = false;

	if (width < 500) {
	    height = width * 0.8;
	    mobile = true;
	}
	var margin = {top: 0, right: 0, bottom: 0, left:0}
	var active = d3.select(null);
	var scaleFactor = width / 860
	var parseDate = d3.timeParse("%Y-%m-%d");

	var topRadius = 10 * scaleFactor;
	var bottomRadius = 2 * scaleFactor;

	// var mapScale = 1.8;

	// if (mobile) {
	// 	mapScale = 2
	// }

	var maxYears = 10 * 364

	var radius = d3.scaleSqrt()
					.range([bottomRadius,topRadius])    
					.domain([6,400])	

	var gradient = d3.scaleLinear()
						.range(['rgba(219, 0, 14, 0.6)', 'rgba(1, 77, 175, 0.6)'])
						.domain([0,maxYears])


	var projection = d3.geoMercator()
	                .scale(1)
	                .translate([0,0])


	var locations = d3.select('#points');	                
	

	// console.log(sa2s.objects.sa2s
	   

	d3.select("#mapContainer svg").remove();
	d3.select("#keyContainer svg").remove();

	var keyWidth = 100
	var keyHeight = 100

	if (width < 450) {
		keyWidth = 70
		keyHeight = 70
	}

				

	var svg = d3.select("#mapContainer").append("svg")	
	                .attr("width", width)
	                .attr("height", height)
	                .attr("id", "map")
	                .attr("overflow", "hidden");                                      

	// context.clearRect(0, 0, width, height);

	var path = d3.geoPath()
	    .projection(projection);

	var bounds = path.bounds(topojson.feature(states,states.objects.states));

	console.log(bounds)

	var mapScale = 1 / Math.max(
	    (bounds[1][0] - bounds[0][0]) / width,
	    (bounds[1][1] - bounds[0][1]) / height);

	var transW = 0.5
	var transH = 0.5

	var translation = [
	    ((width - mapScale * (bounds[1][0] + bounds[0][0])) * transW),
	    (height - mapScale * (bounds[1][1] + bounds[0][1])) * transH];

	console.log(mapScale, translation) 
	
	projection
		.scale(mapScale)
		.translate(translation);

	var raster_width = (bounds[1][0] - bounds[0][0]) * mapScale;
	var raster_height = (bounds[1][1] - bounds[0][1]) * mapScale;

	var rtranslate_x = (width - raster_width) * 0.5;
	var rtranslate_y = (height - raster_height) * 0.5;	       

	console.log("rtranslate_x", rtranslate_x, "rtranslate_y", rtranslate_y)
	var graticule = d3.geoGraticule();  

	var filterPlaces = places.features.filter(function(d){ 
		if (mobile) {
			return d.properties.scalerank < 1	
		}

		else {
			return d.properties.scalerank < 1	
		}
		
	});
	console.log(filterPlaces);

	function drawMap() {


		svg.append("image")
	        .attr('id', 'Raster')
	        .attr("xlink:href", '<%= path %>/assets/aus-crop-light.png')
	        .attr("class", "raster")
	        .attr("width", raster_width)
	        .attr("height", raster_height)
	        .attr("transform", "translate(" + rtranslate_x + ", " + rtranslate_y + ")");        


	    svg.append("g")
		    .selectAll("path")
		    .data(topojson.feature(states,states.objects.states).features)
		    .enter().append("path")
		        .attr("class", "sa2")
		        .attr("id", d => "sa2" + d.properties.name)
		        .attr("fill", "none")
		        .attr("stroke", "#bcbcbc")
		        .attr("data-tooltip","")
		        .attr("d", path);    

		svg.append("g")
		    .selectAll("path")
		    .data(topojson.feature(rivers,rivers.objects.mdb_main_rivers).features)
		    .enter().append("path")
		        .attr("class", "sa2")
		        .attr("fill", "none")
		        .attr("stroke", "#aad8f1")
		        .style("opacity",0.7)
		        .attr("stroke-width", 2)
		        .attr("data-tooltip","")
		        .attr("d", path);          

			svg.append("g")
		    .selectAll("path")
		    .data(topojson.feature(boundary,boundary.objects.mdb_boundary).features)
		    .enter().append("path")
		        .attr("class", "sa2")
		        .attr("fill", "lightblue")
		        .attr("stroke", "#aad8f1")
		        .style("opacity",0.7)
		        .attr("stroke-width", 2)
		        .attr("data-tooltip","")
		        .attr("d", path);          


		var placeContainers = svg.selectAll(".placeContainers")
					.data(filterPlaces)
					.enter().append("g")
						.attr("class", "placeContainers")
						.attr("transform", function(d) { return "translate(" + projection(d.geometry.coordinates) + ")"; })		

		placeContainers
			.append("circle")
			.attr("class","placeCircle")
		    .attr("r", 2)

		placeContainers
			.append("text")
			.attr("class", "placeText")
			.attr("dx", 5)
			.attr("dy", 5)
			.style("font-size", 0.8 + "rem" )
			.text(function(d) { return d['properties']['name']})        


	    // context.drawImage(imageObj, rtranslate_x, rtranslate_y, raster_width, raster_height);

	    // context.beginPath();
	    // path(topojson.mesh(states,states.objects.states));
	    // context.strokeStyle= "#bcbcbc";
	    // context.stroke();
	    // context.closePath();

	 //    filterPlaces.forEach(function(d,i) {
		// 	context.beginPath();
		// 	context.save();
		// 	context.fillStyle="#767676";
		// 	context.shadowColor="white";
		// 	context.shadowBlur=5;
		// 	context.fillText(d.properties.name,projection([d.properties.longitude,d.properties.latitude])[0],projection([d.properties.longitude,d.properties.latitude])[1]);
		// 	context.font = "15px 'Guardian Text Sans Web' Arial";
		//     context.closePath();
		//     context.restore();

		// })
	}



	drawMap();
	      




	statusMessage.transition(600).style("opacity",0);

	var monthText = d3.select("#monthText")
	var yearText = d3.select("#yearText")


	// var interval = d3.interval(animate, 200);



}


Promise.all([
	d3.json('<%= path %>/assets/au-states.json'),
	d3.json('<%= path %>/assets/places.json'),
	d3.json('<%= path %>/assets/mdb_main_rivers.json'),
	d3.json('<%= path %>/assets/mdb_boundary.json'),

])
.then((results) =>  {

	var imageObj = new Image()
	

	imageObj.onload = function() {
		makeMap(results[0],results[1], results[2], results[3])
	}
	imageObj.src = '<%= path %>/assets/aus-crop-light.png'

	var to=null
	var lastWidth = document.querySelector("#mapContainer").getBoundingClientRect()
	window.addEventListener('resize', function() {

		var thisWidth = document.querySelector("#mapContainer").getBoundingClientRect()
		if (lastWidth != thisWidth) {
			
			window.clearTimeout(to);
			to = window.setTimeout(function() {
				    makeMap(results[0],results[1], results[2])
				}, 100)
		}
			
	})

});