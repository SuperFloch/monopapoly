/**
*	Couleurs
*/
const COLOR_PINK = "#e670e2";
const COLOR_CYAN = "#20d0d6";
const COLOR_PURPLE = "#7812b8";
const COLOR_ORANGE = "#ff9914";
const COLOR_RED = "#ff2c14";
const COLOR_YELLOW = "#fff714";
const COLOR_GREEN = "#048f09";
const COLOR_BLUE = "#03128a";
const COLOR_BLACK = "#000000";
const COLOR_WHITE = "#FFFFFF";

const COLOR_GREY = "#888888";

const PLAYER_COLORS = [COLOR_BLUE, COLOR_RED, COLOR_GREEN, COLOR_YELLOW, COLOR_PINK, COLOR_ORANGE, COLOR_PURPLE, COLOR_CYAN];


const canvas = document.getElementById("canvas");
var ctx = canvas.getContext('2d');

/**
*	Proportions en fonction de l'écran en pourcentages
*/

// Plateau
const BOARD_MARGIN_LEFT = 20;
const BOARD_MARGIN_RIGHT = 30;

const BOARD_MAX_WIDTH = 50;
const BOARD_MAX_HEIGHT = 80;
const BOARD_MARGIN_TOP = 5;
const BOARD_MARGIN_BOT = 5;

// Scores
const SCORES_MARGIN_LEFT = 2;
const SCORES_MARGIN_TOP = 10;
const SCORES_FONT_SIZE = 8;
const SCORES_MARGIN_BETWEEN = 2;

// Dés
const DICE_SIZE = 5;
const DICE_MARGIN_TOP = 90;
const DICE_MARGIN_LEFT = 40;

const DICE_BUTTON_MARGIN_TOP = 90;
const DICE_BUTTON_MARGIN_LEFT = 20;
const DICE_BUTTON_WIDTH = 8;
const DICE_BUTTON_HEIGHT = 5;
const DICE_BUTTON_FONT_SIZE = 2.5;

// Carte de rue
const CARD_MARGIN_LEFT = 75;
const CARD_MARGIN_TOP = 5;
const CARD_MAX_HEIGHT = 80;
const CARD_MAX_WIDTH = 30;
const CARD_RECT_RATIO = 1.7;

// Boutons d'action Overlay
const ACTION_BUTTON_MARGIN_LEFT = 20;
const ACTION_BUTTON_MARGIN_RIGHT = 20;
const ACTION_BUTTON_MARGIN_TOP = 80;
const ACTION_BUTTON_FONT_SIZE = 2;

// Illustration Overlay
const ILLUSTRATION_MARGIN_LEFT = 25;
const ILLUSTRATION_MARGIN_TOP = 25;
const ILLUSTRATION_MAX_WIDTH = 50;
const ILLUSTRATION_MAX_HEIGHT = 50;

const ILLU_CARD = "ILLU_CARD";
const ILLU_MEET = "ILLU_MEET";
const ILLU_VISIT = "ILLU_VISIT";
const ILLU_PAY_1 = "ILLU_PAY_1";
const ILLU_PAY_2 = "ILLU_PAY_2";
const ILLU_PAY_5 = "ILLU_PAY_5";
const ILLU_DUO = "ILLU_DUO";
const ILLU_MANY = "ILLU_MANY";
const ILLU_END = "ILLU_END";

// Texte de l'Overlay
const TEXT_OVERLAY_MARGIN_LEFT = 10;
const TEXT_OVERLAY_MARGIN_TOP = 10;
const TEXT_OVERLAY_WIDTH = 65;
const TEXT_OVERLAY_HEIGHT = 20;
const TEXT_OVERLAY_FONT_SIZE = 9;

/**
*	Proportions en fonction de la taille de la carte
*/
const CARD_PADDING_VERTICAL = 1;
const CARD_PADDING_HORIZONTAL = 2;
const CARD_HEADER_HEIGHT = 15;
const CARD_HEADER_FONT_SIZE = 6.5;
const CARD_CONTENT_FONT_SIZE = 4;

const CARD_IMG_HEIGHT = 30;

/**
*	Proportions en fonction de la taille du plateau en pourcentages
*/
const CELL_HEIGHT = 14;
const CELL_WIDTH = 8;
const CELL_HEADER_HEIGHT = 2;
const PION_RADIUS = 2;


/**
*	Images
*/
const IMG_PIOCHE = document.getElementById("pioche");
const IMG_DICE = document.getElementById("dice");
const IMG_GO = document.getElementById("go");
const IMG_GARE = document.getElementById("gare");
const IMG_GO_TO_JAIL = document.getElementById("goToJail");
const IMG_JAIL = document.getElementById("jail");
const IMG_FREE_PARK = document.getElementById("freePark");
const IMG_CIE = document.getElementById("cie");
const IMG_TAXE = document.getElementById("taxe");

// Pour l'animation des GIFS
var animateGif = false;
var currentFrameIndex = 0;


function draw(game){
	switch(game.currentScreen){
		case SCREEN_GAME:
			animateGif = false;
			drawBackground();
			drawBoard(game);
			drawScores(game);
			drawDiceButton(game);
			drawDices(game);
			if(game.playerActionRequired){
				drawOverlay();
				drawCard(game, game.players[game.currentPlayerIndex].currentCaseIndex);
				drawActions(game);
				drawIllustration(game);
				drawTextOverlay(game);
			}else if(game.selectedCard != null){
				drawCard(game, game.selectedCard);
			}
			break;
		case SCREEN_MENU:
			drawBackground();
			drawOverlay();
			break;
		case SCREEN_END:
			break;
		case SCREEN_IN_GAME_MENU:
			break;
	}
}

/**
*	Dessine l'arrière plan
**/
function drawBackground(){
	ctx.fillStyle = COLOR_GREY;
	ctx.fillRect(0, 0, canvas.width, canvas.height);
}

/**
*	Dessine le plateau et les pions
**/
function drawBoard(game){
	var boardWidth = getBoardWidth();
	
	var board_X = getHorizontalProportion(BOARD_MARGIN_LEFT);
	var board_Y = getVerticalProportion(BOARD_MARGIN_TOP);
	
	var cellWidth = getBoardProportion(CELL_WIDTH);
	var cellHeight = getBoardProportion(CELL_HEIGHT);
	var cellHeaderHeight = getBoardProportion(CELL_HEADER_HEIGHT);
	var pionRadius = getBoardProportion(PION_RADIUS);
	
	var boardSideCellCount = game.board.cases.length / 4;
	
	ctx.fillStyle = "#6ee696";
	ctx.fillRect(board_X, board_Y, boardWidth, boardWidth);
	
	// Each Cell
	ctx.strokeStyle = "black";
	var cellIndex = 0;
	
	// TOP
	for(var i =0; i< boardSideCellCount ;i++){
		// Joueurs
		var playersHere = game.players.filter(j => j.currentCaseIndex == i + cellIndex && !j.lost);
		
		if(i%10 == 0){
			ctx.strokeRect(board_X, board_Y, cellHeight, cellHeight);
			drawImage(ctx,IMG_GO,board_X + cellHeight * 0.15,board_Y+cellHeight*0.15,cellHeight*0.7,cellHeight*0.7,45);
			if(playersHere){
				for(var j = 0; j<playersHere.length;j++){
					drawCircle(ctx, board_X + cellHeight/2, board_Y + cellHeaderHeight + ((j +1) * pionRadius / playersHere.length * 3),pionRadius / playersHere.length,PLAYER_COLORS[playersHere[j].index],COLOR_BLACK);
				}
			}
		}else{
			ctx.strokeRect(board_X + cellHeight + cellWidth * (i-1), board_Y, cellWidth, cellHeight);
			if(game.board.cases[i + cellIndex].type == CASE_TYPE_PROP && game.board.cases[i + cellIndex].color){
				ctx.fillStyle = game.board.cases[i + cellIndex].color;
				ctx.fillRect(board_X + cellHeight + cellWidth * (i-1), board_Y + (cellHeight - cellHeaderHeight), cellWidth, cellHeaderHeight);
				ctx.strokeRect(board_X + cellHeight + cellWidth * (i-1), board_Y + (cellHeight - cellHeaderHeight), cellWidth, cellHeaderHeight);
			}
			
			// Pioche
			if(game.board.cases[i + cellIndex].type == CASE_TYPE_PIOCHE){
				drawImage(ctx,IMG_PIOCHE,board_X + cellHeight + cellWidth * (i-1), board_Y, cellWidth, cellHeight,180);
			}
			// Gare
			if(game.board.cases[i + cellIndex].type == CASE_TYPE_GARE){
				drawImage(ctx,IMG_GARE,board_X + cellHeight + cellWidth * (i-1), board_Y+cellHeight/4, cellWidth, cellHeight/2,180);
			}
			//Prop
			if(game.board.cases[i + cellIndex].type == CASE_TYPE_PROP){
				drawImage(ctx,document.getElementById(game.board.cases[i + cellIndex].number+"_"+ILLU_CARD),board_X + cellHeight + cellWidth * (i-1), board_Y+cellHeight/4, cellWidth, cellHeight/2,180);
			}
			// Cie
			if(game.board.cases[i + cellIndex].type == CASE_TYPE_CIE){
				drawImage(ctx,IMG_CIE,board_X + cellHeight + cellWidth * (i-1), board_Y+cellHeight/4, cellWidth, cellHeight/2,180);
			}
			// Taxe
			if(game.board.cases[i + cellIndex].type == CASE_TYPE_TAXE){
				drawImage(ctx,IMG_TAXE,board_X + cellHeight + cellWidth * (i-1), board_Y+cellHeight/4, cellWidth, cellHeight/2,180);
			}
			
			if(playersHere){
				for(var j = 0; j<playersHere.length;j++){
					drawCircle(ctx, board_X + cellHeight - cellWidth/2 + cellWidth * i, board_Y + cellHeaderHeight + ((j +1) * pionRadius / playersHere.length * 3),pionRadius / playersHere.length,PLAYER_COLORS[playersHere[j].index],COLOR_BLACK);
				}
			}
			// A qui ca appartient
			if(game.board.cases[i + cellIndex].currentOwner != null){
				ctx.fillStyle = PLAYER_COLORS[game.board.cases[i + cellIndex].currentOwner];
				ctx.fillRect(board_X + cellHeight + cellWidth * (i-1), board_Y + cellHeight, cellWidth, cellHeaderHeight/2);
			}
		}
	}
	cellIndex += boardSideCellCount;
	
	// RIGHT
	for(var i =0; i< boardSideCellCount ;i++){
		// Joueurs
		var playersHere = game.players.filter(j => j.currentCaseIndex == i + cellIndex && !j.lost);
		
		if(i%10 == 0){
			ctx.strokeRect(board_X + boardWidth - cellHeight, board_Y, cellHeight, cellHeight);
			drawImage(ctx,IMG_JAIL,board_X + boardWidth - cellHeight*1.15,board_Y+cellHeight*0.15,cellHeight,cellHeight,45);
			if(playersHere){
				for(var j = 0; j<playersHere.length;j++){
					drawCircle(ctx, board_X + boardWidth - cellHeight + cellHeight/2, board_Y + cellHeaderHeight + ((j +1) * pionRadius / playersHere.length * 3),pionRadius / playersHere.length,PLAYER_COLORS[playersHere[j].index],COLOR_BLACK);
				}
			}
		}else{
			ctx.strokeRect(board_X + boardWidth - cellHeight, board_Y + cellHeight + cellWidth * (i-1) , cellHeight, cellWidth);
			if(game.board.cases[i + cellIndex].type == CASE_TYPE_PROP && game.board.cases[i + cellIndex].color){
				ctx.fillStyle = game.board.cases[i + cellIndex].color;
				ctx.fillRect(board_X + boardWidth - cellHeight, board_Y + cellHeight + cellWidth * (i-1), cellHeaderHeight, cellWidth);
				ctx.strokeRect(board_X + boardWidth - cellHeight, board_Y + cellHeight + cellWidth * (i-1), cellHeaderHeight, cellWidth);
			}
			
			// Pioche
			if(game.board.cases[i + cellIndex].type == CASE_TYPE_PIOCHE){
				drawImage(ctx,IMG_PIOCHE,board_X + boardWidth - cellHeight + (cellHeight - cellWidth)/2, board_Y + cellHeight + cellWidth * (i-1) - (cellHeight - cellWidth)/2, cellWidth, cellHeight,270);
			}
			// Prop
			if(game.board.cases[i + cellIndex].type == CASE_TYPE_PROP){
				drawImage(ctx,document.getElementById(game.board.cases[i + cellIndex].number+"_"+ILLU_CARD),board_X + boardWidth - cellHeight + (cellHeight - cellWidth)/2, board_Y + cellHeight + cellWidth * (i-1) - (cellHeight - cellWidth)/2, cellWidth, cellHeight,270);
			}
			// Gare
			if(game.board.cases[i + cellIndex].type == CASE_TYPE_GARE){
				drawImage(ctx,IMG_GARE,board_X + boardWidth - cellHeight + (cellHeight - cellWidth)/2, board_Y + cellHeight + cellWidth * (i-1) - (cellHeight - cellWidth)/2, cellWidth, cellHeight,270);
			}
			// Cie
			if(game.board.cases[i + cellIndex].type == CASE_TYPE_CIE){
				drawImage(ctx,IMG_CIE,board_X + boardWidth - cellHeight + (cellHeight - cellWidth)/2, board_Y + cellHeight + cellWidth * (i-1) - (cellHeight - cellWidth)/2, cellWidth, cellHeight,270);
			}
			// Taxe
			if(game.board.cases[i + cellIndex].type == CASE_TYPE_TAXE){
				drawImage(ctx,IMG_TAXE,board_X + boardWidth - cellHeight + (cellHeight - cellWidth)/2, board_Y + cellHeight + cellWidth * (i-1) - (cellHeight - cellWidth)/2, cellWidth, cellHeight,270);
			}
			
			if(playersHere){
				for(var j = 0; j<playersHere.length;j++){
					drawCircle(ctx, board_X + boardWidth - cellHeaderHeight - ((j +1) * pionRadius / playersHere.length * 3), board_Y + cellHeight - cellWidth/2 + cellWidth * i,pionRadius / playersHere.length,PLAYER_COLORS[playersHere[j].index],COLOR_BLACK);
				}
			}
			// A qui ca appartient
			if(game.board.cases[i + cellIndex].currentOwner != null){
				ctx.fillStyle = PLAYER_COLORS[game.board.cases[i + cellIndex].currentOwner];
				ctx.fillRect(board_X + boardWidth - cellHeight - cellHeaderHeight/2, board_Y + cellHeight + cellWidth * (i-1), cellHeaderHeight/2, cellWidth);
			}
		}
	}
	cellIndex += boardSideCellCount;
	
	// BOTTOM
	for(var i =0; i< boardSideCellCount ;i++){
		// Joueurs
		var playersHere = game.players.filter(j => j.currentCaseIndex == i + cellIndex && !j.lost);
		
		if(i%10 == 0){
			ctx.strokeRect(board_X + boardWidth - cellHeight, board_Y + boardWidth - cellHeight, cellHeight, cellHeight);
			drawImage(ctx,IMG_FREE_PARK,board_X + boardWidth - cellHeight +cellHeight*0.15, board_Y + boardWidth - cellHeight + cellHeight*0.15, cellHeight*0.7, cellHeight*0.7,315);
			if(playersHere){
				for(var j = 0; j<playersHere.length;j++){
					drawCircle(ctx, board_X + boardWidth - cellHeight + cellHeight/2, board_Y + boardWidth - cellHeight + cellHeaderHeight + ((j +1) * pionRadius / playersHere.length * 3),pionRadius / playersHere.length,PLAYER_COLORS[playersHere[j].index],COLOR_BLACK);
				}
			}
		}else{
			ctx.strokeRect(board_X + boardWidth - cellHeight - cellWidth * i, board_Y + boardWidth - cellHeight, cellWidth, cellHeight);
			if(game.board.cases[i + cellIndex].type == CASE_TYPE_PROP && game.board.cases[i + cellIndex].color){
				ctx.fillStyle = game.board.cases[i + cellIndex].color;
				ctx.fillRect(board_X + boardWidth - cellHeight - cellWidth * i, board_Y + boardWidth - cellHeight, cellWidth, cellHeaderHeight);
				ctx.strokeRect(board_X + boardWidth - cellHeight - cellWidth * i, board_Y + boardWidth - cellHeight, cellWidth, cellHeaderHeight);
			}
			
			// Pioche
			if(game.board.cases[i + cellIndex].type == CASE_TYPE_PIOCHE){
				drawImage(ctx,IMG_PIOCHE,board_X + boardWidth - cellHeight - cellWidth * i, board_Y + boardWidth - cellHeight, cellWidth, cellHeight,0);
			}
			// Pioche
			if(game.board.cases[i + cellIndex].type == CASE_TYPE_PROP){
				drawImage(ctx,document.getElementById(game.board.cases[i + cellIndex].number+"_"+ILLU_CARD),board_X + boardWidth - cellHeight - cellWidth * i, board_Y + boardWidth - cellHeight, cellWidth, cellHeight,0);
			}
			// Gare
			if(game.board.cases[i + cellIndex].type == CASE_TYPE_GARE){
				drawImage(ctx,IMG_GARE,board_X + boardWidth - cellHeight - cellWidth * i, board_Y + boardWidth - cellHeight, cellWidth, cellHeight,0);
			}
			// Cie
			if(game.board.cases[i + cellIndex].type == CASE_TYPE_CIE){
				drawImage(ctx,IMG_CIE,board_X + boardWidth - cellHeight - cellWidth * i, board_Y + boardWidth - cellHeight, cellWidth, cellHeight,0);
			}
			// Taxe
			if(game.board.cases[i + cellIndex].type == CASE_TYPE_TAXE){
				drawImage(ctx,IMG_TAXE,board_X + boardWidth - cellHeight - cellWidth * i, board_Y + boardWidth - cellHeight, cellWidth, cellHeight,0);
			}
			
			if(playersHere){
				for(var j = 0; j<playersHere.length;j++){
					drawCircle(ctx, board_X + boardWidth - cellHeight - cellWidth/2 - cellWidth * (i-1), board_Y + boardWidth - cellHeight + cellHeaderHeight + ((j +1) * pionRadius / playersHere.length * 3),pionRadius / playersHere.length,PLAYER_COLORS[playersHere[j].index],COLOR_BLACK);
				}
			}
			// A qui ca appartient
			if(game.board.cases[i + cellIndex].currentOwner != null){
				ctx.fillStyle = PLAYER_COLORS[game.board.cases[i + cellIndex].currentOwner];
				ctx.fillRect(board_X + boardWidth - cellHeight - cellWidth * i, board_Y + boardWidth - cellHeight - cellHeaderHeight/2, cellWidth, cellHeaderHeight/2);
			}
		}
	}
	cellIndex += boardSideCellCount;
	
	// LEFT
	for(var i =0; i< boardSideCellCount ;i++){
		// Joueurs
		var playersHere = game.players.filter(j => j.currentCaseIndex == i + cellIndex && !j.lost);
		
		if(i%10 == 0){
			ctx.strokeRect(board_X, board_Y + boardWidth - cellHeight, cellHeight, cellHeight);
			drawImage(ctx,IMG_GO_TO_JAIL,board_X+cellHeight*0.15, board_Y + boardWidth - cellHeight*0.85, cellHeight*0.7, cellHeight*0.7,45);
			if(playersHere){
				for(var j = 0; j<playersHere.length;j++){
					drawCircle(ctx, board_X + cellHeight/2, board_Y + boardWidth - cellHeight + cellHeaderHeight + ((j +1) * pionRadius / playersHere.length * 3),pionRadius / playersHere.length,PLAYER_COLORS[playersHere[j].index],COLOR_BLACK);
				}
			}
		}else{
			ctx.strokeRect(board_X, board_Y + boardWidth - cellHeight - cellWidth * i, cellHeight, cellWidth);
			if(game.board.cases[i + cellIndex].type == CASE_TYPE_PROP && game.board.cases[i + cellIndex].color){
				ctx.fillStyle = game.board.cases[i + cellIndex].color;
				ctx.fillRect(board_X + (cellHeight - cellHeaderHeight), board_Y + boardWidth - cellHeight - cellWidth * i, cellHeaderHeight, cellWidth);
				ctx.strokeRect(board_X + (cellHeight - cellHeaderHeight), board_Y + boardWidth - cellHeight - cellWidth * i, cellHeaderHeight, cellWidth);
			}
			
			// Pioche
			if(game.board.cases[i + cellIndex].type == CASE_TYPE_PIOCHE){
				drawImage(ctx,IMG_PIOCHE,board_X + (cellHeight - cellWidth)/2, board_Y + boardWidth - cellHeight - cellWidth * i - (cellHeight - cellWidth)/2, cellWidth, cellHeight,90);
			}
			// Prop
			if(game.board.cases[i + cellIndex].type == CASE_TYPE_PROP){
				drawImage(ctx,document.getElementById(game.board.cases[i + cellIndex].number+"_"+ILLU_CARD),board_X + (cellHeight - cellWidth)/2, board_Y + boardWidth - cellHeight - cellWidth * i - (cellHeight - cellWidth)/2, cellWidth, cellHeight,90);
			}
			// Gare
			if(game.board.cases[i + cellIndex].type == CASE_TYPE_GARE){
				drawImage(ctx,IMG_GARE,board_X + (cellHeight - cellWidth)/2, board_Y + boardWidth - cellHeight - cellWidth * i - (cellHeight - cellWidth)/2, cellWidth, cellHeight,90);
			}
			// Taxe
			if(game.board.cases[i + cellIndex].type == CASE_TYPE_TAXE){
				drawImage(ctx,IMG_TAXE,board_X + (cellHeight - cellWidth)/2, board_Y + boardWidth - cellHeight - cellWidth * i - (cellHeight - cellWidth)/2, cellWidth, cellHeight,90);
			}
			// Cie
			if(game.board.cases[i + cellIndex].type == CASE_TYPE_CIE){
				drawImage(ctx,IMG_CIE,board_X + (cellHeight - cellWidth)/2, board_Y + boardWidth - cellHeight - cellWidth * i - (cellHeight - cellWidth)/2, cellWidth, cellHeight,90);
			}
			
			if(playersHere){
				for(var j = 0; j<playersHere.length;j++){
					drawCircle(ctx, board_X + cellHeight - cellHeaderHeight - ((j +1) * pionRadius / playersHere.length * 3), board_Y + boardWidth - cellHeight - cellWidth/2 - cellWidth * (i-1),pionRadius / playersHere.length,PLAYER_COLORS[playersHere[j].index],COLOR_BLACK);
				}
			}
			// A qui ca appartient
			if(game.board.cases[i + cellIndex].currentOwner != null){
				ctx.fillStyle = PLAYER_COLORS[game.board.cases[i + cellIndex].currentOwner];
				ctx.fillRect(board_X + cellHeight , board_Y + boardWidth - cellHeight - cellWidth * i, cellHeaderHeight /2, cellWidth);
			}
		}
	}
}

/**
*	Dessine les scores des joueurs
**/
function drawScores(game){
	var scoresX = getHorizontalProportion(SCORES_MARGIN_LEFT);
	var scoresY = getVerticalProportion(SCORES_MARGIN_TOP);
	var scoresSpace = getVerticalProportion(SCORES_MARGIN_BETWEEN);
	var textHeight = getVerticalProportion(SCORES_FONT_SIZE);
	
	for(var i=0; i < game.players.length;i++){
		var theText = game.players[i].money;
		ctx.fillStyle = PLAYER_COLORS[i];
		ctx.font = SCORES_FONT_SIZE+'vh serif';
		ctx.fillText(theText, scoresX, scoresY + (scoresSpace + textHeight) * i);
		if(game.currentPlayerIndex == i){
			ctx.fillStyle = COLOR_WHITE;
			ctx.fillText("<-", scoresX + scoresSpace + ctx.measureText(theText).width, scoresY + (scoresSpace + textHeight) * i);
		}
		if(game.players[i].inJail){
			ctx.fillStyle = COLOR_BLACK;
			ctx.fillText("Prison", scoresX + scoresSpace * 2, scoresY + (scoresSpace + textHeight) * i);
		}
	}
}

/**
*	Dessine le bouton pour lancer les dés
**/
function drawDiceButton(game){
	var buttonX = getHorizontalProportion(DICE_BUTTON_MARGIN_LEFT);
	var buttonY = getVerticalProportion(DICE_BUTTON_MARGIN_TOP);
	var buttonWidth = getHorizontalProportion(DICE_BUTTON_WIDTH);
	var buttonHeight = getVerticalProportion(DICE_BUTTON_HEIGHT);
	ctx.fillStyle = COLOR_CYAN;
	ctx.fillRect(buttonX,buttonY, buttonWidth, buttonHeight);
	ctx.font = DICE_BUTTON_FONT_SIZE+'vh serif';
	if(game.dicesLaunched){
		if(game.players[game.currentPlayerIndex].money < 0){
			drawTextInRect(ctx, getText("LOSE"), buttonX, buttonY, buttonWidth, buttonHeight);
		}else{
			drawTextInRect(ctx, getText("EndTurn"), buttonX, buttonY, buttonWidth, buttonHeight);
		}
	}else{
		drawTextInRect(ctx, getText("RollDices"), buttonX, buttonY, buttonWidth, buttonHeight);
	}
}

/**
*	Dessine les dés
**/
function drawDices(game){
	var diceX = getHorizontalProportion(DICE_MARGIN_LEFT);
	var diceY = getVerticalProportion(DICE_MARGIN_TOP);
	var diceSize = getVerticalProportion(DICE_SIZE);
	
	var imgWidth = IMG_DICE.width;
	var imgHeight = IMG_DICE.height;
	var singleImgSize = imgHeight /2;
	
	for(var i = 0; i<game.dices.length;i++){
		var imgX = (game.dices[i] - 1) % 3 ;
		var imgY = Math.floor((game.dices[i] -1) / 3);
		ctx.drawImage(IMG_DICE, imgX * singleImgSize, imgY * singleImgSize, singleImgSize, singleImgSize, diceX + (i * diceSize * 2), diceY, diceSize, diceSize);
	}
}

/**
*	Dessine une carte du jeu
**/
function drawCard(game, cardIndex){

	var cardDimensions = getCardDimensions();
	var verticalPadding = getCardVerticalProportion(CARD_PADDING_VERTICAL);
	var horizontalPadding = getCardHorizontalProportion(CARD_PADDING_HORIZONTAL);
	var cardX = getHorizontalProportion(CARD_MARGIN_LEFT);
	var cardY = getVerticalProportion(CARD_MARGIN_TOP);
	var theCard = game.board.cases[cardIndex];
	
	ctx.fillStyle = COLOR_WHITE;
	ctx.fillRect(cardX, cardY, cardDimensions.width, cardDimensions.height);
	
	// Content
	
	// Header
	var headerX = cardX + horizontalPadding;
	var headerY = cardY + verticalPadding;
	var headerHeight = getCardVerticalProportion(CARD_HEADER_HEIGHT);
	var headerWidth = cardDimensions.width - horizontalPadding * 2;
	
	if(theCard.color){
		ctx.fillStyle = theCard.color;
		ctx.fillRect(headerX,headerY, cardDimensions.width - horizontalPadding * 2, headerHeight);
	}
	var headerFontSize = getProportionalFontSize(CARD_HEADER_FONT_SIZE, cardDimensions.height);
	var contentFontSize = getProportionalFontSize(CARD_CONTENT_FONT_SIZE, cardDimensions.height);
	ctx.fillStyle = COLOR_BLACK;
	ctx.font = headerFontSize+'vh serif';
	var titleProps = ctx.measureText(theCard.name);
	ctx.fillText(theCard.name, headerX + Math.floor(headerWidth/2) - Math.floor(titleProps.width/2), headerY + Math.floor(headerHeight/2));
	
	// body
	var imgY = cardY + verticalPadding * 2 + headerHeight;
	var imgX = cardX + horizontalPadding;
	var imgHeight = getCardVerticalProportion(CARD_IMG_HEIGHT);
	
	var cardImg = document.getElementById("streetImg");
	var textY = imgY + imgHeight + verticalPadding * 4;
	
	if(theCard.type == CASE_TYPE_PROP){
		cardImg = document.getElementById(theCard.number+"_"+ILLU_CARD);
		drawImageAtMaxSize(ctx, cardImg, imgX, imgY, headerWidth, imgHeight);
		
		drawLine(ctx, imgX,imgY + imgHeight + verticalPadding, imgX + headerWidth, imgY + imgHeight + verticalPadding);
		
		
		ctx.font = contentFontSize +'vh serif';
		drawTextInRect(ctx, "Tarif location : "+theCard.housePrice + DEVISE,imgX,textY,headerWidth, getVerticalProportion(CARD_CONTENT_FONT_SIZE));
		
		drawLine(ctx, imgX,textY + verticalPadding * 4, imgX + headerWidth, textY + verticalPadding * 4);
		
		drawTextInRect(ctx, "Chaque jour de location", imgX, textY + verticalPadding * 10, headerWidth, getVerticalProportion(CARD_CONTENT_FONT_SIZE));
		drawTextInRect(ctx, "peut être revendu à moitié prix", imgX, textY + verticalPadding * 14, headerWidth, getVerticalProportion(CARD_CONTENT_FONT_SIZE));
		
		drawLine(ctx, imgX,textY + verticalPadding * 20, imgX + headerWidth, textY + verticalPadding * 20);
		
		drawTextInRect(ctx, "Tarif visite : "+theCard.price + DEVISE,imgX,textY + verticalPadding * 24,headerWidth, getVerticalProportion(CARD_CONTENT_FONT_SIZE));
		drawTextInRect(ctx, "Multipliez ce montant par", imgX, textY + verticalPadding * 28, headerWidth, getVerticalProportion(CARD_CONTENT_FONT_SIZE));
		drawTextInRect(ctx, "le nombre de propriétés de cette", imgX, textY + verticalPadding * 32, headerWidth, getVerticalProportion(CARD_CONTENT_FONT_SIZE));
		drawTextInRect(ctx, "couleur en votre possession", imgX, textY + verticalPadding * 36, headerWidth, getVerticalProportion(CARD_CONTENT_FONT_SIZE));
		
		if(theCard.currentOwner != null){
			drawLine(ctx, imgX,textY + verticalPadding * 40, imgX + headerWidth, textY + verticalPadding * 40);
			drawTextInRect(ctx, getText("TurnsLeft",[theCard.currentOwnerTurnsLeft]), imgX, textY + verticalPadding * 44, headerWidth, getVerticalProportion(CARD_CONTENT_FONT_SIZE),PLAYER_COLORS[theCard.currentOwner]);
		}
		
	}else if(theCard.type == CASE_TYPE_PIOCHE){
		var thePioche = game.board.cards[game.board.cardIndex];
		cardImg = document.getElementById("piocheBg");
		ctx.fillStyle = COLOR_RED;
		ctx.fillRect(cardX + horizontalPadding, cardY + verticalPadding, cardDimensions.width - horizontalPadding * 2, cardDimensions.height - verticalPadding * 2);
		drawImageAtMaxSize(ctx, cardImg, cardX, cardY, cardDimensions.width, cardDimensions.height);
		//drawTextInRect(ctx, getText(thePioche.name, [thePioche.value]), imgX, cardDimensions.height/2, headerWidth, getVerticalProportion(CARD_CONTENT_FONT_SIZE));
	}else if(theCard.type == CASE_TYPE_FIRST){
		cardImg = IMG_GO;
		drawImageAtMaxSize(ctx, cardImg, imgX, imgY, headerWidth, imgHeight);
	}else if(theCard.type == CASE_TYPE_FREE_PARK){
		cardImg = IMG_FREE_PARK;
		drawImageAtMaxSize(ctx, cardImg, imgX, imgY, headerWidth, imgHeight);
	}else if(theCard.type == CASE_TYPE_GO_TO_JAIL){
		cardImg = IMG_GO_TO_JAIL;
		drawImageAtMaxSize(ctx, cardImg, imgX, imgY, headerWidth, imgHeight);
	}else if(theCard.type == CASE_TYPE_JAIL){
		cardImg = IMG_JAIL;
		drawImageAtMaxSize(ctx, cardImg, imgX, imgY, headerWidth, imgHeight);
	}else if(theCard.type == CASE_TYPE_GARE){
		cardImg = IMG_GARE;
		drawImageAtMaxSize(ctx, cardImg, imgX, imgY, headerWidth, imgHeight);
	}else if(theCard.type == CASE_TYPE_CIE){
		cardImg = IMG_CIE;
		drawImageAtMaxSize(ctx, cardImg, imgX, imgY, headerWidth, imgHeight);
	}else if(theCard.type == CASE_TYPE_TAXE){
		cardImg = IMG_TAXE;
		drawImageAtMaxSize(ctx, cardImg, imgX, imgY, headerWidth, imgHeight);
		ctx.font = contentFontSize +'vh serif';
		drawTextInRect(ctx, "Somme due "+theCard.price + DEVISE,imgX,textY,headerWidth, getVerticalProportion(CARD_CONTENT_FONT_SIZE));
	}
	
}

/**
*	Dessine l'overlay
**/
function drawOverlay(){
	ctx.fillStyle = "rgba(0,0,0,0.5)";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
}

/**
*	Dessine les boutons d'action de l'overlay
**/
function drawActions(game){
	var actions = game.getPlayerActions();
	var buttonZoneX = getHorizontalProportion(ACTION_BUTTON_MARGIN_LEFT);
	var buttonZoneWidth = getHorizontalProportion(100) - getHorizontalProportion(ACTION_BUTTON_MARGIN_RIGHT) - buttonZoneX;
	var buttonZoneY = getVerticalProportion(ACTION_BUTTON_MARGIN_TOP);
	var buttonZoneHeight = getVerticalProportion(ACTION_BUTTON_FONT_SIZE * 2);
	var buttonWidth = buttonZoneWidth / actions.length;
	for(var i =0; i<actions.length;i++){
		var buttonX = buttonZoneX + buttonWidth * i;
		ctx.fillStyle = COLOR_YELLOW;
		ctx.fillRect(buttonX,buttonZoneY, buttonWidth, buttonZoneHeight);
		ctx.font = ACTION_BUTTON_FONT_SIZE+'vh serif';
		drawTextInRect(ctx, getText(actions[i]), buttonX, buttonZoneY, buttonWidth, buttonZoneHeight);
	}
}
/**
*	Dessine l'image d'illustration overlay
**/
function drawIllustration(game){
	var x = getHorizontalProportion(ILLUSTRATION_MARGIN_LEFT);
	var y = getVerticalProportion(ILLUSTRATION_MARGIN_TOP);
	var rectH = getVerticalProportion(ILLUSTRATION_MAX_HEIGHT);
	var rectW = getVerticalProportion(ILLUSTRATION_MAX_WIDTH);
	
	var theCase = game.board.cases[game.players[game.currentPlayerIndex].currentCaseIndex];
	var nbPeopleHere = game.players.filter(p=> game.players[game.currentPlayerIndex].currentCaseIndex == p.currentCaseIndex).length;
	var imgId = "";
	switch(theCase.type){
		case CASE_TYPE_PROP:
			imgId += theCase.number+"_";
			if(theCase.currentOwner != null){
				if(theCase.currentOwner == game.currentPlayerIndex){
					imgId += ILLU_VISIT;
				}else{
					if(nbPeopleHere == 2){
						imgId += ILLU_DUO;
					}else if(nbPeopleHere > 2){
						imgId += ILLU_MANY;
					}else{
						if(theCase.currentOwnerTurnsLeft == 1){
							imgId += ILLU_PAY_1;
						}else if(theCase.currentOwnerTurnsLeft > 1 && theCase.currentOwnerTurnsLeft < 5){
							imgId += ILLU_PAY_2;
						}else if(theCase.currentOwnerTurnsLeft >= 5){
							imgId += ILLU_PAY_5;
						}
					}
				}
			}else{
				imgId += ILLU_MEET;
			}
			break;
		case CASE_TYPE_TAXE :
			imgId += PLAYER_ACTION_PAY;
			break;
		case CASE_TYPE_GARE :
			imgId += PLAYER_ACTION_MOVE;
			break;
		case CASE_TYPE_PIOCHE:
			imgId += "CARD_" + game.board.cards[game.board.cardIndex].name;
			break;
		case CASE_TYPE_GO_TO_JAIL:
			imgId += PLAYER_ACTION_GO_TO_JAIL;
			break;
		case CASE_TYPE_FIRST:
		case CASE_TYPE_FREE_PARK:
		default :
			imgId += PLAYER_ACTION_CONTINUE;
	}
	var image = document.getElementById(imgId);
	if(image != null){
		if(image.src.split(".")[1] == "gif"){
			drawGif(ctx, image, x, y, rectW, rectH);
		}else{
			drawImageAtMaxSize(ctx, image, x, y, rectW, rectH);
		}
	}
}

/**
*	Dessine le texte de l'action
**/
function drawTextOverlay(game){
	var x = getHorizontalProportion(TEXT_OVERLAY_MARGIN_LEFT);
	var y = getVerticalProportion(TEXT_OVERLAY_MARGIN_TOP);
	var rectW = getHorizontalProportion(TEXT_OVERLAY_WIDTH);
	var rectH = getVerticalProportion(TEXT_OVERLAY_HEIGHT);

	//ctx.fillStyle = COLOR_WHITE;
	ctx.font = TEXT_OVERLAY_FONT_SIZE+'vh serif';
	
	var theCase = game.board.cases[game.players[game.currentPlayerIndex].currentCaseIndex];
	var nbPeopleHere = game.players.filter(p=> game.players[game.currentPlayerIndex].currentCaseIndex == p.currentCaseIndex).length;
	var textToDraw = "";
	
	switch(theCase.type){
		case CASE_TYPE_PROP:
			if(theCase.currentOwner != null){
				if(theCase.currentOwner == game.currentPlayerIndex){
					textToDraw = getText(ILLU_VISIT,[theCase.name,theCase.currentOwnerTurnsLeft, theCase.housePrice, Math.floor(theCase.housePrice * theCase.currentOwnerTurnsLeft / 2)]);
				}else{
					console.log(nbPeopleHere);
					if(nbPeopleHere == 2){
						textToDraw = getText(ILLU_DUO,[theCase.name, game.getCurrentAmount()]);
					}else if(nbPeopleHere > 2){
						textToDraw = getText(ILLU_MANY,[theCase.name, game.getCurrentAmount()]);
					}else{
						if(theCase.currentOwnerTurnsLeft == 1){
							textToDraw = getText(ILLU_PAY_1,[theCase.name, game.getCurrentAmount()]);
						}else if(theCase.currentOwnerTurnsLeft > 1 && theCase.currentOwnerTurnsLeft < 5){
							textToDraw = getText(ILLU_PAY_2,[theCase.name, game.getCurrentAmount()]);
						}else if(theCase.currentOwnerTurnsLeft >= 5){
							textToDraw = getText(ILLU_PAY_5,[theCase.name, game.getCurrentAmount()]);
						}
					}
				}
			}else{
				textToDraw = getText(ILLU_MEET,[theCase.name, theCase.housePrice]);
			}
			break;
		case CASE_TYPE_TAXE :
			textToDraw = getText(CASE_TYPE_TAXE,[theCase.name, theCase.price]);
			break;
		case CASE_TYPE_GARE :
			textToDraw = getText(CASE_TYPE_GARE,[theCase.name, GARE_MOVE_PRICE]);
			break;
		case CASE_TYPE_PIOCHE:
			textToDraw = getText(game.board.cards[game.board.cardIndex].name,[game.board.cards[game.board.cardIndex].value]);
			break;
		case CASE_TYPE_GO_TO_JAIL:
			textToDraw = getText(PLAYER_ACTION_GO_TO_JAIL);
			break;
		case CASE_TYPE_FIRST:
			textToDraw = getText(CASE_TYPE_FIRST);
			break;
		case CASE_TYPE_FREE_PARK:
			textToDraw = getText(CASE_TYPE_FREE_PARK);
			break;
		default :
			textToDraw = PLAYER_ACTION_CONTINUE;
	}
	drawTextInRect(ctx, textToDraw, x, y, rectW, rectH, COLOR_WHITE);
}

function getBoardProportion(value){
	return getBoardWidth() / 100 * value;
}
function getCardDimensions(){
	var maxHeight = getVerticalProportion(CARD_MAX_HEIGHT);
	var maxWidth = getHorizontalProportion(CARD_MAX_WIDTH);
	
	if(maxWidth * CARD_RECT_RATIO > maxHeight){
		maxWidth = Math.floor(maxHeight / CARD_RECT_RATIO);
	}else{
		maxHeight = Math.floor(maxWidth * CARD_RECT_RATIO);
	}
	return {width:maxWidth, height:maxHeight};
}
function getCardVerticalProportion(value){
	return Math.floor(getCardDimensions().height /100 * value);
}
function getCardHorizontalProportion(value){
	return Math.floor(getCardDimensions().width /100 * value);
}
function getProportionalFontSize(fontSize, containerHeight){
	var screenHeight = canvas.height;
	var ratio = containerHeight / screenHeight;
	return fontSize * ratio;
}

function getBoardWidth(){
	var maxWidth = getHorizontalProportion(BOARD_MAX_WIDTH);
	var maxHeigth = getVerticalProportion(BOARD_MAX_HEIGHT);
	return Math.floor(maxWidth >= maxHeigth ? maxHeigth : maxWidth);
}
function getHorizontalProportion(value){
	return Math.floor(canvas.width /100 * value);
}
function getVerticalProportion(value){
	return Math.floor(canvas.height /100 * value);
}
/**
*	Dessine un cercle
**/
function drawCircle(ctx, x, y, radius, fill, stroke, strokeWidth = 1) {
	ctx.beginPath();
	ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
	if (fill) {
		ctx.fillStyle = fill;
		ctx.fill();
	}
	if (stroke) {
		ctx.lineWidth = strokeWidth;
		ctx.strokeStyle = stroke;
		ctx.stroke();
	}
}
/**
*	Dessine une image pivotée
**/
function drawImage(ctx, image, x, y, w, h, degrees = 0){
	ctx.save();
	ctx.translate(x+w/2, y+h/2);
	ctx.rotate(degrees*Math.PI/180.0);
	ctx.translate(-x-w/2, -y-h/2);
	drawImageAtMaxSize(ctx,image, x, y, w, h);
	ctx.restore();
}
/**
*	Dessine une image dans un rectangle en le remplissant au max
**/
function drawImageAtMaxSize(ctx, image, x, y, rectW, rectH){
	var ratio = image.height/image.width;
	var w = rectW;
	var h = rectH;
	if(rectW * ratio > rectH){
		w = Math.floor(h / ratio);
	}else{
		h = Math.floor(w * ratio);
	}
	ctx.drawImage(image,x+Math.floor((rectW - w)/2),y+Math.floor((rectH - h)/2),w,h);
}
/**
*	Dessine une ligne
**/
function drawLine(ctx, xStart, yStart, xEnd, yEnd, color = COLOR_BLACK){
	ctx.beginPath();
	ctx.strokeStyle = color;
	ctx.moveTo(xStart,yStart);
	ctx.lineTo(xEnd,yEnd);
	ctx.stroke();
}
/**
*	Dessine un texte centré par rapport au rectangle
**/
function drawTextInRect(ctx,theText,x,y,w,h,color=COLOR_BLACK){
	
	ctx.fillStyle = color;
	ctx.font = "2.5vh serif";
	var textProps = ctx.measureText(theText);
	var tryCounts = 0;
	while(textProps.width > w && tryCounts < 200){
		var fontSize = parseFloat(ctx.font.split("vh")[0],10)-0.1;
		ctx.font = fontSize+'vh serif';
		textProps = ctx.measureText(theText);
		tryCounts++;
	}
	ctx.fillText(theText, x + Math.floor(w/2) - Math.floor(textProps.width/2), y + Math.floor(h/2));
}
/**
*	Dessine un GIF aux coordonnée données (Ne peut pas être redimensionné)
**/
function drawGif(ctx, gif, x, y,rectW,rectH){
	animateGif = true;
	var ratio = gif.height/gif.width;
	var w = rectW;
	var h = rectH;
	if(rectW * ratio > rectH){
		w = Math.floor(h / ratio);
	}else{
		h = Math.floor(w * ratio);
	}
	fetch(gif.src)
		.then(res => res.arrayBuffer())
		.then(buff => new Uint8Array(buff))
		.then(buff => new GifReader(buff))
		.then(gif => processGif(gif))
		.then(function(frames){ 
				if(animateGif){
					currentFrameIndex = 0;
					displayGif(ctx, frames, x, y,w,h);
				}else{
					return true;
				}
			}
		);
}
function displayGif(ctx, gif, x, y,w,h){
	if(!gif[currentFrameIndex+1]){
		currentFrameIndex = 0;
	}
	if(animateGif){
		//resize
		var hiddenCanvas = document.getElementById("hiddenCanvas");
		hiddenCanvas.setAttribute("width", gif[currentFrameIndex].data.width);
		hiddenCanvas.setAttribute("height",gif[currentFrameIndex].data.height);
		hiddenCanvas.getContext("2d").putImageData(gif[currentFrameIndex].data,0,0);
		ctx.save();
		
		ctx.scale(w/gif[currentFrameIndex].data.width,h/gif[currentFrameIndex].data.height);
		ctx.drawImage(hiddenCanvas, x,y);
		
		ctx.restore();
		currentFrameIndex++;
		setTimeout(() => displayGif(ctx, gif, x, y,w,h), gif[currentFrameIndex].delay);
	}else{
		return true;
	}
}
/**
*	Découpe un Gif en frmaes
**/
function processGif(gif) {

	const count = gif.numFrames();
	var frames = new Array(count);

	let currentFrame = -1;
	while (currentFrame < count - 1) {
		const frameInfo = gif.frameInfo(currentFrame + 1);
		const imageData = ctx.createImageData(gif.width, gif.height);
		if (currentFrame >= 0 && frameInfo.disposal < 2) {
			imageData.data.set(new Uint8ClampedArray(frames[currentFrame].data.data));
		}

		currentFrame += 1;
		frames[currentFrame] = {
			data: imageData,
			delay: gif.frameInfo(currentFrame).delay * 10
		};
		gif.decodeAndBlitFrameRGBA(currentFrame, imageData.data);
	}
	Promise.resolve();
	return frames;
}


/**
*	UTILS pour le Click
*/
function getCursorPosition(event) {
	const rect = canvas.getBoundingClientRect();
	const x = event.clientX - rect.left;
	const y = event.clientY - rect.top;
	return {x : x, y: y};
}
function isOnBoard(point){
	var boardWidth = getBoardWidth();
	var board_X = getHorizontalProportion(BOARD_MARGIN_LEFT);
	var board_Y = getVerticalProportion(BOARD_MARGIN_TOP);
	return (point.x >= board_X && point.x <= board_X + boardWidth && point.y >= board_Y && point.y <= board_Y + boardWidth);
}
function isOnDiceButton(point){
	var buttonX = getHorizontalProportion(DICE_BUTTON_MARGIN_LEFT);
	var buttonY = getVerticalProportion(DICE_BUTTON_MARGIN_TOP);
	var buttonWidth = getHorizontalProportion(DICE_BUTTON_WIDTH);
	var buttonHeight = getVerticalProportion(DICE_BUTTON_HEIGHT);
	return point.x >= buttonX && point.x <= buttonX + buttonWidth && point.y >= buttonY && point.y <= buttonY + buttonHeight;
}
function isOnActionButton(point){
	var buttonZoneX = getHorizontalProportion(ACTION_BUTTON_MARGIN_LEFT);
	var buttonZoneWidth = getHorizontalProportion(100) - getHorizontalProportion(ACTION_BUTTON_MARGIN_RIGHT) - buttonZoneX;
	var buttonZoneY = getVerticalProportion(ACTION_BUTTON_MARGIN_TOP);
	var buttonZoneHeight = getVerticalProportion(ACTION_BUTTON_FONT_SIZE * 2);
	return point.x >= buttonZoneX && point.x <= buttonZoneX + buttonZoneWidth && point.y >= buttonZoneY && point.y <= point.y + buttonZoneHeight;
}
function getActionIndex(game,point){
	var actions = game.getPlayerActions();
	var buttonZoneX = getHorizontalProportion(ACTION_BUTTON_MARGIN_LEFT);
	var buttonZoneWidth = getHorizontalProportion(100) - getHorizontalProportion(ACTION_BUTTON_MARGIN_RIGHT) - buttonZoneX;
	var buttonZoneY = getVerticalProportion(ACTION_BUTTON_MARGIN_TOP);
	var buttonZoneHeight = getVerticalProportion(ACTION_BUTTON_FONT_SIZE * 2);
	var buttonWidth = buttonZoneWidth / actions.length;
	return Math.floor((point.x - buttonZoneX) / buttonWidth); 
}
function getClickedCellIndex(game, point){
	var boardWidth = getBoardWidth();
	
	var board_X = getHorizontalProportion(BOARD_MARGIN_LEFT);
	var board_Y = getVerticalProportion(BOARD_MARGIN_TOP);
	
	var cellWidth = getBoardProportion(CELL_WIDTH);
	var cellHeight = getBoardProportion(CELL_HEIGHT);
	
	var boardSideCellCount = game.board.cases.length / 4;
	
	// Par rapport au plateau
	var point_X = point.x - board_X;
	var point_Y = point.y - board_Y;
	
	// Top
	if(point_Y < cellHeight){
		if(point_X < cellHeight){
			return 0;
		}else if(point_X > boardWidth - cellHeight){
			return boardSideCellCount;
		}else{
			return Math.floor((point_X - cellHeight) / (boardWidth - cellHeight * 2) * (boardSideCellCount -1)) + 1;
		}
	}else if(point_Y > boardWidth - cellHeight){
		if(point_X < cellHeight){
			return boardSideCellCount * 3;
		}else if(point_X > boardWidth - cellHeight){
			return boardSideCellCount * 2;
		}else{
			return boardSideCellCount * 3 - (Math.floor((point_X - cellHeight) / (boardWidth - cellHeight * 2) * (boardSideCellCount -1)) + 1);
		}
	}else{
		if(point_X < cellHeight){
			return boardSideCellCount * 4 - (Math.floor((point_Y - cellHeight) / (boardWidth - cellHeight * 2) * (boardSideCellCount -1)) + 1);
		}else if(point_X > boardWidth - cellHeight){
			return boardSideCellCount * 1 + Math.floor((point_Y - cellHeight) / (boardWidth - cellHeight * 2) * (boardSideCellCount -1)) + 1;
		}else{
			return null;
		}
	}
	
}