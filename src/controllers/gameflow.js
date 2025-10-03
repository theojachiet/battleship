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
        if (!hit) return false;

        if (this.otherPlayer.gameboard.gameOver) {
            return { gameOver: true, winner: this.currentPlayer };
        }

        this.addTurn();
        return { gameOver: false };
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

// class GameFlow {

//     constructor(players) {
//         this.players = players;

//         this.human = players[0];
//         this.computer = players[1];
//         this.opponent = players[2];

//         this.currentPlayer = this.human;
//         this.otherPlayer = this.computer;

//         this.playingAgainstHuman = false;
//     }

//     changeOpponent() {
//         //POtential problem !! If we switch opponent after a few rounds and it changes the wrong players because it is using other player var
//         if (this.playingAgainstHuman === false) this.otherPlayer = this.opponent;
//         else this.otherPlayer = this.computer;
//         this.playingAgainstHuman = !this.playingAgainstHuman;
//     }

//     addTurn() {
//         const secondPlayer = this.playingAgainstHuman ? this.opponent : this.computer;

//         const prevPlayer = this.currentPlayer;
//         this.currentPlayer = (this.currentPlayer === this.human) ? secondPlayer : this.human;
//         this.otherPlayer = prevPlayer;

//         this.currentPlayer.changeTurn();
//         this.otherPlayer.changeTurn();
//     }


//     playRound(row, col) {
//         let attackisValid = this.otherPlayer.gameboard.receiveAttack(row, col);

//         if (attackisValid) {
//             //Checking otherPlayer because current Player is the attacker
//             if (this.otherPlayer.gameboard.gameOver) {
//                 alert(`Game Over ! ${this.otherPlayer.name} won !`);
//             }
//             this.addTurn();
//             return true;
//         } else return false;

//     }
// }