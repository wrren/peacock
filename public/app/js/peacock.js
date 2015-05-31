function add_feed_item( trade ) {
	while( $( '#feed' ).children().length >= config.max_feed_items ) {
		$( '#feed p:last-child' ).remove();
	}

	$( '#feed' ).prepend( '<p>' + trade.from_amount +  ' ' + trade.from_currency + ' -> ' + trade.to_amount + ' ' + trade.to_currency + '</p>' );
}

function init( div, connection ) {
	if( !Detector.webgl ) {
		Detector.addGetWebGLMessage();
	} 
	else {
		var container 	= document.getElementById( div );
		var globe 	= new DAT.Globe( container, { imgDir: "app/js/webgl-globe/" } );
		var max 	= 0;

		var position	= function( lat, lon, value ) {
			return [ 	lat + ( Math.random() > 0.5 ? -Math.random() : Math.random() ),
					lon + ( Math.random() > 0.5 ? -Math.random() : Math.random() ),
					value ];
		};

		connection.onmessage = function( e ) {
			var trade = $.parseJSON( e.data );

			var matches = $.map( locations, function( elem, i ) {
				if( elem.code == trade.origin ) {
					return i;
				}
			} );

			if( matches.length == 1 ) {
				var l = locations[matches[0]];
				l.value += trade.from_amount;
				locations[matches[0]] = l;

				if( l.value > max ) {
					max = l.value;
				}
				
				globe.addData( position( l.latitude, l.longitude, l.value / max ), { format: 'magnitude' } );
				globe.createPoints();
				globe.animate();

				add_feed_item( trade );
			}
		}

		globe.createPoints();
		globe.animate();
		
		console.log( globe );
	}
}

$( document ).ready( function() {
	init( "map", new WebSocket( config.server ) );
} );