// pawn class
var Pawn = function(){
	this.x;
	this.y;
}

// setter for the coordinates
Pawn.prototype.setCoords = function( x, y ){
	this.x = x;
	this.y = y;
}

// validate pawn move
Pawn.prototype.validateMove = function( xEnd, yEnd ){


	if( typeof this.x !== 'undefined' && typeof this.y !== 'undefined' ){
		
		//check if the move is on the same axis
		if(  this.x == xEnd && (( chessBoardObj.colorToMove == 'white' && this.y - yEnd == -1) || ( chessBoardObj.colorToMove == 'black' && this.y - yEnd == 1)) ){
			if( !chessBoardObj.checkMoveOnVirtualChessBoard( 'pawn', this.x, xEnd, this.y, yEnd ) ){
				return false;
			}
			if( (chessBoardObj.colorToMove == 'white' && yEnd == 7) || (chessBoardObj.colorToMove == 'black' && yEnd == 0)) {
				if( chessBoardObj.colorToMove == 'white' ){
					chessBoardObj.countWhiteQueen = chessBoardObj.countWhiteQueen + 1;
				}else{
					chessBoardObj.countBlackQueen = chessBoardObj.countBlackQueen + 1;
				}
				chessBoardObj.replacePawn = true;
			}

			return true;
		}else if( (chessBoardObj.colorToMove == 'white' && this.y - yEnd == -2 && (this.y==1)) ||  (chessBoardObj.colorToMove == 'black' && this.y - yEnd == 2 && (this.y==6)) ){
			if( !chessBoardObj.checkMoveOnVirtualChessBoard( 'pawn', this.x, xEnd, this.y, yEnd ) ){
				return false;
			}

			return true;
		}else if( (chessBoardObj.colorToMove == 'white' && (yEnd - this.y == 1)) || (chessBoardObj.colorToMove == 'black' && (yEnd - this.y == -1)) ){
			if( !chessBoardObj.checkMoveOnVirtualChessBoard( 'pawn', this.x, xEnd, this.y, yEnd ) ){
				return false;
			}
			if( (chessBoardObj.colorToMove == 'white' && yEnd == 7) || (chessBoardObj.colorToMove == 'black' && yEnd == 0)) {
				if( chessBoardObj.colorToMove == 'white' ){
					chessBoardObj.countWhiteQueen = chessBoardObj.countWhiteQueen + 1;
				}else{
					chessBoardObj.countBlackQueen = chessBoardObj.countBlackQueen + 1;
				}
				chessBoardObj.replacePawn = true;
			}

			return true;
		}

		return false;

	}

	return false;

}