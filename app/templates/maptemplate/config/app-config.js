///
/// BASIC CONFIGURATION
///
var pmConfig = {};
pmConfig.title = "<%= appTitle %>"
pmConfig.showOverviewMap = false;
pmConfig.showScaleBar = false;
pmConfig.proxyURL="https://appln.transport.nsw.gov.au/mapservices/proxy";  //TODO: change this to 
pmConfig.geometryServiceUrl = pmConfig.proxyURL + "/Geometry/GeometryServer";
//pmConfig.geometryServiceUrl = "http://utility.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer";
pmConfig.defaultExtent = {"xmin":16829910,"ymin":-4015442,"xmax":16834688,"ymax":-4007799,"spatialReference":{"wkid":102100}};
//pmConfig.defaultExtent = {xmax: 9691415, xmin: 9686785,ymax: 4426010, ymin: 4420718, "spatialReference":{"wkid":3308}};

pmConfig.Layers = {
	"operationalLayers": [],
	"baseMap": {
		"baseMapLayers": [
		{
			"opacity": 1,
			"visibility": false,				
			"url": "//services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer",				
			"title": "ESRI Base Map",
			"id": "ESRIBaseMap",
			"switchLabel": "Gray",
			"relatedBasemapId" : "ESRILabelMap" // The id of layer that will be turned on/off with this layer
		},
		{
			"opacity": 1,
			"visibility": false,				
			"url": "//services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer",				
			"title": "ESRI World Imagery",
			"switchLabel": "Image",
			"id": "ESRIRasterMap"				
		},
		{
			"opacity": 1,
			"visibility": true,				
			"url": "//services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer",				
			"title": "ESRI Topo Map",
			"switchLabel": "Topo",
			"id": "ESRITopoMap"				
		},
		{
			"opacity": 1,
			"visibility": false,				
			"url": "//services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer",				
			"title": "ESRI Label Map",
			"id": "ESRILabelMap"
		}],
		"title": "TNSW Cache Map"
	},
	"version": "1.1"
};