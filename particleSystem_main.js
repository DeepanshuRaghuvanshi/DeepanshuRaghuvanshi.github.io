const data = [];
// bounds of the data
const bounds = {};

// for color concentration
const particleColors = d3.scaleSequential(d3.interpolateRgb('red','green')).domain([0, 60])


// for rotating and zoom fucntions on the cylinder
const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableKeys = false;
    controls.enablePan = true;
    controls.enableZoom = true;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

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

// function to draw 2D cross-section
const draw2DPlane = function() {
    const w = bounds.maxX - bounds.minX + 1;
    const h = bounds.maxY - bounds.minY + 1;
    const plane_geometry = new THREE.PlaneGeometry(w*1.1,h*1.1);
    const plane_material = new THREE.MeshBasicMaterial( {color: 0xffffff, side: THREE.DoubleSide, transparent: true, opacity: 0.5} );
    const plane = new THREE.Mesh(plane_geometry, plane_material);
    plane.translateY(5);
    scene.add(plane);
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
        draw2DPlane();
    })

};
loadData('058.csv');