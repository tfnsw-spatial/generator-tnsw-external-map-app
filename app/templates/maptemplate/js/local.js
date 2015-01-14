var sampleConfig = {};

// Setup text symbol attributes
sampleConfig.tsymbol = {
	"type": "esriTS",
	"color": [0,0,200,200],
	"text": "...",
	"verticalAlignment": "bottom",
	"horizontalAlignment": "center",
	"yoffset": -15,
	"font": {
		"family": "Open Sans",
		"size": 8,
		"style": "normal",
		"weight": "normal",
		"decoration": "none"
	}
};

// Setup json symbol for the polygons and then the polygon highlights
sampleConfig.jsymbol = {"color":[255,0,0,25],"outline":{"color":[255,0,0,100],"width":3,"type":"esriSLS","style":"esriSLSSolid"},"type":"esriSFS","style":"esriSFSSolid"};
sampleConfig.jsymbolh = {"color":[255,0,0,50],"outline":{"color":[255,0,0,255],"width":3,"type":"esriSLS","style":"esriSLSSolid"},"type":"esriSFS","style":"esriSFSSolid"};

// Setup the feature layer configuration. DO NOT CHANGE.
sampleConfig.customLayers = {
	"featureLayers" : [			
		{
			id: 'sampledata',
			placeAtIndex: 1,
			
			isJson: true,			
			geoJsonUrl: location.href.replace(/\/[^/]+$/, "") + "data/sampledata",
			isEsriJson: true,
			
			hovertipField: ["Zone"],					
			blockPopup: true,				
			featureCollection: {
				"layerDefinition"	: null,
				"featureSet": null
			},
			drawingInfo: {
				"renderer": {
					"type": "simple",
					"symbol": sampleConfig.jsymbol
				}
			}
		}
	]
};

sampleConfig.labelsConfig = [
	/*{ geometry: {"x":9688338.775634157,"y":4422213.991530776,"spatialReference":{"wkid":3308}}, symbol: sampleConfig.tsymbol, text: "South Precinct" },
	{ geometry: {"x":9688754.172298279,"y":4423247.191513844,"spatialReference":{"wkid":3308}}, symbol: sampleConfig.tsymbol, text: "Retail Precinct"},
	{ geometry: {"x":9689303.183812968,"y":4422901.90957328,"spatialReference":{"wkid":3308}}, symbol: sampleConfig.tsymbol, text: "College Precinct"},
	{ geometry: {"x":9688636.432479467,"y":4424152.068323597,"spatialReference":{"wkid":3308}}, symbol: sampleConfig.tsymbol, text: "North West Precinct"},
	{ geometry: {"x":9689218.516976967,"y":4424074.01608416,"spatialReference":{"wkid":3308}}, symbol: sampleConfig.tsymbol, text: "Financial Precinct"}*/
];

///
/// OnLoad
///

require(["dojo/on", "dojo/parser", "dojo/ready", "dojo/sniff", "dojo/dom-class", "dojo/topic", "dojo/_base/window", "dojo/_base/array", "dojo/dom-style",
		"esri/layers/GraphicsLayer", "esri/graphic", "esri/symbols/SimpleFillSymbol",
		"tnsw/JsonFeatureLayer", "tnsw/Config"],
	function(on, parser, ready, has, domClass, topic,  win, array, domStyle,
		GraphicsLayer, Graphic, SimpleFillSymbol, JsonFeatureLayer){
				
		var highligtedGraphic = null;
		
		ready(function(){
			tnswSpatial.tnswDevice = { desktop: true };
			if (has("ie") == 9) domClass.add(win.body(), 'ie9');			
			if (has("ie") < 9) domClass.add(win.body(), 'ie');
			if (has("ios")) domClass.add(win.body(), 'ios');								
			topic.subscribe("mapLoaded", mapLoaded);
			parser.parse();						
		});
		
		function mapLoaded(/*newTnswMap*/) {
			tnswSpatial.tnswMap.map.resize();
			
			// Enable hovertips
			pmConfig._hovertipEnabled = true;
			tnswSpatial.tnswMap.fetchHovertip();

			// disable all navigation modes
			/*tnswSpatial.tnswMap.map.disableClickRecenter();
			tnswSpatial.tnswMap.map.disableDoubleClickZoom();
			tnswSpatial.tnswMap.map.disableKeyboardNavigation();
			tnswSpatial.tnswMap.map.disableMapNavigation();
			tnswSpatial.tnswMap.map.disablePan();
			tnswSpatial.tnswMap.map.disableRubberBandZoom();
			tnswSpatial.tnswMap.map.disableScrollWheelZoom();
			tnswSpatial.tnswMap.map.disableShiftDoubleClickZoom();*/
			
			for (var c in sampleConfig.customLayers.featureLayers){
				var pconfig = sampleConfig.customLayers.featureLayers[c];
				tnswSpatial["fl_" + pconfig.id] = new JsonFeatureLayer(
					pconfig.featureCollection,
					pconfig,
					tnswSpatial.tnswMap.map,
					function (fl, config){
						fl.tnswConfig = config;
						connectLayerEvents(fl, config);
					}
				);
			}
					
			/// LABELS
			
			var background = new GraphicsLayer();
			tnswSpatial.tnswMap.map.addLayer(background, 10);					
			
			var labels = [];
			for (var l in sampleConfig.labelsConfig){				
				var g = new Graphic(sampleConfig.labelsConfig[l]);
				g.symbol.setText(sampleConfig.labelsConfig[l].text);
				labels.push(g);				
			}
			
			if (labels[0] && labels[0].geometry.spatialReference.wkid != tnswSpatial.tnswMap.map.spatialReference.wkid){
				var deferred = tnswSpatial.tnswMap.projectToMapSpatialReference(array.map(labels, function(l){return l.geometry;}));
				deferred.then(function(reprojectedFeatures){
					array.forEach(labels, function(l, index /*, array*/){
						l.setGeometry(reprojectedFeatures[index]);
						background.add(l);
					});					
					background.refresh();					
				});
			}
			else{
				array.forEach(labels, function(l /*, index , array*/){
					background.add(l);
				});		
				background.refresh();
			}
			
			// Hide the spinners
			var s = document.getElementById("spinner");
			if (s) {
				domStyle.set(s, "display", "none");
				s.innerHTML = "";
			}
		}
		
		function connectLayerEvents(fl, config){
			tnswSpatial.tnswMap._connectFeatureLayerEvents(fl, config);
			
			if (fl.id == "sampledata"){			
				on(fl, "mouse-over", function(e){
					tnswSpatial.tnswMap.selectbox = null;
					if (e.graphic){
						e.graphic.setSymbol(new SimpleFillSymbol(sampleConfig.jsymbolh));
						tnswSpatial.tnswMap.map.setCursor("pointer");
						highligtedGraphic = e.graphic;
					}						
				});
				
				on(fl, "mouse-out", function(e){
					tnswSpatial.tnswMap.map.setCursor("default");
					if (highligtedGraphic){
						e.graphic.setSymbol(new SimpleFillSymbol(sampleConfig.jsymbol));
					}
				});									
				
				on(fl, "click", function(e){
					if (e.graphic){
						alert("zone info : " + e.graphic.attributes.Zone);
					}
				});
			}
		}
	}
);


///
///
///
function _keyPressHandler(e) {
	require(["dojo/keys"], function (keys) {
		if (e.keyCode == keys.ENTER)
			e.target.click();
	});
}

///
/// Zooms
///
function zoomIn() {
	if (!tnswSpatial || !tnswSpatial.tnswMap) return;
	tnswSpatial.tnswMap.zoomIn();
}

function zoomOut() {
	if (!tnswSpatial || !tnswSpatial.tnswMap) return;
	tnswSpatial.tnswMap.zoomOut();
}