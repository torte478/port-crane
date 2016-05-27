// Preloader will load all of the assets like graphics and audio
GameStates.Preloader = function (game) {
    this.preloadBar = null;
}

GameStates.Preloader.prototype = {
    preload: function () {
        // common to add a loading bar sprite here...
        this.preloadBar = this.add.sprite(this.game.width / 2 - 100, this.game.height / 2, 'preloaderBar');
        this.load.setPreloadSprite(this.preloadBar);
        // load all game assets
        this.load.image('container', 'assets/container.png');
        this.load.image('rails', 'assets/crane_top.png');
        this.load.image('hoist', 'assets/hoist.png');
        this.load.image('deck', 'assets/deck.png');
        this.load.image('target', 'assets/target.png');
        this.load.image('bg', 'assets/sky.png');
    },

    create: function () {
        //call next state
        this.state.start('MainMenu');
    }
};
