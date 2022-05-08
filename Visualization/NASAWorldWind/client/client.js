(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
requirejs(['./WorldWindShim',
        './LayerManager'],
    function (WorldWind,
              LayerManager) {
        "use strict";

		var pathPositionsFG = [];
		var pathPositionsINS = [];
		var pathPositionsSNS = [];
		var msgCount = 0;
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
			
			if (msgCount == 0)
			{
				//Add the layer to the WorldWindow's layer list
				wwd.addLayer(pathLayerFG);
				wwd.addLayer(pathLayerINS);
				wwd.addLayer(pathLayerSNS);
			}
			
			//Redraw WorldWindow's layer list
			wwd.redraw();
			wwd.goTo(new WorldWind.Position(arr[0], arr[1], arr[2] + 2000));
			
			msgCount = msgCount + 1;			
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
		};	
		socket.onerror = function(error) {
			console.log("Connection error");
			console.log(error.message);
		};		
		
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
},{"ws":2}],2:[function(require,module,exports){
'use strict';

module.exports = function () {
  throw new Error(
    'ws does not work in the browser. Browser clients must use the native ' +
      'WebSocket object'
  );
};

},{}]},{},[1]);
