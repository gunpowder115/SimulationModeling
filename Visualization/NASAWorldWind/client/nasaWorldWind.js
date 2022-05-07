requirejs(['./WorldWindShim',
        './LayerManager'],
    function (WorldWind,
              LayerManager) {
        "use strict";

		var pathPositionsFG = [];
		var pathPositionsINS = [];
		var pathPositionsSNS = [];
		//Create pathLayer
		var pathLayerFG = new WorldWind.RenderableLayer();
		pathLayerFG.displayName = "Paths from FG";
		var pathLayerINS = new WorldWind.RenderableLayer();
		pathLayerINS.displayName = "Paths from INS";
		var pathLayerSNS = new WorldWind.RenderableLayer();
		pathLayerSNS.displayName = "Paths from SNS";
		//Create the path's attributes
		var pathAttributesFG = new WorldWind.ShapeAttributes(null);
		pathAttributesFG.outlineColor = WorldWind.Color.BLUE;
		pathAttributesFG.interiorColor = new WorldWind.Color(0, 0, 1, 0.5);
		pathAttributesFG.drawVerticals = false;
		var pathAttributesINS = new WorldWind.ShapeAttributes(null);
		pathAttributesINS.outlineColor = WorldWind.Color.RED;
		pathAttributesINS.interiorColor = new WorldWind.Color(1, 0, 0, 0.5);
		pathAttributesINS.drawVerticals = false;
		var pathAttributesSNS = new WorldWind.ShapeAttributes(null);
		pathAttributesSNS.outlineColor = WorldWind.Color.MAGENTA;
		pathAttributesSNS.interiorColor = new WorldWind.Color(1, 0, 1, 0.5);
		pathAttributesSNS.drawVerticals = false;
		//Create the path's highlight attributes
		var highlightAttributesFG = new WorldWind.ShapeAttributes(pathAttributesFG);
		highlightAttributesFG.outlineColor = WorldWind.Color.YELLOW;
		highlightAttributesFG.interiorColor = new WorldWind.Color(1, 1, 1, 0.5);
		var highlightAttributesINS = new WorldWind.ShapeAttributes(pathAttributesINS);
		highlightAttributesINS.outlineColor = WorldWind.Color.YELLOW;
		highlightAttributesINS.interiorColor = new WorldWind.Color(1, 1, 1, 0.5);
		var highlightAttributesSNS = new WorldWind.ShapeAttributes(pathAttributesSNS);
		highlightAttributesSNS.outlineColor = WorldWind.Color.YELLOW;
		highlightAttributesSNS.interiorColor = new WorldWind.Color(1, 1, 1, 0.5);
		
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
			pathPositionsFG.push(new WorldWind.Position(arr[0], arr[1], arr[2]));
			pathPositionsINS.push(new WorldWind.Position(arr[3], arr[4], arr[5]));
			pathPositionsSNS.push(new WorldWind.Position(arr[6], arr[7], arr[8]));
			console.log(pathPositionsFG);
			
			//Create the paths
			var pathFG = new WorldWind.Path(pathPositionsFG, null);
			pathFG.altitudeMode = WorldWind.RELATIVE_TO_GROUND;
			pathFG.followTerrain = true;
			pathFG.extrude = true;
			pathFG.useSurfaceShapeFor2D = true;
			var pathINS = new WorldWind.Path(pathPositionsINS, null);
			pathINS.altitudeMode = WorldWind.RELATIVE_TO_GROUND;
			pathINS.followTerrain = true;
			pathINS.extrude = true;
			pathINS.useSurfaceShapeFor2D = true;
			var pathSNS = new WorldWind.Path(pathPositionsSNS, null);
			pathSNS.altitudeMode = WorldWind.RELATIVE_TO_GROUND;
			pathSNS.followTerrain = true;
			pathSNS.extrude = true;
			pathSNS.useSurfaceShapeFor2D = true;
			
			//Assign the path's attributes
			pathFG.attributes = pathAttributesFG;
			pathINS.attributes = pathAttributesINS;
			pathSNS.attributes = pathAttributesSNS;
			//Assign the path's highlight attributes
			pathFG.highlightAttributes = highlightAttributesFG;
			pathINS.highlightAttributes = highlightAttributesINS;
			pathSNS.highlightAttributes = highlightAttributesSNS;
			
			//Remove all paths from layer
			pathLayerFG.removeAllRenderables();
			pathLayerINS.removeAllRenderables();
			pathLayerSNS.removeAllRenderables();
			
			//Add the path to a layer 
			pathLayerFG.addRenderable(pathFG);
			pathLayerINS.addRenderable(pathINS);
			pathLayerSNS.addRenderable(pathSNS);
			
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
			wwd.addLayer(pathLayerFG);
			wwd.addLayer(pathLayerINS);
			wwd.addLayer(pathLayerSNS);

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