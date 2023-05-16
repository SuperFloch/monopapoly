
/*
const CASE_TYPE_FIRST = "FIRST";
const CASE_TYPE_PROP = "PROP";
const CASE_TYPE_TAXE = "TAXE";
const CASE_TYPE_GO_TO_JAIL = "GOTOJAIL";
const CASE_TYPE_JAIL = "JAIL";
const CASE_TYPE_PIOCHE = "PIOCHE";
*/
var board_1 = new Plateau();
/*
*	10x10 Monopoly Rennes Template
*/



// Side 1
board_1.cases.push(new Case(board_1.cases.length, "Case départ", CASE_TYPE_FIRST));
board_1.cases.push(new Case(board_1.cases.length, "Avenue de pologne", CASE_TYPE_PROP,60,50,COLOR_PINK));
board_1.cases.push(new Case(board_1.cases.length, "Pioche", CASE_TYPE_PIOCHE));
board_1.cases.push(new Case(board_1.cases.length, "Allée de Varsovie", CASE_TYPE_PROP,60,50, COLOR_PINK));
board_1.cases.push(new Case(board_1.cases.length, "Impots sur le revenu", CASE_TYPE_TAXE,200));
board_1.cases.push(new Case(board_1.cases.length, "Gare de Rennes", CASE_TYPE_GARE,200));
board_1.cases.push(new Case(board_1.cases.length, "Rue de l'alma", CASE_TYPE_PROP,100,50, COLOR_CYAN));
board_1.cases.push(new Case(board_1.cases.length, "Pioche", CASE_TYPE_PIOCHE));
board_1.cases.push(new Case(board_1.cases.length, "Rue de brest", CASE_TYPE_PROP,100,50, COLOR_CYAN));
board_1.cases.push(new Case(board_1.cases.length, "Cours des alliés", CASE_TYPE_PROP,120,50, COLOR_CYAN));

// Side 2
board_1.cases.push(new Case(board_1.cases.length, "Prison", CASE_TYPE_JAIL));
board_1.cases.push(new Case(board_1.cases.length, "Rue danton", CASE_TYPE_PROP,140,100,COLOR_PURPLE));
board_1.cases.push(new Case(board_1.cases.length, "Compagnie de l'éléctricité", CASE_TYPE_CIE,150));
board_1.cases.push(new Case(board_1.cases.length, "Rue d'aiguillon", CASE_TYPE_PROP,140,100,COLOR_PURPLE));
board_1.cases.push(new Case(board_1.cases.length, "Boulevard de vitré", CASE_TYPE_PROP,160,100, COLOR_PURPLE));
board_1.cases.push(new Case(board_1.cases.length, "Station clémenceau", CASE_TYPE_GARE,200));
board_1.cases.push(new Case(board_1.cases.length, "Place des lices", CASE_TYPE_PROP,180,100, COLOR_ORANGE));
board_1.cases.push(new Case(board_1.cases.length, "Pioche", CASE_TYPE_PIOCHE));
board_1.cases.push(new Case(board_1.cases.length, "Rue st Michel", CASE_TYPE_PROP,180,100, COLOR_ORANGE));
board_1.cases.push(new Case(board_1.cases.length, "Place st anne", CASE_TYPE_PROP,200,100, COLOR_ORANGE));

// Side 3
board_1.cases.push(new Case(board_1.cases.length, "Parc gratuit", CASE_TYPE_FREE_PARK));
board_1.cases.push(new Case(board_1.cases.length, "Les halles", CASE_TYPE_PROP,220,150,COLOR_RED));
board_1.cases.push(new Case(board_1.cases.length, "Pioche", CASE_TYPE_PIOCHE));
board_1.cases.push(new Case(board_1.cases.length, "Rue de nemours", CASE_TYPE_PROP,220,150, COLOR_RED));
board_1.cases.push(new Case(board_1.cases.length, "Boulevard de la liberté", CASE_TYPE_PROP,240,150, COLOR_RED));
board_1.cases.push(new Case(board_1.cases.length, "Aéroport Rennes St Jaques", CASE_TYPE_GARE,200));
board_1.cases.push(new Case(board_1.cases.length, "Rue de la monnaie", CASE_TYPE_PROP,260,150, COLOR_YELLOW));
board_1.cases.push(new Case(board_1.cases.length, "Rue de toulouse", CASE_TYPE_PROP,260,150, COLOR_YELLOW));
board_1.cases.push(new Case(board_1.cases.length, "Compagnie des eaux", CASE_TYPE_CIE,150));
board_1.cases.push(new Case(board_1.cases.length, "Rue du pré botté", CASE_TYPE_PROP,280,150, COLOR_YELLOW));

// Side 4
board_1.cases.push(new Case(board_1.cases.length, "Allez en prison", CASE_TYPE_GO_TO_JAIL));
board_1.cases.push(new Case(board_1.cases.length, "Rue victor Hugo", CASE_TYPE_PROP,300,200,COLOR_GREEN));
board_1.cases.push(new Case(board_1.cases.length, "quai chateaubriand", CASE_TYPE_PROP,300,200, COLOR_GREEN));
board_1.cases.push(new Case(board_1.cases.length, "Pioche", CASE_TYPE_PIOCHE));
board_1.cases.push(new Case(board_1.cases.length, "Place du parlement", CASE_TYPE_PROP,320,200,COLOR_GREEN));
board_1.cases.push(new Case(board_1.cases.length, "Station république", CASE_TYPE_GARE,200));
board_1.cases.push(new Case(board_1.cases.length, "Pioche", CASE_TYPE_PIOCHE));
board_1.cases.push(new Case(board_1.cases.length, "Rue de la palestine", CASE_TYPE_PROP,350,200, COLOR_BLUE));
board_1.cases.push(new Case(board_1.cases.length, "Taxe de luxe", CASE_TYPE_TAXE,100));
board_1.cases.push(new Case(board_1.cases.length, "Boulevard de sévigné", CASE_TYPE_PROP,400,200, COLOR_BLUE));

/**
*	Cartes Chance
*/
board_1.cards.push(new Card("GoToJail",CARD_TYPE_JAIL,0,"Allez en prison. Ne passez pas par la case départ. Ne recevez pas "+FIRST_CELL_MONEY+DEVISE+"."));
board_1.cards.push(new Card("MotCroise",CARD_TYPE_MONEY,100,"Vous avez gagné le prix de mots croisés. Recevez [0]"+DEVISE));
board_1.cards.push(new Card("Banque",CARD_TYPE_MONEY,50,"La banque vous verse un dividende de [0]"+DEVISE));
board_1.cards.push(new Card("Depart",CARD_TYPE_TP,0,"Placez-vous sur la case départ"));
board_1.cards.push(new Card("Amende",CARD_TYPE_MONEY,-20,"Amende pour ivresse : [0]"+DEVISE));
board_1.cards.push(new Card("Banque",CARD_TYPE_MONEY,150,"Votre immeuble et votre prêt rapportent. Vous devez toucher [0]"+DEVISE));
board_1.cards.push(new Card("Amende",CARD_TYPE_MONEY,-15,"Amende pour excès de vitesse [0]"+DEVISE));
board_1.cards.push(new Card("OutOfJail",CARD_TYPE_OUT_OF_JAIL,0,"Vous êtes libéré de prison. Cette carte peut être conservée jusqu'à son utilisation"));
board_1.cards.push(new Card("Move",CARD_TYPE_TP,15,"Allez à "+board_1.cases[15].name));
board_1.cards.push(new Card("Move",CARD_TYPE_TP,24,"Allez à "+board_1.cases[24].name));
board_1.cards.push(new Card("Amende",CARD_TYPE_MONEY,-150,"Payez pour frais de scolarité [0]"+DEVISE));
board_1.cards.push(new Card("Move",CARD_TYPE_TP,39,"Allez à "+board_1.cases[39].name));
board_1.cards.push(new Card("Move",CARD_TYPE_MONEY,11,"Allez à "+board_1.cases[11].name));
board_1.cards.push(new Card("Reparations",CARD_TYPE_MONEY,-125,"Faites des réparations [0]"+DEVISE));
board_1.cards.push(new Card("Reparations",CARD_TYPE_MONEY,-155,"Vous êtes imposé pour les réparations [0]"+DEVISE));
board_1.cards.push(new Card("Move",CARD_TYPE_MOVE,-3,"Reculez de [0] cases"));

board_1.cards.push(new Card("Banque",CARD_TYPE_MONEY,50,"La vente de votre stock vous rapporte [0]"+DEVISE));
board_1.cards.push(new Card("Banque",CARD_TYPE_MONEY,200,"Erreur de la banque en votre faveur. Recevez [0]"+DEVISE));
board_1.cards.push(new Card("Amende",CARD_TYPE_MONEY,-100,"Payez l'hôpital [0]"+DEVISE));
board_1.cards.push(new Card("Amende",CARD_TYPE_MONEY,-50,"Payez votre police d'assurance [0]"+DEVISE));
board_1.cards.push(new Card("Amende",CARD_TYPE_MONEY,-50,"Payez la note du médecin [0]"+DEVISE));
board_1.cards.push(new Card("Banque",CARD_TYPE_MONEY,100,"Recevez votre revenu annuel [0]"+DEVISE));
board_1.cards.push(new Card("Banque",CARD_TYPE_MONEY,25,"Recevez votre intérêt sur l'emprunt à 7% [0]"+DEVISE));
board_1.cards.push(new Card("Banque",CARD_TYPE_MONEY,10,"C'est votre anniversaire [0]"+DEVISE));
board_1.cards.push(new Card("Banque",CARD_TYPE_MONEY,10,"Vous avez gagné le deuxième prix de beauté. Recevez [0]"+DEVISE));
board_1.cards.push(new Card("Banque",CARD_TYPE_MONEY,100,"Vous héritez [0]"+DEVISE));
board_1.cards.push(new Card("Move",CARD_TYPE_TP,1,"Allez à "+board_1.cases[1].name));
board_1.cards.push(new Card("Banque",CARD_TYPE_MONEY,20,"Les contributions vous rapportent la somme de [0]"+DEVISE));

