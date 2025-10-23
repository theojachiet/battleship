export class GameFlow {
    constructor(players) {
        this.human = players[0];
        this.computer = players[1];
        this.opponent = players[2];

        this.currentPlayer = this.human;
        this.otherPlayer = this.computer;

        this.playingAgainstHuman = false;
    }

    switchOpponent() {
        this.otherPlayer = this.playingAgainstHuman ? this.computer : this.opponent;
        this.playingAgainstHuman = !this.playingAgainstHuman;
        this.resetTurns();
    }

    resetTurns() {
        this.currentPlayer = this.human;
        this.otherPlayer = this.playingAgainstHuman ? this.opponent : this.computer;
    }

    playRound(row, col) {
        const hit = this.otherPlayer.gameboard.receiveAttack(row, col);
        if (!hit) return { valid: false };

        let ship = null;
        if (hit.type === 'ship') ship = this.otherPlayer.gameboard.getShip(row, col);

        if (this.otherPlayer.gameboard.gameOver) {
            this.addTurn();
            return {
                valid: true,
                hit: hit.type,
                ship: ship || null,
                gameOver: true,
                winner: this.otherPlayer
            };
        }

        this.addTurn();
        return {
            valid: true,
            hit: hit.type,
            ship: ship || null,
            gameOver: false,
            winner: null
        };
    }

    addTurn() {
        const secondPlayer = this.playingAgainstHuman ? this.opponent : this.computer;
        const prevPlayer = this.currentPlayer;

        this.currentPlayer = (this.currentPlayer === this.human) ? secondPlayer : this.human;
        this.otherPlayer = prevPlayer;

        this.currentPlayer.changeTurn();
        this.otherPlayer.changeTurn();
    }
}