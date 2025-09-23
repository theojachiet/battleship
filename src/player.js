import { GameBoard } from "./gameboard.js";

export class Player {
    constructor(type, ismyTurn, name) {
        this.type = type;
        this.gameboard = new GameBoard();
        this.ismyTurn = ismyTurn;
        this.name = name;
    }

    changeTurn() {
        this.ismyTurn = !this.ismyTurn;
    }
}