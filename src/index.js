import './reset.css';
import './general.css';

import { Player } from './player.js';
import { displayBoard } from './DOM.js';

const player = new Player('human');
const computer = new Player('computer');

displayBoard(player);
displayBoard(computer);