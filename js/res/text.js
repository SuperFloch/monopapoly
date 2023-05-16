var GAME_TEXT = {
	TurnsLeft: "[0] tours restants",
	RollDices:"Lancez les dés",
	EndTurn:"Fin du tour",
	BUY: "Acheter",
	PAY:"Payer",
	MOVE:"Bouger",
	SELL:"Vendre",
	CONTINUE:"Continuer",
	LOSE: "Abandonner",
	"APPLY CARD": "Appliquer",
	PLAYER_ACTION_GO_TO_JAIL : "Aller en prison",
	PLAYER_ACTION_OUT_OF_JAIL: "Utiliser votre carte de sortie",
	CASE_TYPE_TAXE: "Vous devez payer [0], soit un montant de [1]€",
	CASE_TYPE_GARE: "Bienvenue à [0], vous pouvez vous déplacer à la prochaine gare pour [1] €",
	ILLU_MEET : "Bienvenue à [0], vous pouvez louer un tour pour [1]€ ou passer votre chemin",
	ILLU_VISIT : "Bienvenue à [0], cette rue est encore à vous pour [1] tours. vous pouvez racheter des tours pour [2]€ ou tout vendre pour [3]€",
	ILLU_PAY_1 : "Bienvenue à [0], cette rue appartient à un autre joueur. Vous lui devez [1]€",
	ILLU_PAY_2 : "Bienvenue à [0], cette rue appartient à un autre joueur. Vous lui devez [1]€",
	ILLU_PAY_5 : "Bienvenue à [0], cette rue appartient à un autre joueur. Vous lui devez [1]€",
	ILLU_DUO : "Bienvenue à [0], il y a déjà quelqu'un ici. Cette rue appartient à un autre joueur. Vous lui devez [1]€",
	ILLU_MANY : "Bienvenue à [0], il y a du monde ici ! Cette rue appartient à un autre joueur. Vous lui devez [1]€",
	CASE_TYPE_FIRST : "C'est parti pour un nouveau tour !",
	CASE_TYPE_FREE_PARK : "Une case pour se reposer"
	
};
function getText(backName, args){
	if(GAME_TEXT[backName]){
		if(args){
			var tex = GAME_TEXT[backName];
			for(var i =0; i<args.length;i++){
				tex = tex.split("["+i+"]").join(args[i]);
			}
			return tex;
		}
		return GAME_TEXT[backName];
	}
	return "";
}