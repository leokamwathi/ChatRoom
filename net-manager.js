/**
 * file name: net-manager.js
 * author: Yves Ma
 * description: User call listen function. The detail refer the comment
 */

/**
 * Message Format:
 * messageid(4byte) + pblength(4byte) + seqid(4byte) + messagebody(pb struct)
 */

var net = require( "net" );

// net::server listen a port
var listen = function( serverArg, nPortArg ) {
	serverArg.listen( nPortArg, function( ) {
		console.log( "Server listen port: " + nPortArg );
	} );
}

/**
 * Export method. Create server what listened a port. You can set event handler.
 * @param {[number]} nPort        [listen port]
 * @param {[function object]} eventHandler [set event handler]
 */
module.exports.Listen = function( nPort, eventHandler ) {
	var server = net.createServer( function( socket ) { // Connection listener
		
		console.log( "A client connected!" );

		// defailt event handler
		socket.on( "end", function( ) {
			console.log( "A client disconnected!" );
		});

		// module user's event handler.
		socket.on( "data", function( data ) {
			// analye data by message struct
			// read headerinfo
			var buffReadHelper 	= new buff( 4 );
			
			// read seq id
			data.copy( buffSeqId, 0, 8, 11 );
			var reqSeqId	= buffSeqId.readInt32LE( 0 );
			
			// read message id
			data.copy( buffSeqId, 0, 0, 3 )
			var messageId 	= buffSeqId.readInt32LE( 0 );

			// read pb message length
			data.copy( buffSeqId, 0, 4, 7 );
			var messageLength	= buffSeqId.readInt32LE( 0 );

			// check legal, including message length
			if ( ( messageLength + 12 ) != data.length )
			{
				console.log( "Analyze message failed!" );
				return;
			}

			// Inform the event handler
			eventHandler( messageId, )
		});

	} );

	server.on( "error", function( e ) {
		
		if ( e.code == "EADDRINUSE" {	// Address is occupied
			console.log ( "Address inuse, retrying ... " );

			setTimeout( function( ) {
				server.close( );
				listen( server, nPort );
		} );

	} );

	listen( server, nPort );
}