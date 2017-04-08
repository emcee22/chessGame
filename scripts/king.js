// king class
var King = function(){
	this.x;
	this.y;
}

// setter for the coordinates
King.prototype.setCoords = function( x, y ){
	this.x = x;
	this.y = y;
}

// validate king move
King.prototype.validateMove = function(xEnd, yEnd){
	var x = this.x;
	var y = this.y;

	if( typeof x !== 'undefined' && typeof y !== 'undefined' && xEnd !== 'undefined' && yEnd !== 'undefined' ){

		var kingMoved 			= ( chessBoardObj.colorToMove == 'white' ? chessBoardObj.whiteKingMoved : chessBoardObj.blackKingMoved ),
			leftRookMoved 		= ( chessBoardObj.colorToMove == 'white' ? chessBoardObj.whiteRookLeftMoved : chessBoardObj.blackRookLeftMoved ),
			rightRookMoved 		= ( chessBoardObj.colorToMove == 'white' ? chessBoardObj.whiteRookRightMoved : chessBoardObj.blackRookRightMoved ),
			freeSpaceBetween 	= true,
			tr  				= document.querySelectorAll('table tr')[y];

		//check if the move is on the same axis
		if( Math.abs(yEnd - y) <= 1 &&  Math.abs(xEnd - x) <= 1 ){
			if( chessBoardObj.colorToMove == 'white' ){
				chessBoardObj.whiteKingMoved = true;
			}else{
				chessBoardObj.blackKingMoved = true;
			}
			return true;
		}else if( (x - xEnd == 2 || x - xEnd == -2) && yEnd == y && !kingMoved && !rightRookMoved){

			
			if(x - xEnd == 2){
				// small rockade here
				for( i = xEnd; i < x; i++ ){
					if( tr.querySelectorAll('td')[i].hasChildNodes() ) freeSpaceBetween = false;
				}
			}else{
				// big rockade here
				for( i = x+1; i < (xEnd+2); i++ ){
					if( tr.querySelectorAll('td')[i].hasChildNodes() ) freeSpaceBetween = false;
				}
			}	
			
			if( freeSpaceBetween ){
				if( chessBoardObj.colorToMove == 'white' ){
					chessBoardObj.whiteKingMoved = true;
				}else{
					chessBoardObj.blackKingMoved = true;
				}
				
				// set this variable to true so that we can move the rook as well
				chessBoardObj.rockadeTookPlace = true;
				return true; 
			}
			return false
		}

		return false;
		
	}

	return false;
	

}