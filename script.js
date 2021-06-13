//Million format fonction
var millionsFormat = d3.format("$,");

//Special Format for the data supply
function supplyFormat(x) {
  var s = d3.format(".3s")(x);
  switch (s[s.length - 1]) {
    case "G": return s.slice(0, -1) + "B";
  }
  return s;
}

//A dict to change the last label of the bubble
var dict = {
    market_cap: "market_capClean",
    volume_24h: "volume_24hClean",
    price: "priceClean",
    circulating_supply: "circulating_supplyClean"
};

//Setting width and height
var width = window.innerWidth, height = 500;

//Svg creation
var svg = d3.select("#graph").append("svg").attr("width", width).attr("height", height).attr("overflow","hidden")
//        .call(d3.zoom().on("zoom", function () {
//            svg.attr("transform", d3.event.transform)
//              }));

//creating a pack
var pack = d3.pack()
  .size([width, height])
  .padding(1.5);


// Importing data and processing it
d3.csv("CMC Crypto Portfolio Tracker - CleanSummary 04 06 2021.csv", function(d) {
  return {
    symbol: d.symbol,
    name : d.name,
    cmc_rank : d.cmc_rank,
    market_cap: +d.market_cap.replace(/\,/g, '').replace(/\./g, '').slice(0,-2),
    market_capClean: millionsFormat(+d.market_cap.replace(/\,/g, '').replace(/\./g, '').slice(0,-2)),
    volume_24h: +d.volume_24h.replace(/\,/g, '').replace(/\./g, '').slice(0,-2),
    volume_24hClean: millionsFormat(+d.volume_24h.replace(/\,/g, '').replace(/\./g, '').slice(0,-2)),    
    price: +d.price.replace(/\$/g, '').replace(/\,/g, '').replace(/\./g, '').slice(0,-2),
    priceClean: millionsFormat(+d.price.replace(/\,/g, '')),
    circulating_supply: +d.circulating_supply.replace(/\,/g, '').replace(/\./g, '').slice(0,-2),
    circulating_supplyClean: supplyFormat(+d.circulating_supply.replace(/\,/g, '').replace(/\./g, '').slice(0,-2)) 
  };
}).then(function(data) {

  //Creating a hierarchy
	var root = d3.hierarchy({children: data})
	.sum(function(d) { return d.market_cap; })
	.sort(function(a, b) { return b.market_cap - a.market_cap; })

  //Appending the tooltips
  var tooltip = d3.select('#graph')
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "black")
    .style("border-radius", "5px")
    .style("padding", "10px")
    .style("color", "white")
    .style("position", "absolute")
    ;
  
  //1st function about the tooltip
  let showTooltip = function(d) {
    tooltip
      .transition()
      .duration(200)
    tooltip
      .style("opacity", 1)
      .html("Currency: " + d.data.symbol + "<br> Market Capitalization: " + d.data.market_capClean)
      .style("left", (d.x + (d3.mouse(this)[0] + 30)) + "px")
      .style("top", (d.y + (d3.mouse(this)[1] + 30)) + "px");
  }

  //2nd function about the tooltip
  let moveTooltip = function(d) {
    tooltip
      .style("left", (d.x + (d3.mouse(this)[0] + 30)) + "px")
      .style("top", (d.y + (d3.mouse(this)[1] + 30)) + "px");
  }

  //3rd function about the tooltip
  let hideTooltip = function(d) {
          tooltip
            .transition()
            .duration(200)
            .style("opacity", 0);
        }

  //Creating nodes from the hierarchy and placing the nodes in the svg
	var node = svg.selectAll(".node")
	.data(pack(root).leaves())
	.enter().append("g")
	  .attr("class", "node")
	  .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
    .on("mouseover", showTooltip)
    .on("mousemove", moveTooltip)
    .on("mouseleave", hideTooltip);

  //Appending the circles
  node.append("circle")
      .attr("id", function(d) { return d.id; })
      .attr("r", function(d) { return d.r; })
      .attr("fill", "black")

  //Appending the main labels
  node.append("text")
        .attr("class","labels")
        .attr("dy", ".2em")
        .text(function(d) {
            return d.data.symbol ;
        })
        .attr("font-family", "BloombergBold")
        .attr("font-size", function(d){
            return d.r/5;
        })
        .attr("fill", "white")
        .style("text-anchor", "middle")

  //Appending the second labels      
  node.append("text")
        .attr("class","ranks")
        .attr("dy", "1.8em")
        .text(function(d) {
            return "CMC Rank" + " " + d.data.cmc_rank ;
        })
        .attr("font-family", "BloombergBold")
        .attr("font-size", function(d){
            return d.r/7;
        })
        .attr("fill", "white")
        .style("text-anchor", "middle")

	});
  
//Creating the function allowing the update of the data in the bubbles
function updateData(variable) {
  d3.csv("CMC Crypto Portfolio Tracker - CleanSummary 04 06 2021.csv", function(d) {
  return {
    symbol: d.symbol,
    name : d.name,
    cmc_rank : d.cmc_rank,
    market_cap: +d.market_cap.replace(/\,/g, '').replace(/\./g, '').slice(0,-2),
    market_capClean: millionsFormat(+d.market_cap.replace(/\,/g, '').replace(/\./g, '').slice(0,-2)),
    volume_24h: +d.volume_24h.replace(/\,/g, '').replace(/\./g, '').slice(0,-2),
    volume_24hClean: millionsFormat(+d.volume_24h.replace(/\,/g, '').replace(/\./g, '').slice(0,-2)),    
    price: +d.price.replace(/\$/g, '').replace(/\,/g, '').replace(/\./g, '').slice(0,-2),
    priceClean: millionsFormat(+d.price.replace(/\,/g, '')),
    circulating_supply: +d.circulating_supply.replace(/\,/g, '').replace(/\./g, '').slice(0,-2),
    circulating_supplyClean: supplyFormat(+d.circulating_supply.replace(/\,/g, '').replace(/\./g, '').slice(0,-2)) 
  };
}).then(function(data) {

	var root = d3.hierarchy({children: data})
	.sum(function(d) { return d[variable]; })
	.sort(function(a, b) { return b[variable] - a[variable]; })

	var node = svg.selectAll(".node")
	  .data(pack(root).leaves())
    .transition()
    .duration(2000)
	  .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
    .select("circle")
      .attr("id", function(d) { return d.id; })
      .attr("r", function(d) { return d.r; })
      .attr("fill", "black")

   svg.selectAll(".node").select(".labels")
        .transition()
        .duration(2000)
        .attr("dy", ".2em")
        .style("text-anchor", "middle")
        .text(function(d) {
            return d.data.symbol;
        })
        .attr("font-family", "BloombergBold")
        .attr("font-size", function(d){
            return d.r/5;
        })
        .attr("fill", "white");

     svg.selectAll(".node").select(".ranks")
        .transition()
        .delay(500)
        .duration(1000)
        .attr("dy", "1.8em")
        .text(function(d) {
            return d.data[dict[variable]] ;
        })
        .attr("font-family", "BloombergBold")
        .attr("font-size", function(d){
            return d.r/7;
        })
        .attr("fill", "white")
        .style("text-anchor", "middle");

	});

};