import './reset.css';
import './general.css';

import { Player } from "./models/player.js";
import { GameFlow } from "./controllers/gameflow.js";
import { screenController } from "./controllers/screenController.js";

const firstNameDialog = document.querySelector('dialog.first-player-name');
firstNameDialog.showModal();
firstNameDialog.addEventListener('submit', firstPlayerNameSubmit);

function firstPlayerNameSubmit(e) {
    e.preventDefault();
    const input = document.querySelector('input.first-player-name');

    const player1 = new Player("human", true, input.value);
    const computer = new Player("computer", false, "Computer");
    // const opponent = new Player("human", false, "Cyrielle");

    const game = new GameFlow([player1, computer]);

    screenController.start(game);

    firstNameDialog.close();
}

