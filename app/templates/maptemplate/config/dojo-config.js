var dojoConfig = {
	isDebug: false,
	tlmSiblingOfDojo: false,
	async: true,
	cacheBust: false,
	paths: {
		"external": location.pathname.replace(/\/[^/]+$/, "") + "js/lib",
		"local": location.pathname.replace(/\/[^/]+$/, "") + "js",
		"tnsw": "http://ngistst01/mapservices/proxy/gisapi/scripts/tnsw"
	},
	parseOnLoad: false
};