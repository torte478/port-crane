function DataForVisualization(
    deckHeight,
    containers,
    hoistX,
    hoistY,
    containerSpeedX,
    containerSpeedY,
    hoistSpeedX,
    containerWeight,
    windSpeed,
    changeContainerSpeedY,
    changeHoistSpeedX) {
    this.deckHeight = deckHeight
    this.containers = containers
    this.hoistX = hoistX
    this.hoistY = hoistY
    this.containerSpeedX = containerSpeedX
    this.containerSpeedY = containerSpeedY
    this.hoistSpeedX = hoistSpeedX
    this.containerWeight = containerWeight
    this.windSpeed = windSpeed
    this.changeContainerSpeedY = changeContainerSpeedY
    this.changeHoistSpeedX = changeHoistSpeedX
}

function Container(x, y) {
    this.x = x
    this.y = y
}

var oldData = null

var getData = function () {
    var res = null
    if (oldData == null) {
        var xs = [];
        xs.push(new Container(450, 140))
        oldData = new DataForVisualization(
            500,
            xs,
            400, 100,
            0, 1, 0,
            0.1, 0,
            0, 0)
    }

    doMove(oldData)
    res = oldData
    return res
}

var applyWindAndVerticalSpeed = function (data) {
    var curX = data.containers[data.containers.length - 1].x
    var curY = data.containers[data.containers.length - 1].y
    var distToCabin = Math.sqrt((curX - data.hoistX) * (curX - data.hoistX) +
                                (curY - data.hoistY) * (curY - data.hoistY))
    var sinPhi = Math.abs(curX - data.hoistX) / distToCabin
    var cosPhi = Math.abs(curY - data.hoistY) / distToCabin
    var resultSpeed = data.containerSpeedX
    if (curX < data.hoistX) {
        resultSpeed += sinPhi * data.containerWeight
    }
    if (curX > data.hoistX) {
        resultSpeed -= sinPhi * data.containerWeight
    }
    resultSpeed += cosPhi * data.windSpeed
    resultSpeed *= 0.97
    data.containerSpeedX = resultSpeed
    data.containerSpeedY += data.changeContainerSpeedY
    data.hoistSpeedX += data.changeHoistSpeedX
    data.hoistSpeedX *= 0.99
}

var doMove = function (data) {
    applyWindAndVerticalSpeed(data)
    data.hoistX += data.hoistSpeedX
    data.containers[data.containers.length - 1].y += data.containerSpeedY
    data.containers[data.containers.length - 1].x += data.containerSpeedX
}

GameStates.Game = function (game) {

};



GameStates.Game.prototype = {
    create: function () {
        var hoistHeight = 100
        this.hoist = this.add.sprite(0, 0, 'hoist')
        this.rails = this.add.sprite(0, 0, 'rails')
        this.bg = this.add.sprite(0, 0, 'bg')
        this.deck = this.add.sprite(this.world.centerX, 0, 'deck')
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

        var trunc = function (s) {
            return String(s).substring(0, 6)
        }

        var s = "deckHeight: " + trunc(data.deckHeight) +
                " hoistX: " + trunc(data.hoistX)

        this.hoist.x = data.hoistX
        this.deck.y = data.deckHeight

        for (i = 0; i < data.containers.length; ++i) {
            this.containers[i].x = data.containers[i].x
            this.containers[i].y = data.containers[i].y
            this.containers[i].visible = true
        }

        this.ropeGraphics.clear()
        this.ropeGraphics.lineStyle(8, 0x333333);
        this.ropeGraphics.moveTo(data.hoistX, data.hoistY);
        this.ropeGraphics.lineTo(data.containers[0].x, data.containers[0].y);
        var containerWidth = 100 // todo
        this.ropeGraphics.moveTo(data.hoistX + containerWidth, 100);
        this.ropeGraphics.lineTo(data.containers[0].x + containerWidth, data.containers[0].y);

        game.debug.text(s, 11, 11)
    },

    render: function () { },
};