function DataForVisualization(
    deckHeight, 
    containers, 
    attachedContainerIndex, 
    cabinX, 
    cabinY) {
    this.deckHeight = deckHeight
    this.containers = containers
    this.attachedContainerIndex = attachedContainerIndex
    this.cabinX = cabinX
    this.cabinY = cabinY
}

function Container(x, y) {
    this.x = x
    this.y = y
}

var getData = function () {
    var xy = [];
    xy.push(new Container(1, 2))
    var ret = new DataForVisualization(1, xy, Math.random(), Math.random(), Math.random())

    return ret
}

GameStates.Game = function (game) {

};

GameStates.Game.prototype = {
    create: function () {
        this.cabin = this.add.sprite(this.world.centerX, 100, 'container');
        this.deck  = this.add.sprite(this.world.centerX, this.world.centerY, 'container');
    },

    update: function () { 
        var data = getData()
        var s = "Deck Height: " + data.deckHeight +
                " cabinX: " + data.cabinX +
                " cabinY: " + data.cabinY
        this.cabin.x = data.cabinX * game.width
        this.deck.y  = this.world.centerY + data.deckHeight

        game.debug.text(s, 11, 11)
    },

    render: function () { },
};
