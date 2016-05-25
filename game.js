function DataForVisualization(
    deckHeight, 
    containers, 
    attachedContainerIndex, 
    cabinX) {
    this.deckHeight = deckHeight
    this.containers = containers
    this.attachedContainerIndex = attachedContainerIndex
    this.cabinX = cabinX
}

function Container(x, y) {
    this.x = x
    this.y = y
}

var getData = function () {
    var xs = [];
    xs.push(new Container(1, 2))
    var ret = new DataForVisualization(
        Math.random() * 100 + 500, 
        xs, 
        0, 
        Math.random() * 800)

    return ret
}

GameStates.Game = function (game) {

};

GameStates.Game.prototype = {
    create: function () {
    
        var cabinHeight = 100

        this.cabin = this.add.sprite(0, cabinHeight, 'container')
        this.bg = this.add.sprite(0, 0, 'bg')
        this.deck  = this.add.sprite(this.world.centerX, 0, 'deck')
        this.deck.anchor.x = 0.5
        this.deck.anchor.y = 0
    },

    update: function () { 
        var data = getData()

        var trunc = function(s) {
            return String(s).substring(0, 6)
        }

        var s = "Deck Height: " + trunc(data.deckHeight) +
                " cabinX: " + trunc(data.cabinX)

        this.cabin.x = data.cabinX
        this.deck.y  = data.deckHeight

        game.debug.text(s, 11, 11)
    },

    render: function () { },
};
