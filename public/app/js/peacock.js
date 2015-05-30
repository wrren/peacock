function init_map( div ) {
	return AmCharts.makeChart( 	div, 
					{
	  					type: "map",
	  					"theme": "none",
	  					path: "http://www.amcharts.com/lib/3/",

	  					"zoomControl": {
							"zoomControlEnabled": false
						},

						colorSteps: 100,

						dataProvider: 
						{
							map: "worldLow",
							areas: []
						},

						dragMap: false,

						areasSettings: 
						{
							autoZoom: true
						},

						valueLegend: 
						{
							right: 10,
							minValue: "Low Trade Activity",
							maxValue: "High Trade Activity"
						},

						"export": 
						{
							"enabled": true
						}
					} );
}

function update_trades( trades, location, sold ) {
	var found = false;

	var result = $.map( trades, function( element, index ) {
		if( element.id == location ) {
			found = true;
			return { id: location, value: element.value + sold };
		}
		return { id: element.id, value: element.value - element.value / 10 };
	} );

	if( !found ) {
		result.push( { id: location, value: sold } );
	}

	console.log( result );

	return result;
}

$( document ).ready( function() {
	var map 		= init_map( "map" );
	var trades 		= [];
	map.pathToImages 	= "app/components/ammap/dist/ammap/images/";
	var connection 		= new WebSocket( config.server );

	connection.onmessage = function( e )
	{
		var trade = $.parseJSON( e.data );
		trades =  update_trades( trades, trade.origin, trade.from_amount );
		map.dataProvider = {	map: "worldLow",
					areas: trades
		},
		map.validateData();
	};
} );