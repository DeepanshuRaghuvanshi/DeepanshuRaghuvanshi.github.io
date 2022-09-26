var margin = {top:0, left:-500, right:0, bottom:0},
        height = 500 - margin.top - margin.bottom,
        width = 900 - margin.left - margin.right;

    var svg = d3.select("#map")
                .append("svg")
                .attr("height", height)
                .attr("width", width)
                .append("g")
                .style("marginLeft","500px");

    d3.queue()
      .defer(d3.json, "us.json")
      .defer(d3.csv, "frequency1.csv")
      .await(ready)

    var projection = d3.geoAlbersUsa()
                       .translate([width/2, height/2])
                       .scale(950)

    var path = d3.geoPath()
                 .projection(projection)

var tooltip = d3.select("body")
    .append("div")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden")
    .style("background", "grey")
    .style("opacity",0.9)
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "10px")
    .style("padding", "15px")
    .text("a simple tooltip");

    function ready(error,data, newdata){
        //console.log(data)

        var counties = topojson.feature(data, data.objects.counties).features
        svg.selectAll(".county")
           .data(counties)
           .enter().append("path")
           .attr("class","county")
           .attr("d", path)
        var states = topojson.feature(data, data.objects.states).features
        svg.selectAll(".state")
           .data(states)
           .enter().append("path")
           .attr("class","state")
           .attr("d", path)

        console.log(newdata)
        svg.selectAll(".shootings")
           .data(newdata)
           .enter().append("circle")
           .attr("class","shootings")
           .attr("r",function(d){
                var r = Number(d.males)+Number(d.females)
                //console.log(r)
                if(r>40)
                {
                    return r*0.18
                }
                else{
                    return 0.1
                }
           })
           .attr("cx",function(d){
                var coords = projection([d.lng, d.lat])
                return coords[0]
           })
           .attr("cy",function(d){
                var coords = projection([d.lng, d.lat])
                return coords[1]
           })
           .attr("fill",function(d){
                var r = Number(d.males)+Number(d.females)
                //console.log(r)
                if(r>10 && d.names==="Chicago, Illinois")
                {
                    return "red"
                }
                if(r>10 && d.names!=="Chicago, Illinois")
                {
                    return "yellow"
                }
                else
                {
                    return "white"
                }
           })
           .attr("opacity",function(d){
                var r = Number(d.males)+Number(d.females)
                if(r>100)
                {
                    return(0.5)
                }
                else
                {
                    return 1
                }
           })
           .on('mouseover',function(d){
                var r = Number(d.males)+Number(d.females)
                tooltip.html("<b>Area:</b> "+d.names+"</br><b>Total Deaths:</b> "+r+"</br><b>Male Deaths</b>: "+d.males+"</br><b>Female Deaths:</b> "+d.females);
                return tooltip.style("visibility", "visible");
           })
           .on('mousemove',function(d){
                return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");
           })
           .on('mouseout',function(d){
                return tooltip.style("visibility", "hidden");
           });
    }