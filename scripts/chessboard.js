// chess board class
var ChessBoard = function(){ 

	// constructor
	this.colorToMove 			= 'white';
	this.countWhiteQueen 		= 1;
	this.countBlackQueen 		= 1;
	this.rockadeTookPlace		= false;
	this.whiteKingMoved			= false;
	this.whiteRookLeftMoved		= false;
	this.whiteRookRightMoved	= false;
	this.blackKingMoved			= false;
	this.blackRookLeftMoved		= false;
	this.blackRookRightMoved	= false;
	this.replacePawn			= false;
	this.enPassant 				= false;
	this.lastMoveX				= [];
	this.lastMoveY				= [];
	this.lastPieceMoved			= '';
	this.wKingCoords 			= [3, 0];
	this.bKingCoords 			= [3, 7];
	this.allCellsTillCheckPiece = [];
	this.checkMateVar 			= false;
	this.pieces 				= []; // this keeps all the pieces objects and the key is the piece ID
	this.virtualChessBoard 		= this.generateVirtualChessBoard();

	this.instantiateAllPieces(); // this instantiates all pieces objects and populates the pieces array

}

// get instance of current piece by a provided id
// id is equal to color_pieceType_numberOfPiece
ChessBoard.prototype.getPieceObjById = function( id ){
	if( typeof this.pieces[id] !== 'undefined' ) return this.pieces[id];
}

// get instance of current piece type 
ChessBoard.prototype.getPieceObj = function( type ){

	switch( type ){
    	case 'pawn':
    		return new Pawn();
    	case 'rook':
    		return new Rook();
    	case 'bishop':
    		return new Bishop();
    	case 'knight':
    		return new Knight();
    	case 'queen':
    		return new Queen();
    	case 'king':
    		return new King();
    	default:
    		return;
    }

}

// instantiate all pieces 
ChessBoard.prototype.instantiateAllPieces = function(){

	for( i = 0; i<8; i++ ){
		for( z = 0; z<8; z++ ){
			if( this.virtualChessBoard[i][z] !== "" ){

				var pieceDetails 	= this.virtualChessBoard[i][z].split('_');
				var color 			= pieceDetails[0];
				var type 			= pieceDetails[1];
				var count 			= pieceDetails[2];

				var coordinates = this.returnCoordsFromVirtualBoard(color+'_'+type+'_'+count);
				this.pieces[color+'_'+type+'_'+count]	= this.getPieceObj(type);
				var pieceObj = this.pieces[color+'_'+type+'_'+count];
				pieceObj.setCoords( coordinates[0], coordinates[1] );
			}
		}
	}

}

// keep a virtual chess board
ChessBoard.prototype.generateVirtualChessBoard = function(){



	var virtChess = new Array();

	for( y=0; y<=7; y++ ){
		virtChess.push(y);
		virtChess[y] = new Array();
		for( x=0; x<=7; x++ ){
			
			var tableTr = document.querySelectorAll('table tr')[y];
			var tableTd = tableTr.querySelectorAll('td')[x];

			if( tableTd.hasChildNodes() ){
				var color 	= tableTd.querySelector('span').getAttribute('data-color');
				var type 	= tableTd.querySelector('span').getAttribute('data-type');
				var number 	= tableTd.querySelector('span').getAttribute('data-count');
				virtChess[y].push(color+'_'+type+'_'+number);
			}else{
				virtChess[y].push('');
			}
			
		}
	}
	return virtChess;
}

ChessBoard.prototype.returnCoordsFromVirtualBoard = function( id ){

	for( i = 0; i<8; i++ ){
		for( z = 0; z<8; z++ ){
			if( this.virtualChessBoard[i][z] == id ) return [z, i];
		}
	}

}

// check if move is valid for different types of pieces
ChessBoard.prototype.checkMoveOnVirtualChessBoard = function( type, xStart, xEnd, yStart, yEnd ){

	var _this = this;
	switch(type){
		case 'rook':
			if( !_this.checkRookOnVirtualChessBoard( xStart, xEnd, yStart, yEnd ) ) return false;
		break;
		case 'bishop':
			if( !_this.checkBishopOnVirtualChessBoard( xStart, xEnd, yStart, yEnd ) ) return false;
		break;
		case 'pawn':
			if( !_this.checkPawnOnVirtualChessBoard( xStart, xEnd, yStart, yEnd ) ) return false;
		break;
		default:
			return false;
		break;
	}

	return true;
}

// validate route of rook
ChessBoard.prototype.checkRookOnVirtualChessBoard = function( xStart, xEnd, yStart, yEnd ){

	if( yStart > yEnd && xEnd == xStart ){
		for( i=yEnd+1; i<yStart;i++){
			if( typeof this.virtualChessBoard[i][xStart] == 'undefined' || this.virtualChessBoard[i][xStart] !== ''){
				return false;
			}
		}
	}else if( yStart < yEnd && xEnd == xStart ){
		for( i=(yStart+1); i<yEnd;i++){
			if( typeof this.virtualChessBoard[i][xStart] == 'undefined' || this.virtualChessBoard[i][xStart] !== ''){
				return false;
			}
		}
	}else if( xStart < xEnd && yEnd == yStart ){
		for( i=(xStart+1); i<xEnd;i++){
			if( typeof this.virtualChessBoard[yStart][i] == 'undefined' || this.virtualChessBoard[yStart][i] !== ''){
				return false;
			}
		}
	}else if( xStart > xEnd && yEnd == yStart ){
		for( i=xEnd+1; i<xStart;i++){
			if( typeof this.virtualChessBoard[yStart][i] == 'undefined' || this.virtualChessBoard[yStart][i] !== ''){
				return false;
			}
		}
	}

	return true;
}

// validate route of bishop
ChessBoard.prototype.checkBishopOnVirtualChessBoard = function( xStart, xEnd, yStart, yEnd ){

	if( xStart > xEnd && yStart  > yEnd ){
		var counter = yEnd + 1;
		for( z = xEnd+1; z < xStart; z++ ){
			if( typeof this.virtualChessBoard[counter][z] == 'undefined' || this.virtualChessBoard[counter][z] !== ''){
				return false;
			}
			counter++;
		}
	}else if( xStart > xEnd && yStart  < yEnd ){
		
		var counter = yEnd -1;
		for( z=xEnd+1; z<xStart;z++ ){
			if( typeof this.virtualChessBoard[counter][z] == 'undefined' || this.virtualChessBoard[counter][z] !== ''){
				return false;
			}
			counter--;
		}
	}else if( xStart < xEnd && yStart  < yEnd ){
		var counter = yStart + 1;
		for( z=xStart+1; z<xEnd;z++ ){
			if( typeof this.virtualChessBoard[counter][z] == 'undefined' || this.virtualChessBoard[counter][z] !== ''){
				return false;
			}
			counter++;
		}
	}else if( xStart < xEnd && yStart  > yEnd ){
		var counter = yStart - 1;
		for( z=xStart+1; z<xEnd;z++ ){
			if( typeof this.virtualChessBoard[counter][z] == 'undefined' || this.virtualChessBoard[counter][z] !== ''){
				return false;
			}
			counter--;
		}
	}

	return true;

}

// validate pawn move
ChessBoard.prototype.checkPawnOnVirtualChessBoard = function( xStart, xEnd, yStart, yEnd ){

	if( yStart > yEnd && xEnd == xStart ){
		for( i=yEnd; i<yStart;i++){
			if( typeof this.virtualChessBoard[i][xStart] == 'undefined' || this.virtualChessBoard[i][xStart] !== ''){
				return false;
			}
		}
	}else if( yStart < yEnd && xEnd == xStart ){
		for( i=(yStart+1); i<=yEnd;i++){
			if( typeof this.virtualChessBoard[i][xStart] == 'undefined' || this.virtualChessBoard[i][xStart] !== ''){
				return false;
			}
		}
	}else if( chessBoardObj.lastPieceMoved == 'pawn' 
		&& chessBoardObj.lastMoveX[0] == chessBoardObj.lastMoveX[1] 
		&& ( (chessBoardObj.lastMoveY[0] == 1 && chessBoardObj.lastMoveY[1] == 3) || (chessBoardObj.lastMoveY[0] == 6 && chessBoardObj.lastMoveY[1] == 4) ) 
		&& ( xStart == chessBoardObj.lastMoveX[1] - 1 || xStart == chessBoardObj.lastMoveX[1] + 1) 
		&& ( yStart == chessBoardObj.lastMoveY[1] ) ){	

		chessBoardObj.enPassant = true;
		
		return true;
	}else if( this.virtualChessBoard[yEnd][xEnd] == '' ){
		return false;
	}

	return true;

}

// update virtual check board from start to end of the piece
ChessBoard.prototype.updateVirtualChessBoard = function( xStart, xEnd, yStart, yEnd ){
	
	var oldVal = this.virtualChessBoard[yStart][xStart];
	if( typeof this.virtualChessBoard[yStart][xStart] !== 'undefined' ) 	this.virtualChessBoard[yStart][xStart] = '';
	if( typeof this.virtualChessBoard[yEnd][xEnd] !== 'undefined' ) 		this.virtualChessBoard[yEnd][xEnd] = oldVal;

}


// check if the king is in danger
ChessBoard.prototype.checkIfKingInDanger = function( colorRecieved, kingCoord, checkIfCheckForMe, fromCheckMateFunction, kingDisabled ){

	var virtArr 		= this.virtualChessBoard,
		myColor 		= colorRecieved,
		xDirection 		= [-1, 0, 1, -1, 1, -1, 0, 1],
		yDirection 		= [-1, -1, -1, 0, 0, 1, 1, 1],
		bishopThreats 	= [true, false, true, false, false, true, false, true],
		rookThreats 	= [false, true, false, true, true, false, true, false],
		queenThreats 	= [true, true, true, true, true, true, true, true],
		king 			= [true, true, true, true, true, true, true, true],
		kill 			= myColor == 'black' ? true : false,
		pawnThreats 	= [kill, false, kill, false, false, !kill, false, !kill];
		isCheck 		= false,
		directHitCells 	= new Array(); // we store here all the cells till the check piece

	if( !fromCheckMateFunction ) this.allCellsTillCheckPiece = new Array();

	//check first if we have threats from the knights
	if( this.checkIfKingInDangerFromKnight( colorRecieved, kingCoord, fromCheckMateFunction, kingDisabled ) ) isCheck = true;	

	for( direction = 0; direction < 8; direction++ ) {

		var XdirectionIncrement = xDirection[direction],
			YdirectionIncrement = yDirection[direction],
			x 					= kingCoord[0],	
			y 					= kingCoord[1];	

		directHitCells[direction] = new Array();

		for( step = 0; step < 8; step++ ) {

			x = x + XdirectionIncrement;
			y = y + YdirectionIncrement;

			directHitCells[direction][step] = new Array();
			directHitCells[direction][step] = [x,y];

			// check if we are in the board boundries
			if( typeof virtArr[y] !== 'undefined' && typeof virtArr[y][x] !== 'undefined' ){
				
				// check if we a piece on the board
				if( virtArr[y][x] !== '' ){

					var cellDetails = virtArr[y][x].split('_');

					// enemy detected
					if( cellDetails[0] !== myColor ){

						// get what type of piece we have detected
						switch(cellDetails[1]){
							case 'rook':
								if( rookThreats[direction] ){
									if( !fromCheckMateFunction ) this.allCellsTillCheckPiece.push(directHitCells[direction]);
									isCheck = true;
								}
							break;
							case 'pawn':
								if( step == 0 ){
									if( pawnThreats[direction] ){
										if( !fromCheckMateFunction ) this.allCellsTillCheckPiece.push(directHitCells[direction]);
										isCheck = true;
									}
								}
							break;
							case 'queen':
								
								if( queenThreats[direction] ){
									if( !fromCheckMateFunction ) this.allCellsTillCheckPiece.push(directHitCells[direction]);
									isCheck = true;
								}
							break;
							case 'bishop':
								
								if( bishopThreats[direction] ){
									if( !fromCheckMateFunction ) this.allCellsTillCheckPiece.push(directHitCells[direction]);
									isCheck = true;
								}
							break;
							case 'king':
								if( !kingDisabled ){
									if( step == 0 && king[direction] ){
										if( !fromCheckMateFunction ) this.allCellsTillCheckPiece.push(directHitCells[direction]);
										isCheck = true;
									}
								}
							break;
							default:
							break;
						}
					}

					break;
				}

			}else{
				// we are outside board break the current iteration
				break;
			}

		}
	}

	if( fromCheckMateFunction && isCheck ){
		return true;
	}else{
		// show check messages for UI
		document.querySelector('#check-message').innerHTML = '';
		if( isCheck && !checkIfCheckForMe){
			if( this.checkMate( colorRecieved ) ) return true;
			document.querySelector('#check-message').innerHTML = 'Check!';
			return true;
		}else if( isCheck && checkIfCheckForMe ){
			document.querySelector('#check-message').innerHTML = 'Illigal move. You are in check';
			return true;
		}
	}
	

	return false;
	
}

// check if check mate - this function should be called each time we are in check
ChessBoard.prototype.checkIfKingInDangerFromKnight = function( colorRecieved, kingCoord, fromCheckMateFunction, kingDisabled ){
	var xDirection 		= [-2, -1, 1, 2, 2, 1, -1, -2],
		yDirection 		= [-1, -2, -2, -1, 1, 2, 2, 1],
		myColor 		= colorRecieved,
		virtArr 		= this.virtualChessBoard,
		directHitCells  = new Array();

	for( direction = 0; direction < 8; direction++ ) {
		var x = kingCoord[0] + xDirection[direction],	
			y = kingCoord[1] + yDirection[direction];	

		directHitCells[direction] = new Array();
		directHitCells[direction] = [x,y];	

		if( typeof virtArr[y] !== 'undefined' && typeof virtArr[y][x] !== 'undefined' && virtArr[y][x] !== ''){
			var cellDetails = virtArr[y][x].split('_');
			// enemy knight detected
			if( (cellDetails[0] !== myColor && cellDetails[1] == 'knight') || (kingDisabled && cellDetails[1] == 'knight' && cellDetails[0] == myColor) ){
				if( !fromCheckMateFunction ) this.allCellsTillCheckPiece.push(directHitCells[direction]);
				return true;
			}
		}
	}

	return false;
}

// check if check mate - this function should be called each time we are in check
ChessBoard.prototype.checkMate = function( colorRecieved ){

	// first simulate if the king can move in another direction
	var xDirection 		= [-1, 0, 1, -1, 1, -1, 0, 1],
		yDirection 		= [-1, -1, -1, 0, 0, 1, 1, 1],
		virtArr 		= this.virtualChessBoard,
		kingCoords 		= colorRecieved == 'white' ? chessBoardObj.wKingCoords : chessBoardObj.bKingCoords,
		checkMate		= true,
		isCheckOnEachCell = true;

	// this for checks if the king has a cell that can move, if it finds a cell than the var isCheckOnEachCell = true
	for( kingDirection = 0; kingDirection < 8; kingDirection++ ) {
		var x = kingCoords[0] + xDirection[kingDirection],	
			y = kingCoords[1] + yDirection[kingDirection];
		
		if( typeof virtArr[y] !== 'undefined' && typeof virtArr[y][x] !== 'undefined' ){
			var cellDetails = virtArr[y][x].split('_');
			var enemyPiece  = colorRecieved == cellDetails[0] ? false : true; 
			if( virtArr[y][x] == '' || enemyPiece ){


				// king can move here, we have to check if the king can move here or not
				var isCheck = this.checkIfKingInDanger(colorRecieved, [x,y], true, true );
				if( !isCheck ) isCheckOnEachCell = false;

			}
		}		
	}	

	if( isCheckOnEachCell ){

		//check if we can move a piece to block the check
		var mainLength = this.allCellsTillCheckPiece.length;
		for( i=0; i<mainLength;i++ ){
			var innerLength = this.allCellsTillCheckPiece[i].length;
			for( z=0; z<innerLength;z++ ){

				var currX = this.allCellsTillCheckPiece[i][z][0];
				var currY = this.allCellsTillCheckPiece[i][z][1];

				// check if we can block the path
				// this will return true if we can move a piece to this cell
				var switchColor = colorRecieved == 'white' ? 'black' : 'white';
				var isCheck = this.checkIfKingInDanger( switchColor, [currX,currY], true, true, true );
				if( isCheck ){
					checkMate = false;
				}
			}
		}

	}else{
		checkMate = false;
	}

	if( checkMate ){
		document.querySelector('#check-message').innerHTML = '';
		document.querySelector('#check-message').innerHTML = 'Check Mate!';
		this.checkMateVar = true;
		return true;
	}

	return false;

}


// check if rockade is made in the proper way
ChessBoard.prototype.checkRockade = function(xCoord, xCoordEnd){

	var kingCoord;
	if( chessBoardObj.rockadeTookPlace ){
		kingCoord = this.colorToMove == 'white' ? [3,0] : [3,7];

		// check if king is in a check possition
		if( chessBoardObj.checkIfKingInDanger( this.colorToMove, kingCoord ) ){

			if( this.colorToMove == 'white' ) chessBoardObj.whiteKingMoved = false;
			else chessBoardObj.blackKingMoved = false;
				
			chessBoardObj.rockadeTookPlace = false;
			return false;
		}

		// if xCoord > xCoordEnd it means that we are trying to make the small rockade
		if( xCoord > xCoordEnd ){

			// small rockade - check left cells
			var kingCoordOne = this.colorToMove == 'white' ? [2,0] : [2,7];
			var kingCoordTwo = this.colorToMove == 'white' ? [1,0] : [1,7];	
			if( chessBoardObj.checkIfKingInDanger( this.colorToMove, kingCoordOne ) || chessBoardObj.checkIfKingInDanger( this.colorToMove, kingCoordTwo ) ){

				if( this.colorToMove == 'white' ) chessBoardObj.whiteKingMoved = false;
				else chessBoardObj.blackKingMoved = false;
					
				chessBoardObj.rockadeTookPlace = false;
				return false;
			}

		}else{

			// big rockade check right first cell
			var kingCoordOne = this.colorToMove == 'white' ? [4,0] : [4,7];
			if( chessBoardObj.checkIfKingInDanger( this.colorToMove, kingCoordOne ) || chessBoardObj.checkIfKingInDanger( this.colorToMove, kingCoordTwo ) ){

				if( this.colorToMove == 'white' ) chessBoardObj.whiteKingMoved = false;
				else chessBoardObj.blackKingMoved = false;
					
				chessBoardObj.rockadeTookPlace = false;
				return false;
			}

		}
	}
	return true;
}