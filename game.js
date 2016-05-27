Array.prototype.last = function () { return this[this.length - 1]; }

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
                              changeHoistSpeedX,
                              targetX,
                              targetY) {
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
    this.targetX = targetX
    this.targetY = targetY
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
var MAX_WIND_CHANGE_SPEED = 0.1

var minimapClick = function (z) {
    return function (x) {
        return function() {
            this.targetSlotX = x
            this.targetSlotZ = z
        }
    }
}

var isComplete = false
var SUCCESS_DISTANCE = 1
var COUNT_SUCCESS = 0
var NEED_SUCCESS = 25

var getData = function (targetSlotX, targetSlotZ) {
    var res = null
    if (oldData == null) {
        var xs = [];
        xs.push(new Container(100, 120))
        oldData = new DataForVisualization(
            500,
            xs,
            100, 100,
            0, 0, 0,
            0.1, 0,
            0, 0,
            100, 500)
        currentTime = Math.random()*10
    }
    
    wavesK = global.wavesK

    var containerHeight = game.cache.getImage('container').height
    oldData.deckHeight = 500 + Math.sin(currentTime) * wavesK
    currentTime += CHANGE_TIME

    if (-(oldData.containers.last().y + containerHeight  +
            (Math.floor((oldData.containers.length - 1) / 5) * containerHeight) - oldData.deckHeight) <= SUCCESS_DISTANCE) {
        ++COUNT_SUCCESS
        if (COUNT_SUCCESS == NEED_SUCCESS) {
            isComplete = true
        } else {
            oldData.containers.push(new Container(oldData.hoistX, 120))
            oldData.targetX = 100 + 100 * ((oldData.containers.length - 1) % 5)
            if (oldData.containers.length > 5) {
                oldData.targetX = oldData.containers[oldData.containers.length - 6].x
            }
        }
    }
    oldData.targetY = oldData.deckHeight - Math.floor((oldData.containers.length - 1) / 5) * containerHeight

    for (i = 0; i < oldData.containers.length - 1; ++i) {
        oldData.containers[i].y = oldData.deckHeight - containerHeight;
        oldData.containers[i].y -= containerHeight * Math.floor(i / 5);
    }

    if (isComplete) {
        for (i = 0; i < oldData.containers.length; ++i) {
            oldData.containers[i].y = oldData.deckHeight - containerHeight;
            oldData.containers[i].y -= containerHeight * Math.floor(i / 5);
        }
        return oldData
    }

    {
        oldData.windSpeed = global.windSpeed / 150.0
        var aaa = new PortCraneFuzzyLogic()
        var distX = oldData.containers.last().x - oldData.targetX
        var newSpeedX = aaa.getHorizontalMovement(distX, oldData.containerSpeedX)
        var dist = Math.abs(oldData.deckHeight - oldData.containers.last().y - containerHeight)
        dist -= containerHeight * Math.floor((oldData.containers.length - 1) / 5)
        var newSpeedY = aaa.getVerticalMovement(dist, oldData.containerSpeedY, distX)

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
    return oldData
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
    data.containerSpeedY = Math.max(0, data.containerSpeedY)
}

var doMove = function (data) {
    applyWindAndVerticalSpeed(data)
    data.hoistX += data.hoistSpeedX
    data.containers[data.containers.length - 1].y += data.containerSpeedY
    data.containers[data.containers.length - 1].x += data.containerSpeedX + data.hoistSpeedX * 0.7;
}

var updateWindSpeed = function() {
    if (global.windSpeed < global.windSpeedSlider) {
        global.windSpeed = Math.min(global.windSpeed + MAX_WIND_CHANGE_SPEED,
                                    global.windSpeedSlider)
    } else if (global.windSpeed > global.windSpeedSlider) {
        global.windSpeed = Math.max(global.windSpeed - MAX_WIND_CHANGE_SPEED,
                                    global.windSpeedSlider)
    }
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
        this.hoist.anchor.x = 0.295
        this.rails.anchor.y = 0.1

        this.ropeGraphics = game.add.graphics(0, 0);

        this.target = game.add.sprite(0, 0, 'target')
        this.target.anchor.x = 0.5
        this.target.anchor.y = 1.0


        var maxContainers = 50
        this.containers = []
        for (i = 0; i < maxContainers; ++i) {
            var newSprite = this.add.sprite(-1000, -1000, 'container')
            newSprite.visible = false
            this.containers.push(newSprite)
        }
    },

    update: function () {
        updateWindSpeed()
        var data = getData(this.targetSlotX, this.targetSlotZ)


        var trunc = function (s) {
            return String(s).substring(0, 6)
        }

        var s = "deckHeight: " + trunc(data.deckHeight) +
            " hoistX: " + trunc(data.hoistX)

        var cw = this.cache.getImage('container').width

        this.hoist.x = data.hoistX
        this.deck.y = data.deckHeight
        this.target.x = data.targetX + cw / 2
        this.target.y = data.targetY

        this.targetSlotX = 0
        this.targetSlotZ = 0

        // create minimap
        var slotsX = 5
        var slotsZ = 3
        for (var i = 0; i < slotsX; ++i) {
            for (var j = 0; j < slotsZ; ++j) {
                var x = 600 + i * 32
                var y = 32 + j * 32 
                this.button = game.add.button(x, y, 
                                              'square', 
                                              minimapClick(j)(i), 
                                              this);
                
            }
        }


        for (var i = 0; i < data.containers.length; ++i) {
            this.containers[i].x = data.containers[i].x
            this.containers[i].y = data.containers[i].y
            this.containers[i].visible = true
        }
        
        var g = this.ropeGraphics;
        g.clear()
        
        if (!isComplete) {
            var rw = 4, leftRopeX = data.hoistX, topRopeY = data.hoistY + 9,
                cx = data.containers[data.containers.length - 1].x,
                cy = data.containers[data.containers.length - 1].y;

            g.lineStyle(rw, 0x333333, 1);

            // left & right ropes
            g.moveTo(rw / 2 + leftRopeX, topRopeY);
            g.lineTo(rw / 2 + cx, cy);

            g.moveTo(cw - rw / 2 + leftRopeX, topRopeY);
            g.lineTo(cw - rw / 2 + cx, cy);

            // circles near to box
            g.lineStyle(0);
            g.beginFill(0xFFFF0B, 0.5);
            g.drawCircle(cx + rw / 2, cy, 6);
            g.drawCircle(cw + cx - rw / 2, cy, 6);
            g.endFill();
        }
        game.debug.text('wind: ' + global.windSpeed, 11, 11)
    },

    render: function () {
    },
};
