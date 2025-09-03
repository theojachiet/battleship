import './reset.css';
import { Player } from './player.js';
import { displayBoard } from './DOM.js';

const player = new Player('human');

displayBoard(player);