import * as DOM from ('./DOM.js');

export const screenController = (() => {
    let game; //Gameflow Instance

    function start(newGame) {
        game = newGame;
        renderSetupPhase();
    }

    function renderSetupPhase() {
        DOM.displayBoard(game.player1, game.otherPlayer);
        DOM.displayBoard(game.otherPlayer, game.player1);

        //Enable Ship drag and drop placement
        enablePlacementEvents();
    }

    function renderBattlePhase() {
        DOM.clearContainer();

        DOM.displayBoard(game.player1, game.otherPlayer);
        DOM.displayBoard(game.otherPlayer, game.player1);

        enableAttackEvents();
        //Also clear placementEvents ?
    }

    function renderGameOver(winner) {
        DOM.showGameOverScreen(winner);
    }

    return {start};
})();