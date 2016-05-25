function DataForVisualization(
    deckHeight, 
    containers, 
    hoistX) {
    this.deckHeight = deckHeight
    this.containers = containers
    this.hoistX = hoistX
}

function Container(x, y) {
    this.x = x
    this.y = y
}

var getData = function () {
    var xs = [];
    xs.push(new Container(64 * Math.random(), 64))
    var ret = new DataForVisualization(
        Math.random() * 64 + 500, 
        xs, 
        0, 
        Math.random() * 800)

    return ret
}

GameStates.Game = function (game) {

};

GameStates.Game.prototype = {
    create: function () {
        var hoistHeight = 100
        this.hoist = this.add.sprite(0, 0, 'hoist')
        this.rails = this.add.sprite(this.world.centerX, this.world.centerY, 'rails')
        this.bg = this.add.sprite(0, 0, 'bg')
        this.deck  = this.add.sprite(this.world.centerX, 0, 'deck')
        this.deck.anchor.x = 0.5
        this.deck.anchor.y = 0

        this.ropeGraphics = game.add.graphics(0, 0);

        var maxContainers = 16
        this.containers = []
        for (i = 0; i < maxContainers; ++i) {
            var newSprite = this.add.sprite(-1000, -1000, 'container')
            newSprite.visible = false
            this.containers.push(newSprite)
        }
    },

    update: function () { 
        var data = getData()

        var trunc = function(s) {
            return String(s).substring(0, 6)
        }

        var s = "deckHeight: " + trunc(data.deckHeight) +
                " hoistX: " + trunc(data.hoistX)

        this.hoist.x = data.hoistX
        this.deck.y  = data.deckHeight

        for (i = 0; i < data.containers.length; ++i) {
            this.containers[i].x = data.containers[i].x
            this.containers[i].y = data.containers[i].y
            this.containers[i].visible = true
        }

        this.ropeGraphics.clear()
        this.ropeGraphics.lineStyle(8, 0x333333);
        this.ropeGraphics.moveTo(data.hoistX, 100);
        this.ropeGraphics.lineTo(data.containers[0].x, data.containers[0].y);
        var containerWidth = 100 // todo
        this.ropeGraphics.moveTo(data.hoistX + containerWidth, 100);
        this.ropeGraphics.lineTo(data.containers[0].x + containerWidth, data.containers[0].y);

        game.debug.text(s, 11, 11)
    },

    render: function () { },
};
