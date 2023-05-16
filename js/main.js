window.addEventListener('resize', resizeCanvas);



var game = new Jeu(5,"board_2");
game.board = board_2;
game.board.shuffleCards();
preLoadPictures(game);
setOnClick(game);
//console.log(game);

resizeCanvas();

function resizeCanvas()
{
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

    if( canvas.getContext )
    {
        draw(game);
    }
}

function preLoadPictures(game){
	var picsDiv = document.getElementById("images");
	var picsTypes = [ILLU_CARD, ILLU_VISIT, ILLU_PAY_1, ILLU_PAY_2, ILLU_PAY_5, ILLU_DUO, ILLU_MANY, ILLU_END, ILLU_MEET];
	var picsToLoad = [PLAYER_ACTION_BUY, PLAYER_ACTION_PAY, PLAYER_ACTION_MOVE, PLAYER_ACTION_CONTINUE, PLAYER_ACTION_GO_TO_JAIL];
	var imgSrc = game.board.baseUrl;
	game.board.cases.forEach(function(c){
		if(c.type == CASE_TYPE_PROP){
			picsTypes.forEach(function(t){
				var img = document.createElement("img");
				img.src = imgSrc + "streets/"+c.number+"/"+t+((t==ILLU_CARD || t==ILLU_VISIT || t==ILLU_MEET || t==ILLU_END)? ".jpg" : ".gif");
				img.id = c.number+"_"+t;
				picsDiv.appendChild(img);
			});
		}
	});
	game.board.cards.forEach(function(c){
		var img = document.createElement("img");
		img.src = imgSrc + "cards/"+c.name+".gif";
		img.id = "CARD_"+c.name;
		picsDiv.appendChild(img);
	});
	picsToLoad.forEach(function(t){
		var img = document.createElement("img");
		img.src = imgSrc +t+".gif";
		img.id = t;
		picsDiv.appendChild(img);
	});
}

function setOnClick(game){
	canvas.onclick = function(e){
		var point = getCursorPosition(e);
		game.selectedCard = null;
		if(!game.playerActionRequired){
			if(isOnBoard(point)){
				var index = getClickedCellIndex(game,point);
				if(index != null){
					if(index == game.players[game.currentPlayerIndex].currentCaseIndex && game.dicesLaunched && game.board.cases[index].currentOwner == game.currentPlayerIndex){
						game.playerActionRequired = true;
					}else{
						game.selectedCard = index;
					}
				}
			}else if(isOnDiceButton(point)){
				if(game.dicesLaunched){
					if(game.players[game.currentPlayerIndex].money < 0){
						game.lose();
					}
					game.nextPlayer();
				}else{
					game.rollDices();
					if(game.players[game.currentPlayerIndex].inJail){
						if(game.isDiceDouble()){
							game.players[game.currentPlayerIndex].inJail = false;
							game.players[game.currentPlayerIndex].turnsInJail = 0;
							game.movePlayer(game.getDicesTotal());
						}else{
							game.players[game.currentPlayerIndex].turnsInJail--;
							if(game.players[game.currentPlayerIndex].turnsInJail <= 0){
								game.players[game.currentPlayerIndex].inJail = false;
							}
						}
					}else{
						game.movePlayer(game.getDicesTotal());
					}
					game.playerActionRequired = true;
				}
			}else{
				game.selectedCard = null;
			}
		}else{
			if(isOnActionButton(point)){
				var actionIndex = getActionIndex(game,point);
				var action = game.getPlayerActions()[actionIndex];
				var success = game.doAction(action);
				//console.log(action);
				if(success){
					game.playerActionRequired = false;
				}
			}
		}
		draw(game);
	};
}