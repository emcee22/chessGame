// bishop class
var Bishop = function(){
	this.x;
	this.y;
}

// setter for the coordinates
Bishop.prototype.setCoords = function( x, y ){
	this.x = x;
	this.y = y;
}

// validate bishop move
Bishop.prototype.validateMove = function( xEnd, yEnd ){

	var x = this.x;
	var y = this.y;
	if( typeof x !== 'undefined' && typeof y !== 'undefined' && xEnd !== 'undefined' && yEnd !== 'undefined' ){
		
		//check if the move is on the same axis
		if( Math.abs(yEnd - y) == Math.abs(xEnd - x) ){

			// check if cell till location are empty, return false otherwise 
			if( !chessBoardObj.checkMoveOnVirtualChessBoard( 'bishop', x, xEnd, y, yEnd ) ){
				return false;
			}
			return true;
		}else
			return false;
	}else{
		return false;
	}

}