GameStates.MainMenu = function (game) {

};

GameStates.MainMenu.prototype = {
    create: function () {
        this.loadingText = this.add.text(this.game.width / 2, this.game.height / 2, "Нажмите Enter, чтобы начать", { font: "20px monospace", fill: "#fff" });
        this.loadingText.anchor.setTo(0.5, 0.5);

        this.game.input.keyboard
            .addKey(Phaser.Keyboard.ENTER)
            .onDown.add(this.playGame, this); 
        
        this.input.onDown.add(this.playGame, this);
        
        this.playGame();
    },
    playGame: function () {
        this.state.start('Game');
    }
};
