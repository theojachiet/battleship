import { GameBoard } from "./gameboard.js";

export class Player {
    constructor(type, ismyTurn) {
        this.type = type;
        this.gameboard = new GameBoard();
        this.ismyTurn = ismyTurn;
    }
}