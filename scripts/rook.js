// rook class
var Rook = function(){
	this.x;
	this.y;
}

// setter for the coordinates
Rook.prototype.setCoords = function( x, y ){
	this.x = x;
	this.y = y;
}

// validate rook move
Rook.prototype.validateMove = function( xEnd, yEnd ){

	if( typeof this.x !== 'undefined' && typeof this.y !== 'undefined' && xEnd !== 'undefined' && yEnd !== 'undefined' ){
		
		// check if the move is on the same axis
		if( this.x == xEnd || this.y == yEnd){

			// check if cell till location are empty, return false otherwise 
			if( !chessBoardObj.checkMoveOnVirtualChessBoard( 'rook', this.x, xEnd, this.y, yEnd ) ){
				return false;
			}

			if( this.x == 0 && this.y == 0 ){
				chessBoardObj.whiteRookLeftMoved = true;
			}else if( this.x == 7 && this.y == 0 ){
				chessBoardObj.whiteRookRightMoved = true;
			}else if( this.x == 0 && this.y == 7 ){
				chessBoardObj.blackRookLeftMoved = true;
			}else if( this.x == 7 && this.y == 7 ){
				chessBoardObj.blackRookRightMoved = true;
			}

			return true;

		}

		return false;
	}

	return false;
	

}