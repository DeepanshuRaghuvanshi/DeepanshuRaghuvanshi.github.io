var data = [];

// bounds of the data
const bounds = {};

var plane;

// for color concentration
const particleColors = d3.scaleSequential(d3.interpolateRgb('red','green')).domain([0, 60])
const grayScale = d3.scaleSequential(d3.interpolateGreys).domain([0,60])


// for rotating and zoom fucntions on the cylinder
const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableKeys = false;
    controls.enablePan = true;
    controls.enableZoom = true;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

// dat.GUI for moving the 2D plane
dat.GUI.prototype.removeFolder = function(name) {
  var folder = this.__folders[name];
  if (!folder) {
    return;
  }
  folder.close();
  this.__ul.removeChild(folder.domElement.parentNode);
  delete this.__folders[name];
  this.onResize();
}

// function to draw 2D cross-section
const draw2DPlane = function(sliderValue)
 {
    const w = bounds.maxX - bounds.minX + 1;
    const h = bounds.maxY - bounds.minY + 1;
    const plane_geometry = new THREE.PlaneGeometry(w*1.1,h*1.1,2);
    plane_geometry.rotateX(-Math.PI * 0.5);
    const plane_material = new THREE.MeshBasicMaterial({color: 0xffffff, side: THREE.DoubleSide, transparent: true, opacity: 0.5})
    plane = new THREE.Mesh(plane_geometry, plane_material);
    plane.translateY(sliderValue);
    scene.add(plane);
};

// function to create particle system
const createParticleSystem = (data) => {
    const geometry = new THREE.Geometry();
    var particle_position
        for (const i of data) {
            particle_position = new THREE.Vector3(i.X, i.Z, i.Y)
            geometry.vertices.push(particle_position)
            var particle_color = new THREE.Color(
                particleColors(i.concentration)
            )
            geometry.colors.push(particle_color)
        }
    const material = new THREE.PointsMaterial({vertexColors: THREE.VertexColors, transparent: true, size: 0.05,});
    const particle_system = new THREE.Points(geometry, material);
    scene.add(particle_system);
};


var settings = {range:0}
const gui = new dat.GUI();
var slider=gui.addFolder('2D Plane Position');
slider.add(settings, 'range', bounds.minY-0.5, bounds.maxY+0.5).onChange(function (value) {
        scene.remove(draw2DPlane)
        scene.remove(plane)
        draw2DPlane(settings.range)
        //changeColors(0,settings.range)
        plot2D(settings.range)
        //dot2 = slice(data,0)
        //scene.add(dot2)
    
});

// function to plot points in 2D plane
 const plot2D = (z) =>
    {
        var plot_points = [];
        for(var k=0; k<data.length; k++)
        {
            if(data[k].Z >= (z-0.05) && data[k].Z <= (z+0.05))
            {
                plot_points.push({
                    X: data[k].X,
                    Y: data[k].Y,
                    concentration: data[k].concentration
                })
            }
        }
        //console.log(plot_points)
        var svg = d3.select("svg")
            .attr("width", 400)
            .attr("height", 400);
        var xScale = d3.scaleLinear().domain([bounds.minX, bounds.maxX]).range([0, 400]),
            yScale = d3.scaleLinear().domain([bounds.minY, bounds.maxY]).range([400, 0]);
        svg.selectAll("*").remove();
        svg.selectAll("dot")
            .data(plot_points)
            .enter()
            .append("circle")
            .attr("cx", function (d) {return xScale(d.X)} )
            .attr("cy", function (d) {return yScale(d.Y)} )
            .attr("r", 3)
            .style("fill", function(d){ return particleColors(d.concentration); });

    };


const loadData = (file) => {

    // read the csv file
    d3.csv(file).then(function (fileData)
    // iterate over the rows of the csv file
    {
        fileData.forEach(d => {
            // get the min bounds
            bounds.minX = Math.min(bounds.minX || Infinity, d.Points0);
            bounds.minY = Math.min(bounds.minY || Infinity, d.Points1);
            bounds.minZ = Math.min(bounds.minZ || Infinity, d.Points2);

            // get the max bounds
            bounds.maxX = Math.max(bounds.maxX || -Infinity, d.Points0);
            bounds.maxY = Math.max(bounds.maxY || -Infinity, d.Points1);
            bounds.maxZ = Math.max(bounds.maxY || -Infinity, d.Points2);

            // add the element to the data collection
            data.push({
                // concentration density
                concentration: Number(d.concentration),
                // Position
                X: Number(d.Points0),
                Y: Number(d.Points1),
                Z: Number(d.Points2),
                // Velocity
                U: Number(d.velocity0),
                V: Number(d.velocity1),
                W: Number(d.velocity2)
            })
        });

        // draw the containment cylinder
        // TODO: Remove after the data has been rendered
        // createCylinder()
        // create the particle system
        createParticleSystem(data);
        draw2DPlane(5);
    })

};

loadData('058.csv');
