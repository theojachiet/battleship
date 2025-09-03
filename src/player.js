import { GameBoard } from "./gameboard.js";

export class Player {
    constructor(type) {
        this.type = type;
        this.gameboard = new GameBoard();
    }
}