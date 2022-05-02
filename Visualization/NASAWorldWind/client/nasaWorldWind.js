requirejs(['./WorldWindShim',
        './LayerManager'],
    function (WorldWind,
              LayerManager) {
        "use strict";

		var pathPositions = [];
		//Create pathLayer
		var pathLayer = new WorldWind.RenderableLayer();
		pathLayer.displayName = "Paths";
		//Create the path's attributes
		var pathAttributes = new WorldWind.ShapeAttributes(null);
		pathAttributes.outlineColor = WorldWind.Color.BLUE;
		pathAttributes.interiorColor = new WorldWind.Color(0, 1, 1, 0.5);
		pathAttributes.drawVerticals = false;
		//Create the path's highlight attributes
		var highlightAttributes = new WorldWind.ShapeAttributes(pathAttributes);
		highlightAttributes.outlineColor = WorldWind.Color.RED;
		highlightAttributes.interiorColor = new WorldWind.Color(1, 1, 1, 0.5);
		
		// Tell WorldWind to log only warnings and errors.
        WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING);

        // Create the WorldWindow.
        var wwd = new WorldWind.WorldWindow("canvasOne");

        // Create and add layers to the WorldWindow.
        var layers = [
            // Imagery layers.
            {layer: new WorldWind.BMNGLayer(), enabled: true},
            {layer: new WorldWind.BMNGLandsatLayer(), enabled: false},
            {layer: new WorldWind.BingAerialLayer(null), enabled: false},
            {layer: new WorldWind.BingAerialWithLabelsLayer(null), enabled: true},
            {layer: new WorldWind.BingRoadsLayer(null), enabled: false},
            {layer: new WorldWind.OpenStreetMapImageLayer(null), enabled: false},
            // Add atmosphere layer on top of all base layers.
            {layer: new WorldWind.AtmosphereLayer(), enabled: true},
            // WorldWindow UI layers.
            {layer: new WorldWind.CompassLayer(), enabled: true},
            {layer: new WorldWind.CoordinatesDisplayLayer(wwd), enabled: true},
            {layer: new WorldWind.ViewControlsLayer(wwd), enabled: true}
        ];

        for (var l = 0; l < layers.length; l++) {
            layers[l].layer.enabled = layers[l].enabled;
            wwd.addLayer(layers[l].layer);
        }
		
		//Connect to server and handle sockets
		
		var ws = require("ws");
		var socket = new WebSocket("ws://127.0.0.1:5969/");
		console.log("Before connection...");
		socket.onopen = function() {
			console.log("Connection installed");
		};
		socket.onmessage = function(event) {
			console.log("Message");
			var arr = event.data.split(',');
			for (var i = 0; i < arr.length; i++)
			{ arr[i] = +arr[i]; }
			console.log(arr);
			//pathPositions = addingPositions(arr[0], arr[1], arr[2]);
			pathPositions.push(new WorldWind.Position(arr[0], arr[1], arr[2]));
			console.log(pathPositions);
			
			//Create the path
			var path = new WorldWind.Path(pathPositions, null);
			path.altitudeMode = WorldWind.RELATIVE_TO_GROUND;
			path.followTerrain = false;
			path.extrude = true;
			path.useSurfaceShapeFor2D = true;
			
			//Assign the path's attributes
			path.attributes = pathAttributes;
			//Assign the path's highlight attributes
			path.highlightAttributes = highlightAttributes;
			
			//Add the path to a layer 
			pathLayer.addRenderable(path);
			
			// //Add the layer to the WorldWindow's layer list
			// wwd.addLayer(pathLayer);

			// //Redraw WorldWindow's layer list
			// wwd.redraw();
			
			// //Remove pathLayer from the WorldWindow's layer list
			// wwd.removeLayer(pathLayer);
		};
		socket.onclose = function(event) {
			if (event.wasClean)
			{
				console.log("Connection closed clearly");
				console.log(event.code);
				console.log(event.reason);
			}
			else
			{
				console.log("Connection interrupted");
			}
			//Add the layer to the WorldWindow's layer list
			wwd.addLayer(pathLayer);

			//Redraw WorldWindow's layer list
			wwd.redraw();
		};	
		socket.onerror = function(error) {
			console.log("Connection error");
			console.log(error.message);
		};
		
		//creating and rendering real-time path
		
		// //Create the path (added)
		// var path = new WorldWind.Path(pathPositions, null);
		// path.altitudeMode = WorldWind.RELATIVE_TO_GROUND;
		// path.followTerrain = true;
		// path.extrude = true;
		// path.useSurfaceShapeFor2D = true;
		
		// //Create the path's attributes (added)
		// var pathAttributes = new WorldWind.ShapeAttributes(null);
		// pathAttributes.outlineColor = WorldWind.Color.BLUE;
		// pathAttributes.interiorColor = new WorldWind.Color(0, 1, 1, 0.5);
		// pathAttributes.drawVerticals = true;
		// //Assign the path's attributes
		// path.attributes = pathAttributes;
		
		// //Create the path's highlight attributes (added)
		// var highlightAttributes = new WorldWind.ShapeAttributes(pathAttributes);
		// highlightAttributes.outlineColor = WorldWind.Color.RED;
		// highlightAttributes.interiorColor = new WorldWind.Color(1, 1, 1, 0.5);
		// //Assign the path's highlight attributes
		// path.highlightAttributes = highlightAttributes;
		
		// //Add the path to a layer (added)
		// var pathLayer = new WorldWind.RenderableLayer();
		// pathLayer.displayName = "Paths";
		// pathLayer.addRenderable(path);
		// //Add the layer to the WorldWindow's layer list
		// wwd.addLayer(pathLayer);
		
		
		//downloading and rendering path from kml-file
		
		// var kmlFilePromise = new WorldWind.KmlFile('flight_ins.kml', [new WorldWind.KmlTreeVisibility('treeControls', wwd)]);
        // kmlFilePromise.then(function (kmlFile) {
            // var renderableLayer = new WorldWind.RenderableLayer("Surface Shapes");
            // renderableLayer.addRenderable(kmlFile);

            // wwd.addLayer(renderableLayer);
            // wwd.redraw();
        // });
		
		
		//Now set up to handle highlighting
		var highlightController = new WorldWind.HighlightController(wwd);

        // Create a layer manager for controlling layer visibility.
        var layerManager = new LayerManager(wwd);
    });