// knight class
var Knight = function(){
	this.x;
	this.y;
}

// setter for the coordinates
Knight.prototype.setCoords = function( x, y ){
	this.x = x;
	this.y = y;
}

// validate knight move
Knight.prototype.validateMove = function( xEnd, yEnd ){

	if( typeof this.x !== 'undefined' && typeof this.y !== 'undefined' && xEnd !== 'undefined' && yEnd !== 'undefined' ){
		
		//check if the move is on the same axis
		if( (Math.abs(xEnd - this.x) == 1 && Math.abs(yEnd - this.y) == 2) || (Math.abs(yEnd - this.y) == 1 && Math.abs(xEnd - this.x) == 2) ){
			return true;
		}

		return false;

	}
	return false;
}