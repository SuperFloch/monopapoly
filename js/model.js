
const BASE_MONEY = 4000;
const DEVISE = "€";
const DICES_COUNT = 2;
const DICE_MAX_VALUE = 6;
const GARE_MOVE_PRICE = 50;
const FIRST_CELL_MONEY = 200;
const CIE_MULTIPLIER = 25;

const JAIL_CELL_INDEX = 10;

const CASE_TYPE_FIRST = "CASE_TYPE_FIRST";
const CASE_TYPE_PROP = "CASE_TYPE_PROP";
const CASE_TYPE_TAXE = "CASE_TYPE_TAXE";
const CASE_TYPE_GO_TO_JAIL = "CASE_TYPE_GO_TO_JAIL";
const CASE_TYPE_JAIL = "CASE_TYPE_JAIL";
const CASE_TYPE_PIOCHE = "CASE_TYPE_PIOCHE";
const CASE_TYPE_GARE = "CASE_TYPE_GARE";
const CASE_TYPE_FREE_PARK = "CASE_TYPE_FREE_PARK";
const CASE_TYPE_CIE = "CASE_TYPE_CIE";

const CARD_TYPE_MOVE = "CARD_TYPE_MOVE";
const CARD_TYPE_TP = "CARD_TYPE_TP";
const CARD_TYPE_MONEY = "CARD_TYPE_MONEY";
const CARD_TYPE_JAIL = "CARD_TYPE_JAIL";
const CARD_TYPE_OUT_OF_JAIL = "CARD_TYPE_OUT_OF_JAIL";


// Interactivité Joueur
const PLAYER_ACTION_BUY = "BUY";
const PLAYER_ACTION_PAY = "PAY";
const PLAYER_ACTION_MOVE = "MOVE"; //Gares
const PLAYER_ACTION_SELL = "SELL"; // A voir après
const PLAYER_ACTION_CONTINUE = "CONTINUE";
const PLAYER_ACTION_APPLY_CARD = "APPLY CARD";	// Carte de la pioche
const PLAYER_ACTION_GO_TO_JAIL = "PLAYER_ACTION_GO_TO_JAIL";
const PLAYER_ACTION_OUT_OF_JAIL = "PLAYER_ACTION_OUT_OF_JAIL";

// Fenetres
const SCREEN_GAME = "SCREEN_GAME";
const SCREEN_MENU = "SCREEN_MENU";
const SCREEN_END = "SCREEN_END";
const SCREEN_IN_GAME_MENU = "SCREEN_IN_GAME_MENU";

/**
*	Une case du plateau
*/
function Case(number, name, type, price = 0, housePrice = 0, color = null){
	this.name = name;
	this.number = number;
	this.price = price;
	this.type = type;
	this.color = color;
	this.housePrice = housePrice;
	
	this.currentOwner = null;
	this.currentOwnerTurnsLeft = 0;
}
/**
*	Une carte de la pioche
*/
function Card(name,type,value,text){
	this.name = name;
	this.type = type;
	this.value = value;
	GAME_TEXT[name] = text;
}

/**
*	Le plateau
*/
function Plateau(name="board_1"){
	this.cases = [];
	this.cards = [];
	this.cardIndex= 0;
	this.name = name;
	this.baseUrl = "boards/"+this.name+"/img/";
	this.nextCard = function(){
		this.cardIndex++;
		if(this.cardIndex>=this.cards.length){
			this.cardIndex = 0;
		}
	};
	this.shuffleCards = function(){
		shuffleArray(this.cards);
	};
}

function Joueur(index, name){
	this.index = index;
	this.name = name;
	this.currentCaseIndex = 0;
	this.money = BASE_MONEY;
	this.cpu = false;
	this.inJail = false;
	this.lost = false;
	this.turnsInJail = 0;
	this.outOfJailCardsCount = 0;
}

function Jeu(playerCount,boardName){
	this.players = [];
	for(var i =0; i < playerCount; i++){
		this.players.push(new Joueur(i,"Joueur "+(i+1)));
	}
	this.board = new Plateau(boardName);
	this.currentPlayerIndex = 0;
	this.currentScreen = SCREEN_GAME;
	this.nextPlayer = function(){
		this.dicesLaunched = false;
		this.currentPlayerIndex++;
		if(this.currentPlayerIndex >= this.players.length){
			this.currentPlayerIndex = 0;
		}
		if(this.players[this.currentPlayerIndex].money < 0){
			this.nextPlayer();
		}
	};
	this.dices = rollDices(DICES_COUNT);
	this.rollDices = function(){
		this.dices = rollDices(DICES_COUNT);
		this.dicesLaunched = true;
	};
	this.getDicesTotal = function(){
		return this.dices.reduce((a, b) => a + b, 0);
	};
	this.isDiceDouble = function(){
		return this.dices.filter(x => x != this.dices[0]).length == 0;
	};
	this.movePlayer = function(amount){
		// Prendre en compte amount négatif
		if(amount<= 0){
			this.players[this.currentPlayerIndex].currentCaseIndex += amount;
			if(this.players[this.currentPlayerIndex].currentCaseIndex < 0){
				this.players[this.currentPlayerIndex].currentCaseIndex = this.board.cases.length + this.players[this.currentPlayerIndex].currentCaseIndex;
			}
		}else{
			for(var i =0;i<amount;i++){
				this.movePlayerOnce();
			}
		}
	}
	this.movePlayerOnce = function(){
		this.players[this.currentPlayerIndex].currentCaseIndex ++;
		if(this.players[this.currentPlayerIndex].currentCaseIndex >= this.board.cases.length){
			this.players[this.currentPlayerIndex].currentCaseIndex = this.players[this.currentPlayerIndex].currentCaseIndex - (this.board.cases.length);
		}
		// On retire un jour de Location
		var theCase = this.board.cases[this.players[this.currentPlayerIndex].currentCaseIndex];
		if(theCase.type == CASE_TYPE_PROP){
			if(theCase.currentOwner == this.currentPlayerIndex){
				theCase.currentOwnerTurnsLeft --;
				if(theCase.currentOwnerTurnsLeft <= 0){
					theCase.currentOwnerTurnsLeft = 0;
					theCase.currentOwner = null;
				}
			}
		}else if(theCase.type == CASE_TYPE_FIRST){
			this.players[this.currentPlayerIndex].money += FIRST_CELL_MONEY;
		}
	};
	this.tpPlayer = function(cellIndex){
		if(cellIndex >= this.board.cases.length){
			cellIndex = cellIndex % this.board.cases.length;
		}
		this.players[this.currentPlayerIndex].currentCaseIndex = cellIndex;
	}
	// Retourne la somme actuelle en jeu sur la case du joueur
	this.getCurrentAmount = function(){
		var theCase = this.board.cases[this.players[this.currentPlayerIndex].currentCaseIndex];
		return this.board.cases.filter(c => c.currentOwner == theCase.currentOwner && c.color == theCase.color).length * theCase.price * theCase.currentOwnerTurnsLeft;
	};
	// Si le joueur doit cliquer sur un truc
	this.playerActionRequired = false;
	// Le compteur pour l'écran d'achat
	this.currentBuyAmount = 0;
	this.dicesLaunched = false;
	// Pour les clics sur le plateau
	this.selectedCard = null;
	this.getPlayerActions = function(){
		var theCase = this.board.cases[this.players[this.currentPlayerIndex].currentCaseIndex];
		switch(theCase.type){
			case CASE_TYPE_CIE:
			case CASE_TYPE_PROP:
				if(theCase.currentOwner != null){
					if(theCase.currentOwner == this.currentPlayerIndex){
						return [PLAYER_ACTION_BUY, PLAYER_ACTION_CONTINUE, PLAYER_ACTION_SELL];
					}else{
						return [PLAYER_ACTION_PAY];
					}
				}else{
					return [PLAYER_ACTION_BUY, PLAYER_ACTION_CONTINUE];
				}
			case CASE_TYPE_TAXE :
				return [PLAYER_ACTION_PAY];
			case CASE_TYPE_GARE :
				return [PLAYER_ACTION_MOVE, PLAYER_ACTION_CONTINUE];
			case CASE_TYPE_PIOCHE:
				return [PLAYER_ACTION_APPLY_CARD];
			case CASE_TYPE_GO_TO_JAIL:
				return [PLAYER_ACTION_GO_TO_JAIL];
			case CASE_TYPE_JAIL:
				if(this.players[this.currentPlayerIndex].inJail){
					if(this.players[this.currentPlayerIndex].outOfJailCardsCount > 0){
						return [PLAYER_ACTION_OUT_OF_JAIL, PLAYER_ACTION_CONTINUE];
					}
				}
				return [PLAYER_ACTION_CONTINUE];
			case CASE_TYPE_FIRST:
			case CASE_TYPE_FREE_PARK:
			default :
				return [PLAYER_ACTION_CONTINUE];
		}
	}
	this.doAction = function(actionType){
		var theCase = this.board.cases[this.players[this.currentPlayerIndex].currentCaseIndex];
		switch(actionType){
			case PLAYER_ACTION_BUY:
				if(theCase.currentOwner == null || theCase.currentOwner == this.currentPlayerIndex){
					if(this.players[this.currentPlayerIndex].money >= theCase.housePrice){
						theCase.currentOwner = this.currentPlayerIndex;
						theCase.currentOwnerTurnsLeft += 1;
						this.players[this.currentPlayerIndex].money -= theCase.housePrice;
						return true;
					}
				}
				return false;
			case PLAYER_ACTION_MOVE:
				if(this.players[this.currentPlayerIndex].money >= GARE_MOVE_PRICE){
					var boardSideCellCount = this.board.cases.length / 4;
					this.players[this.currentPlayerIndex].money -= GARE_MOVE_PRICE;
					this.tpPlayer(this.players[this.currentPlayerIndex].currentCaseIndex + boardSideCellCount);
					return true;
				}
				return false;
			case PLAYER_ACTION_PAY:
				if(theCase.type == CASE_TYPE_TAXE){
					this.players[this.currentPlayerIndex].money -= theCase.price;
				}else if(theCase.type == CASE_TYPE_PROP){
					var amount = this.getCurrentAmount();
					this.players[this.currentPlayerIndex].money -= amount;
					this.players[theCase.currentOwner].money += amount;
				}else if(theCase.type == CASE_TYPE_CIE){
					var amount = this.getDicesTotal() * CIE_MULTIPLIER * theCase.currentOwnerTurnsLeft;
					this.players[this.currentPlayerIndex].money -= amount;
					this.players[theCase.currentOwner].money += amount;
				}
				return true;
			case PLAYER_ACTION_SELL:
				if(theCase.currentOwner == this.currentPlayerIndex){
					// On vend tout
					theCase.currentOwner = null;
					var amount = Math.floor((theCase.currentOwnerTurnsLeft * theCase.housePrice)/2);
					this.players[this.currentPlayerIndex].money += amount;
					theCase.currentOwnerTurnsLeft = 0;
				}
				return true;
			case PLAYER_ACTION_APPLY_CARD:
				var theCard = this.board.cards[this.board.cardIndex];
				this.board.nextCard();
				switch(theCard.type){
					case CARD_TYPE_MOVE :
						this.movePlayer(theCard.value);
						this.playerActionRequired = true;
						return false;
					case CARD_TYPE_TP :
						this.tpPlayer(theCard.value);
						break;
					case CARD_TYPE_MONEY :
						this.players[this.currentPlayerIndex].money += theCard.value;
						break;
					case CARD_TYPE_JAIL :
						this.tpPlayer(JAIL_CELL_INDEX);
						this.players[this.currentPlayerIndex].inJail = true;
						this.players[this.currentPlayerIndex].turnsInJail = 3;
						break;
					case CARD_TYPE_OUT_OF_JAIL:
						this.players[this.currentPlayerIndex].outOfJailCardsCount ++;
					default :
					break;
				}
				return true;
			case PLAYER_ACTION_GO_TO_JAIL:
				this.tpPlayer(JAIL_CELL_INDEX);
				this.players[this.currentPlayerIndex].inJail = true;
				this.players[this.currentPlayerIndex].turnsInJail = 3;
				return true;
			case PLAYER_ACTION_OUT_OF_JAIL:
				this.players[this.currentPlayerIndex].outOfJailCardsCount --;
				this.players[this.currentPlayerIndex].inJail = false;
				this.players[this.currentPlayerIndex].turnsInJail = 0;
				return true;
			case PLAYER_ACTION_CONTINUE:
			default :
			return true;
		}
	};
	this.lose = function(){
		this.players[this.currentPlayerIndex].lost = true;
		for(var i = 0; i< this.board.cases.length;i++){
			if(this.board.cases[i].currentOwner == this.currentPlayerIndex){
				this.board.cases[i].currentOwner = null;
				this.board.cases[i].currentOwnerTurnsLeft = 0;
			}
		}
	};
}

function rollDices(diceCount){
	var dices = [];
	for(var i =0;i< diceCount;i++){
		dices.push(Math.floor(DICE_MAX_VALUE*Math.random())+1);
	}
	return dices;
}

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}