(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
requirejs(['./WorldWindShim',
        './LayerManager'],
    function (WorldWind,
              LayerManager) {
        "use strict";

		var pathPositionsFG = [];
		var pathPositionsINS = [];
		var pathPositionsSNS = [];
		var pathPositionsOKF = [];
		var msgCount = 0;
		//Create pathLayers
		var pathLayerFG = new WorldWind.RenderableLayer();
		pathLayerFG.displayName = "Paths from FG";
		var pathLayerINS = new WorldWind.RenderableLayer();
		pathLayerINS.displayName = "Paths from INS";
		var pathLayerSNS = new WorldWind.RenderableLayer();
		pathLayerSNS.displayName = "Paths from SNS";
		var pathLayerOKF = new WorldWind.RenderableLayer();
		pathLayerOKF.displayName = "Paths from OKF";
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
		var pathAttributesOKF = new WorldWind.ShapeAttributes(null);
		pathAttributesOKF.outlineColor = WorldWind.Color.GREEN;
		pathAttributesOKF.interiorColor = new WorldWind.Color(0, 1, 0, 0.5);
		pathAttributesOKF.drawVerticals = false;
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
		var highlightAttributesOKF = new WorldWind.ShapeAttributes(pathAttributesOKF);
		highlightAttributesOKF.outlineColor = WorldWind.Color.YELLOW;
		highlightAttributesOKF.interiorColor = new WorldWind.Color(1, 1, 1, 0.5);
		//variables for show paths 
		var checkIdealPath, checkINSPath, checkSNSPath, checkOKFPath;
		
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
			pathPositionsOKF.push(new WorldWind.Position(arr[9], arr[10], arr[11]));
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
			var pathOKF = new WorldWind.Path(pathPositionsOKF, null);
			pathOKF.altitudeMode = WorldWind.RELATIVE_TO_GROUND;
			pathOKF.followTerrain = true;
			pathOKF.extrude = true;
			pathOKF.useSurfaceShapeFor2D = true;
			
			//Assign the path's attributes
			pathFG.attributes = pathAttributesFG;
			pathINS.attributes = pathAttributesINS;
			pathSNS.attributes = pathAttributesSNS;
			pathOKF.attributes = pathAttributesOKF;
			//Assign the path's highlight attributes
			pathFG.highlightAttributes = highlightAttributesFG;
			pathINS.highlightAttributes = highlightAttributesINS;
			pathSNS.highlightAttributes = highlightAttributesSNS;
			pathOKF.highlightAttributes = highlightAttributesOKF;
			
			//Remove all paths from all layers
			pathLayerFG.removeAllRenderables();
			pathLayerINS.removeAllRenderables();
			pathLayerSNS.removeAllRenderables();
			pathLayerOKF.removeAllRenderables();
						
			//Add the paths to a layers
			pathLayerFG.addRenderable(pathFG);
			pathLayerINS.addRenderable(pathINS);
			pathLayerSNS.addRenderable(pathSNS);
			pathLayerOKF.addRenderable(pathOKF);
			
			if (msgCount == 0)
			{
				//Add the layer to the WorldWindow's layer list
				wwd.addLayer(pathLayerFG);
				wwd.addLayer(pathLayerINS);
				wwd.addLayer(pathLayerSNS);
				wwd.addLayer(pathLayerOKF);
			}
			
			checkIdealPath = document.getElementById('showIdealPath');
			checkINSPath = document.getElementById('showINSPath');
			checkSNSPath = document.getElementById('showSNSPath');
			checkOKFPath = document.getElementById('showOKFPath');
			// show ideal path
			if (checkIdealPath.checked) { pathLayerFG.enabled = true; }
			else { pathLayerFG.enabled = false; }
			// show INS path
			if (checkINSPath.checked) { pathLayerINS.enabled = true; }
			else { pathLayerINS.enabled = false; }
			// show SNS path
			if (checkSNSPath.checked) { pathLayerSNS.enabled = true; }
			else { pathLayerSNS.enabled = false; }
			//show kalman path
			if (checkOKFPath.checked) { pathLayerOKF.enabled = true; }
			else { pathLayerOKF.enabled = false; }
			
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
			load_all_kml(wwd);
		};	
		socket.onerror = function(error) {
			console.log("Connection error");
			console.log(error.message);
			load_all_kml(wwd);
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
	
	//load and render one kml path
	function load_and_render_kml(filename, wwd) {
		var kmlFilePromise = new WorldWind.KmlFile(filename, [new WorldWind.KmlTreeVisibility('treeControls', wwd)]);
        kmlFilePromise.then(function (kmlFile) {
            var renderableLayer = new WorldWind.RenderableLayer("Surface Shapes");
            renderableLayer.addRenderable(kmlFile);

            wwd.addLayer(renderableLayer);
            wwd.redraw();
        });
	}
	
	//load and render all kml paths
	function load_all_kml(wwd) {
		load_and_render_kml('/kml/traj_ideal.kml');
		load_and_render_kml('/kml/traj_INS.kml');
		load_and_render_kml('/kml/traj_SNS.kml');
		load_and_render_kml('/kml/traj_kalman.kml');
	}
	
},{"ws":2}],2:[function(require,module,exports){
'use strict';

module.exports = function () {
  throw new Error(
    'ws does not work in the browser. Browser clients must use the native ' +
      'WebSocket object'
  );
};

},{}]},{},[1]);
