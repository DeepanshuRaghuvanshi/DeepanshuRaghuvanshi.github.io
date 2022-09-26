var margin = {top:0, left:-500, right:0, bottom:0},
            height = 500 - margin.top - margin.bottom,
            width = 900 - margin.left - margin.right;

    

    d3.queue()
      .defer(d3.json, "us.json")
      .defer(d3.csv, "frequency1.csv")
      .defer(d3.csv, "freq_by_state.csv")
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

    function ready(error,data, newdata, newdata2){

        //console.log(newdata)
        showmap = async () => {

            d3.selectAll('svg').remove();
            d3.selectAll('rect').remove();
            d3.selectAll('text').remove();
            d3.selectAll('circle').remove();
            console.log(data.objects)
            var svg = d3.select("#map")
                .append("svg")
                .attr("height", height)
                .attr("width", width)
                .append("g")
                .style("marginLeft","500px");
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

            svg.selectAll(".shootings")
               .data(newdata)
               .enter().append("circle")
               .attr("class","shootings")
               .attr("r",2)
               .attr("cx",function(d){
                    var coords = projection([d.lng, d.lat])
                    return coords[0]
                    })
               .attr("cy",function(d){
                     var coords = projection([d.lng, d.lat])
                     return coords[1]
                    })
               .attr("fill","black")
               .attr("opacity",0.9)
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
        showmap2 = async () => {
        
            d3.selectAll('svg').remove();
            d3.selectAll('rect').remove();
            d3.selectAll('text').remove();
            d3.selectAll('circle').remove();
            console.log(data.objects)
            var svg = d3.select("#map")
                .append("svg")
                .attr("height", height)
                .attr("width", width)
                .append("g")
                .style("marginLeft","500px");
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

            svg.selectAll(".shootings")
               .data(newdata)
               .enter().append("circle")
               .attr("class","shootings")
               .attr("r",function(d){
                    if(Number(d.females)>0 && Number(d.males)==0)
                    {
                        return 2;
                    }
                    else
                    {
                        return 0
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
               .attr("fill","red")
               .attr("opacity",0.9)
               .on('mouseover',function(d){
                     var r = Number(d.males)+Number(d.females)
                    tooltip.html("<b>Area:</b> "+d.names+"</br><b>Female Deaths:</b> "+d.females);
                    return tooltip.style("visibility", "visible");
                    })
               .on('mousemove',function(d){
                     return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");
                    })
               .on('mouseout',function(d){
                     return tooltip.style("visibility", "hidden");
                    });

        
    }
    showmap3 = async () => {
        
            d3.selectAll('svg').remove();
            d3.selectAll('rect').remove();
            d3.selectAll('text').remove();
            d3.selectAll('circle').remove();
            console.log(data.objects)
            var svg = d3.select("#map")
                .append("svg")
                .attr("height", height)
                .attr("width", width)
                .append("g")
                .style("marginLeft","500px");
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

            svg.selectAll(".shootings")
               .data(newdata)
               .enter().append("circle")
               .attr("class","shootings")
               .attr("r",function(d){
                    if(Number(d.females)==0 && Number(d.males)>0)
                    {
                        return 2;
                    }
                    else
                    {
                        return 0
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
               .attr("fill","blue")
               .attr("opacity",0.9)
               .on('mouseover',function(d){
                     var r = Number(d.males)+Number(d.females)
                    tooltip.html("<b>Area:</b> "+d.names+"</br><b>Male Deaths:</b> "+d.males);
                    return tooltip.style("visibility", "visible");
                    })
               .on('mousemove',function(d){
                     return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");
                    })
               .on('mouseout',function(d){
                     return tooltip.style("visibility", "hidden");
                    });

        
    }
    showmap4 = async () => {
        
            d3.selectAll('svg').remove();
            d3.selectAll('rect').remove();
            d3.selectAll('text').remove();
            d3.selectAll('circle').remove();
            console.log(data.objects)
            var svg = d3.select("#map")
                .append("svg")
                .attr("height", height)
                .attr("width", width)
                .append("g")
                .style("marginLeft","500px");
            var states = topojson.feature(data, data.objects.states).features
            svg.selectAll(".state")
               .data(states)
               .enter().append("path")
               .attr("class","state")
               .attr("d", path)

            svg.selectAll(".shootings")
               .data(newdata)
               .enter().append("circle")
               .attr("class","shootings")
               .attr("r",function(d){
                    if(Number(d.females)==0 && Number(d.males)>0)
                    {
                        return 2;
                    }
                    else
                    {
                        return 0
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
               .attr("fill","black")
               .attr("opacity",0.9)
               .on('mouseover',function(d){
                     var r = Number(d.males)+Number(d.females)
                    tooltip.html("<b>Area:</b> "+d.names+"</br><b>Male Deaths:</b> "+d.males);
                    return tooltip.style("visibility", "visible");
                    })
               .on('mousemove',function(d){
                     return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");
                    })
               .on('mouseout',function(d){
                     return tooltip.style("visibility", "hidden");
                    });

        
    }

}
