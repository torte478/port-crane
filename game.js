function DataForVisualization(deckHeight,
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
var MAX_CONTAINER_SPEED_Y = 4
var MAX_CHANGE_SPEED = 0.1
var MAX_HOIST_SPEED_X = 1
var currentTime = 0
var CHANGE_TIME = 0.01
var wavesK = 25
var CONTAINER_WIDTH = 100

// Максимальное расстояние до палубы
var getMaxDistanceToDeck = function () {
    return 500 + wavesK - 120
}

// Расстояние, на котором груз считается установленным
var getOkDistance = function () {
    return 2
}

// Максимальная скорость спуска груза
var getMaxSpeedY = function () {
    return MAX_CONTAINER_SPEED_Y
}

// Максимально возможная скорость стыковки
var getMaxDockingSpeed = function () {
    return MAX_CONTAINER_SPEED_Y / 4
}

// Максимальное отклонение от цели в сторону
var getMaxDeviationFromTarget = function () {
    return CONTAINER_WIDTH / 10
}

// Максимально допустимое отклонение
var getMaxDeviationFromZero = function () {
    return 30
}

// Максимальная скорость по Х
var getMaxSpeedX = function () {
    return hyi
}

// Максимально допустимая скорость по Х для стыковки

var isComplete = false

var SUCCESS_DISTANCE = 2
var TARGET_X = 100
var COUNT_SUCCESS = 0
var NEED_SUCCESS = 25

var getData = function () {
    var res = null
    if (oldData == null) {
        var xs = [];
        xs.push(new Container(400, 120))
        oldData = new DataForVisualization(
            500,
            xs,
            400, 100,
            0, 0, 0,
            0.1, 0,
            0, 0)
    }

    oldData.deckHeight = 500 + Math.sin(currentTime) * wavesK
    currentTime += CHANGE_TIME

    if (Math.abs(oldData.containers[oldData.containers.length - 1].y + game.cache.getImage('container').height  +
            (Math.floor((oldData.containers.length - 1) / 5) * game.cache.getImage('container').height) - oldData.deckHeight) <= SUCCESS_DISTANCE) {
        ++COUNT_SUCCESS
        if (COUNT_SUCCESS == NEED_SUCCESS) {
            isComplete = true
        } else {
            oldData.containers.push(new Container(oldData.containers[oldData.containers.length - 1].x, 120))
            TARGET_X = 100 + 125 * ((oldData.containers.length - 1) % 5)
        }
    }

    for (i = 0; i < oldData.containers.length - 1; ++i) {
        oldData.containers[i].y = oldData.deckHeight - game.cache.getImage('container').height;
        oldData.containers[i].y -= game.cache.getImage('container').height * Math.floor(i / 5);
    }

    if (isComplete) {
        for (i = 0; i < oldData.containers.length; ++i) {
            oldData.containers[i].y = oldData.deckHeight - game.cache.getImage('container').height;
            oldData.containers[i].y -= game.cache.getImage('container').height * Math.floor(i / 5);
        }
        return oldData
    }

    {
        oldData.windSpeed = global.windSpeed / 150.0
        var aaa = new PortCraneFuzzyLogic()
        var distX = oldData.containers[oldData.containers.length - 1].x - TARGET_X
        var newSpeedX = aaa.getHorizontalMovement(distX, oldData.containerSpeedX)
        var dist = Math.abs(oldData.deckHeight - oldData.containers[oldData.containers.length - 1].y - game.cache.getImage('container').height)
        dist -= game.cache.getImage('container').height * Math.floor((oldData.containers.length - 1) / 5)
        var newSpeedY = aaa.getVerticalMovement(dist, oldData.containerSpeedY)
        newSpeedX *= MAX_HOIST_SPEED_X
        newSpeedY *= MAX_CONTAINER_SPEED_Y
        if (newSpeedX > 0)
            newSpeedX = Math.min(newSpeedX, MAX_CHANGE_SPEED)
        if (newSpeedX < 0)
            newSpeedX = Math.max(newSpeedX, -MAX_CHANGE_SPEED)
        if (newSpeedY > 0)
            newSpeedY = Math.min(newSpeedY, MAX_CHANGE_SPEED)
        if (newSpeedY < 0)
            newSpeedY = Math.max(newSpeedY, -MAX_CHANGE_SPEED)
        oldData.changeContainerSpeedY = newSpeedY
        oldData.changeHoistSpeedX = newSpeedX
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
    resultSpeed *= 0.93
    data.containerSpeedX = resultSpeed
    data.containerSpeedY += data.changeContainerSpeedY
    data.hoistSpeedX += data.changeHoistSpeedX
    data.hoistSpeedX *= 0.9
    if (data.hoistSpeedX > 0)
        data.hoistSpeedX = Math.min(data.hoistSpeedX, MAX_HOIST_SPEED_X)
    if (data.hoistSpeedX < 0)
        data.hoistSpeedX = Math.max(data.hoistSpeedX, -MAX_HOIST_SPEED_X)
    if (data.containerSpeedY > 0)
        data.containerSpeedY = Math.min(data.containerSpeedY, MAX_CONTAINER_SPEED_Y)
    if (data.containerSpeedY < 0)
        data.containerSpeedY = Math.max(data.containerSpeedY, -MAX_CONTAINER_SPEED_Y)
    if (Math.abs(data.containers[data.containers.length - 1].x - TARGET_X) > 100)
        data.containerSpeedY = 0
}

var doMove = function (data) {
    applyWindAndVerticalSpeed(data)
    data.hoistX += data.hoistSpeedX
    data.containers[data.containers.length - 1].y += data.containerSpeedY
    data.containers[data.containers.length - 1].x += data.containerSpeedX + data.hoistSpeedX * 0.7;
}

GameStates.Game = function (game) {

};

GameStates.Game.prototype = {
    create: function () {
        this.bg = this.add.sprite(0, 0, 'bg')
        this.deck = this.add.sprite(this.world.centerX, 0, 'deck')
        this.deck.anchor.x = 0.5
        this.deck.anchor.y = 0
        this.rails = this.add.sprite(0, 0, 'rails')
        this.hoist = this.add.sprite(0, 100, 'hoist')
        this.hoist.anchor.y = 0.7
        this.hoist.anchor.x = 0.1
        this.rails.anchor.y = 0.1

        this.ropeGraphics = game.add.graphics(0, 0);

        this.target = game.add.sprite(0, 0, 'target')
        this.target.anchor.x = 0.5
        this.target.anchor.y = 1.0


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
        this.target.x = TARGET_X
        this.target.y = data.deckHeight

        for (i = 0; i < data.containers.length; ++i) {
            this.containers[i].x = data.containers[i].x
            this.containers[i].y = data.containers[i].y
            this.containers[i].visible = true
        }

        this.ropeGraphics.clear()
        if (!isComplete) {
            this.ropeGraphics.lineStyle(4, 0x333333);
            this.ropeGraphics.moveTo(data.hoistX, data.hoistY);
            var cx = data.containers[data.containers.length - 1].x
            var cy = data.containers[data.containers.length - 1].y
            this.ropeGraphics.lineTo(cx, cy);
            var containerWidth = this.cache.getImage('container').width
            this.ropeGraphics.moveTo(data.hoistX + containerWidth, 100);
            this.ropeGraphics.lineTo(cx + containerWidth, cy);
        }
    },

    render: function () {
    },
};
