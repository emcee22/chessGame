// dragged = element dragged; yCoord, xCoord = y/x coord of the dragged element; 
var dragged,
    canDrag = true;

// console.log(Number('test'));

// init the virtual chess board
var chessBoardObj = new ChessBoard();

// events fired on the draggable target
document.addEventListener("drag", function(event) {

    // if check mate return false 
    if (chessBoardObj.checkMateVar) return false;

}, false);

document.addEventListener("dragstart", function(event) {

    // store a ref. on the dragged elem
    dragged = event.target;

    if( dragged.tagName == 'SPAN' ){

	    // make it half transparent
	    event.target.style.opacity = .5;
	    event.target.className = "dragged-elem";
    }

}, false);

document.addEventListener("dragend", function(event) {

	if( dragged.tagName == 'SPAN' ){
		// reset the transparency
	    event.target.style.opacity = "";
	    event.target.className = "";
	}

}, false);

// events fired on the drop targets
document.addEventListener("dragover", function(event) {

    // prevent default to allow drop
    event.preventDefault();

}, false);

document.addEventListener("dragenter", function(event) {
	if( dragged.tagName == 'SPAN' ){
		// highlight potential drop target when the draggable element enters it
	    // check if right color is moved
	    if (dragged.getAttribute('data-color') !== chessBoardObj.colorToMove) {
	        return false;
	    }

	    if (event.target.tagName == "TD") {
	        event.target.style.background = "purple";
	    }
	}
    

}, false);

document.addEventListener("dragleave", function(event) {
    // reset background of potential drop target when the draggable element leaves it
    if (event.target.tagName == "TD") {
        event.target.style.background = "";
    }

}, false);

document.addEventListener("drop", function(event) {

	if( dragged.tagName == 'SPAN' ){

		event.target.style.background = "";

		// prevent default action (open as link for some elements)
	    event.preventDefault();

	    // get start coordinates
	    var color 	= dragged.getAttribute('data-color'),
			type 	= dragged.getAttribute('data-type'),
			number 	= dragged.getAttribute('data-count'),
		    id = color+'_'+type+'_'+number;

	    var coordinatesDetails = chessBoardObj.returnCoordsFromVirtualBoard(id);
	    var xCoord = coordinatesDetails[0];
	    var yCoord = coordinatesDetails[1];

	    // get drop x and y coordinates
	    var dropDetails = getDropXYCoords(event);
	    var xCoordEnd = dropDetails[0];
	    var yCoordEnd = dropDetails[1];

	    // pre validation function
	    if (!preValidationMoves(event, chessBoardObj, dragged, xCoord, yCoord, xCoordEnd, yCoordEnd, id)) {
	        return false;
	    }

	    // do a chess virtual board rebuild and other updates like king coords and colors
	    if( !rebuildChessBoard( chessBoardObj, xCoord, xCoordEnd, yCoord, yCoordEnd, id ) ){
	    	return false;
	    }

	    // finaly we take care of the drop
        manageSuccessfulDrop( event, xCoord, xCoordEnd, yCoord, yCoordEnd, chessBoardObj, dragged);
	}
    
}, false);

// pre validation function
function preValidationMoves( event, chessBoardObj, dragged, xCoord, yCoord, xCoordEnd, yCoordEnd, id ) {

	var typeObj = chessBoardObj.getPieceObjById( id );

    if ( !typeObj.validateMove( xCoordEnd, yCoordEnd ) ) {
        return false;
    }

    // don't eat your own pieces
    if ( event.target.tagName == "SPAN" && chessBoardObj.colorToMove == event.target.getAttribute('data-color') ) {
        return false;
    }

    // don't eat the king
    if ( event.target.tagName == "SPAN" && event.target.getAttribute('data-type') == 'king' ) {
        return false;
    }

    // check if right color is moved
    if ( dragged.getAttribute('data-color') !== chessBoardObj.colorToMove ) {
    	return false;
    }

    // add here the check rockade function
    if ( !chessBoardObj.checkRockade(xCoord, xCoordEnd) ){
    	return false;
    }

    typeObj.setCoords( xCoordEnd, yCoordEnd );
    chessBoardObj.updateVirtualChessBoard( xCoord, xCoordEnd, yCoord, yCoordEnd );
    return true;
}

// we update virtual chess board here - update king coord (if king is moved) - also update color and message to user
function rebuildChessBoard( chessBoardObj, xCoord, xCoordEnd, yCoord, yCoordEnd, id ){

    // get king coords
    var kingObj = chessBoardObj.getPieceObjById( chessBoardObj.colorToMove +'_king_1' );
    var kingCoord = [kingObj.x, kingObj.y];

    // check if king in danger after move
    if (chessBoardObj.checkIfKingInDanger(chessBoardObj.colorToMove, kingCoord, true)) {
        chessBoardObj.updateVirtualChessBoard( xCoordEnd, xCoord, yCoordEnd, yCoord ); // reset virtual chess board move
        var piecesObject = chessBoardObj.getPieceObjById( id ); // reset piece object coordinates
        piecesObject.setCoords( xCoord, yCoord );
        return false;
    }

    // update king coords
    if (chessBoardObj.colorToMove == 'white' && dragged.getAttribute('data-type') == 'king') chessBoardObj.wKingCoords = [xCoordEnd, yCoordEnd];
    else if (chessBoardObj.colorToMove == 'black' && dragged.getAttribute('data-type') == 'king') chessBoardObj.bKingCoords = [xCoordEnd, yCoordEnd];

    chessBoardObj.colorToMove = chessBoardObj.colorToMove === 'white' ? 'black' : 'white';
    document.querySelector("#color-to-move > span").innerHTML = chessBoardObj.colorToMove.capitalize();
    return true;
}

// this function manages the drop - after all the validations are true
function manageSuccessfulDrop( event, xCoord, xCoordEnd, yCoord, yCoordEnd, chessBoardObj, dragged ){

	// move dragged elem to the selected drop target
    var checkIfSameElement = (" " + event.target.className + " ").replace(/[\n\t]/g, " ").indexOf(" dragged-elem ");
    if ( (event.target.tagName == "TD" || event.target.tagName == "SPAN") && checkIfSameElement == -1 ) {	

    	replaceElement(event); // replace element here
	    manageRockade(xCoord, xCoordEnd, yCoord); // manage rockade function
	    replacePawnOnEnd(yCoordEnd, xCoordEnd); // replace pawn function
	    enPassantPawnMove(yCoordEnd, xCoordEnd); //en passant pawn function

	    // reset variables
	    chessBoardObj.rockadeTookPlace = false;
	    chessBoardObj.enPassant = false;
	    chessBoardObj.lastMoveX = [xCoord, xCoordEnd];
	    chessBoardObj.lastMoveY = [yCoord, yCoordEnd];
	    chessBoardObj.lastPieceMoved = dragged.getAttribute('data-type');

	    // do a check to see if the other user is in check
	    var kingObj = chessBoardObj.getPieceObjById( chessBoardObj.colorToMove +'_king_1' );
    	var kingCoord = [kingObj.x, kingObj.y];

	    chessBoardObj.checkIfKingInDanger(chessBoardObj.colorToMove, kingCoord, false);

    }
	
}

// replace element in DOM on drop
function replaceElement(event) {
    if (event.target.tagName == "SPAN") {
        event.target.parentNode.style.background = "";
        event.target.parentNode.appendChild(dragged);
        event.target.parentNode.removeChild(event.target);
    } else {
        event.target.innerHTML = "";
        event.target.style.background = "";
        dragged.parentNode.removeChild(dragged);
        event.target.appendChild(dragged);
    }
}

// return array with the drop coordinates
function getDropXYCoords(event) {

    var nodeListTr = Array.prototype.slice.call(document.querySelectorAll('table tr'));
    var xCoordEnd, nodeListTd, yCoordEnd;

    // this check is made in case we make the drop on a span - in this case we have to take the parent coordinates
    if (event.target.tagName == "SPAN") {
        yCoordEnd = nodeListTr.indexOf(event.target.parentNode.parentNode);
        nodeListTd = Array.prototype.slice.call(event.target.parentNode.parentNode.querySelectorAll('td'));
        xCoordEnd = nodeListTd.indexOf(event.target.parentNode);
    } else {
        yCoordEnd = nodeListTr.indexOf(event.target.parentNode);
        nodeListTd = Array.prototype.slice.call(event.target.parentNode.querySelectorAll('td'));
        xCoordEnd = nodeListTd.indexOf(event.target);
    }

    return [xCoordEnd, yCoordEnd];

}

// replace DOM element with what we need for the visual
function manageRockade(xCoord, xCoordEnd, yCoord) {

    // if rockade move the rook to its according place and regenerate the virtual chess board
    if (chessBoardObj.rockadeTookPlace) {

        var rockadeRow = document.querySelectorAll('table tr')[yCoord];

        if (xCoord > xCoordEnd) {
            var rook = rockadeRow.querySelectorAll('td')[0].querySelector('span');
            rockadeRow.querySelectorAll('td')[0].removeChild(rockadeRow.querySelectorAll('td')[0].querySelector('span'));
            rockadeRow.querySelectorAll('td')[2].appendChild(rook);

            chessBoardObj.updateVirtualChessBoard( 0, 2, yCoord, yCoord );
        } else {
            var rook = rockadeRow.querySelectorAll('td')[7].querySelector('span');
            rockadeRow.querySelectorAll('td')[7].removeChild(rockadeRow.querySelectorAll('td')[7].querySelector('span'));
            rockadeRow.querySelectorAll('td')[4].appendChild(rook);

            chessBoardObj.updateVirtualChessBoard( 7, 4, yCoord, yCoord );
        }

    }
}

// replace panw element with queeen when we hit the end of the table
function replacePawnOnEnd(yCoordEnd, xCoordEnd) {

    // replace pawn 
    if (chessBoardObj.replacePawn) {
        var queenHtml = (chessBoardObj.colorToMove == 'white') ? '<span data-color="black" data-type="queen" data-count="'+chessBoardObj.countBlackQueen+'" draggable="true">&#9819;</span>' : '<span data-color="white" data-type="queen" data-count="'+chessBoardObj.countWhiteQueen+'" draggable="true">&#9813;</span>';
        var pawnRow = document.querySelectorAll('table tr')[yCoordEnd];
        var currHtml = pawnRow.querySelectorAll('td')[xCoordEnd].querySelector('span');
        pawnRow.querySelectorAll('td')[xCoordEnd].removeChild(currHtml);
        pawnRow.querySelectorAll('td')[xCoordEnd].innerHTML = queenHtml;

        chessBoardObj.replacePawn = false;

        var numberId	= (  chessBoardObj.colorToMove == 'white' ? chessBoardObj.countBlackQueen : chessBoardObj.countWhiteQueen );
        var createId 	= ( chessBoardObj.colorToMove == 'white' ? 'black' : 'white' );
        createId		+= '_queen_' + numberId;
        chessBoardObj.virtualChessBoard[yCoordEnd][xCoordEnd] = createId;

        // TODO - WE CAN ASK THE PLAYER TO CHOOSE FROM DIFFRENT TYPES OF PIECES - AND THEN GENERATE THE OBJECT FROM USERS REQUEST
        // generate new object for the new piece 
        chessBoardObj.pieces[createId] = new Queen();
        chessBoardObj.pieces[createId].setCoords( xCoordEnd, yCoordEnd );
    }
}

// make the en passant move and remove the pawn that we've passed
function enPassantPawnMove(yCoordEnd, xCoordEnd) {

    if ( chessBoardObj.enPassant ) {

        if (chessBoardObj.colorToMove == 'white') {
            var pawnRow = document.querySelectorAll('table tr')[yCoordEnd + 1];
            chessBoardObj.virtualChessBoard[yCoordEnd + 1][xCoordEnd] = '';
        } else {
            var pawnRow = document.querySelectorAll('table tr')[yCoordEnd - 1];
            chessBoardObj.virtualChessBoard[yCoordEnd - 1][xCoordEnd] = '';
        }

        var spanInner = pawnRow.querySelectorAll('td')[xCoordEnd].querySelector('span');
        pawnRow.querySelectorAll('td')[xCoordEnd].removeChild(spanInner);

    }

}