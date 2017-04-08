// queen class
var Queen = function(){
	this.x;
	this.y;
}

// setter for the coordinates
Queen.prototype.setCoords = function( x, y ){
	this.x = x;
	this.y = y;
}

// validate queen move
Queen.prototype.validateMove = function( xEnd, yEnd ){

	var x = this.x;
	var y = this.y;

	if( typeof x !== 'undefined' && typeof y !== 'undefined' && xEnd !== 'undefined' && yEnd !== 'undefined' ){
		
		//check if the move is on the same axis
		if( x == xEnd || y == yEnd || (Math.abs(yEnd - y) == Math.abs(xEnd - x)) ){

			// check if cell till location are empty, return false otherwise 
			if( x == xEnd || y == yEnd ){
				if( !chessBoardObj.checkMoveOnVirtualChessBoard( 'rook', x, xEnd, y, yEnd ) ){
					return false;
				}
			}else if( !chessBoardObj.checkMoveOnVirtualChessBoard( 'bishop', x, xEnd, y, yEnd ) ){
				return false;
			}
			return true;
		}

		return false;
	}

	return false;
	
}