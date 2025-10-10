import './reset.css';
import './general.css';

import { Player } from "./models/player.js";
import { GameFlow } from "./controllers/gameflow.js";
import { screenController } from "./controllers/screenController.js";

const player1 = new Player("human", true, "Theo");
const computer = new Player("computer", false, "Computer");
const opponent = new Player("human", false, "Cyrielle");

const game = new GameFlow([player1, computer, opponent]);

screenController.start(game);