/**
 * Created by torte on 25.05.2016.
 */

function PortCraneFuzzyLogic(){
    //=====================
    //VERTICAL MOVEMENT
    //=====================
    var verticalMovement = new FuzzyLogicSystem();

    //INPUT PARAMETERS
    //Distance to ship
    verticalMovement.addInputSet(0, "Close", new FuzzyInterval(0, 0, 100, 150));
    verticalMovement.addInputSet(0, "Normal", new FuzzyInterval(100, 150, 250, 300));
    verticalMovement.addInputSet(0, "Far", new FuzzyInterval(250, 300, 500, 500));
    //Vertical speed
    verticalMovement.addInputSet(1, "Very slow", new FuzzyInterval(0, 0, 0.2, 0.5));
    verticalMovement.addInputSet(1, "Slow", new FuzzyInterval(0.2, 0.5, 1, 2));
    verticalMovement.addInputSet(1, "Normal", new FuzzyNumber(1, 2, 3));
    verticalMovement.addInputSet(1, "Fast", new FuzzyInterval(2, 3, 4, 4));
    //ParallaX
    verticalMovement.addInputSet(2, "Close", new FuzzyInterval(0, 0, 10, 15));
    verticalMovement.addInputSet(2, "Normal", new FuzzyInterval(10, 15, 25, 50));
    verticalMovement.addInputSet(2, "Far", new FuzzyInterval(25, 50, 1000, 1000));

    //OUTPUT PARAMETERS
    verticalMovement.addOutputSet("Fast reduce", new FuzzyInterval(-1, -1, -0.7, -0.5));
    verticalMovement.addOutputSet("Reduce", new FuzzyInterval(-0.7, -0.5, -0.2, 0));
    verticalMovement.addOutputSet("Nothing", new FuzzyNumber(-0.2, 0, 0.2));
    verticalMovement.addOutputSet("Increase", new FuzzyInterval(0, 0.5, 1, 1));

    //RULES
    //==========Distance to ship ===Vertical speed==Parallax
    verticalMovement.setRule(["Close", "Very slow", "Close"], "Increase");
    verticalMovement.setRule(["Close", "Slow", "Close"],   "Nothing");
    verticalMovement.setRule(["Close", "Normal", "Close"], "Fast reduce");
    verticalMovement.setRule(["Close", "Fast", "Close"],   "Fast reduce");
    //----------------------------------------------------
    verticalMovement.setRule(["Normal", "Very slow", "Close"], "Increase");
    verticalMovement.setRule(["Normal", "Slow", "Close"],   "Increase");
    verticalMovement.setRule(["Normal", "Normal", "Close"], "Reduce");
    verticalMovement.setRule(["Normal", "Fast", "Close"],   "Fast reduce");
    //----------------------------------------------------
    verticalMovement.setRule(["Far", "Very slow", "Close"], "Increase");
    verticalMovement.setRule(["Far",   "Slow", "Close"], "Increase");
    verticalMovement.setRule(["Far",   "Normal", "Close"], "Increase");
    verticalMovement.setRule(["Far",   "Fast", "Close"], "Nothing");
    //==========Distance to ship ===Vertical speed==Parallax
    verticalMovement.setRule(["Close", "Very slow", "Normal"], "Nothing");
    verticalMovement.setRule(["Close", "Slow", "Normal"],   "Reduce");
    verticalMovement.setRule(["Close", "Normal", "Normal"], "Reduce");
    verticalMovement.setRule(["Close", "Fast", "Normal"],   "Fast reduce");
    //----------------------------------------------------
    verticalMovement.setRule(["Normal", "Very slow", "Normal"], "Reduce");
    verticalMovement.setRule(["Normal", "Slow", "Normal"],   "Reduce");
    verticalMovement.setRule(["Normal", "Normal", "Normal"], "Reduce");
    verticalMovement.setRule(["Normal", "Fast", "Normal"],   "Reduce");
    //----------------------------------------------------
    verticalMovement.setRule(["Far", "Very slow", "Normal"], "Reduce");
    verticalMovement.setRule(["Far",   "Slow", "Normal"], "Reduce");
    verticalMovement.setRule(["Far",   "Normal", "Normal"], "Reduce");
    verticalMovement.setRule(["Far",   "Fast", "Normal"], "Reduce");
    //==========Distance to ship ===Vertical speed==Parallax
    verticalMovement.setRule(["Close", "Very slow", "Far"], "Fast reduce");
    verticalMovement.setRule(["Close", "Slow", "Far"],   "Fast reduce");
    verticalMovement.setRule(["Close", "Normal", "Far"], "Fast reduce");
    verticalMovement.setRule(["Close", "Fast", "Far"],   "Fast reduce");
    //----------------------------------------------------
    verticalMovement.setRule(["Normal", "Very slow", "Far"], "Fast reduce");
    verticalMovement.setRule(["Normal", "Slow", "Far"],   "Fast reduce");
    verticalMovement.setRule(["Normal", "Normal", "Far"], "Fast reduce");
    verticalMovement.setRule(["Normal", "Fast", "Far"],   "Fast reduce");
    //----------------------------------------------------
    verticalMovement.setRule(["Far", "Very slow", "Far"], "Fast reduce");
    verticalMovement.setRule(["Far",   "Slow", "Far"], "Fast reduce");
    verticalMovement.setRule(["Far",   "Normal", "Far"], "Fast reduce");
    verticalMovement.setRule(["Far",   "Fast", "Far"], "Fast reduce");

    //ACCURACY
    verticalMovement.setAccuracy(100);

    this.verticalMovement = verticalMovement;

    //=====================
    //HORIZONTAL MOVEMENT
    //=====================
    var horizontalMovement = new FuzzyLogicSystem();

    //INPUT PARAMETERS
    //parallax
    horizontalMovement.addInputSet(0, "To left", new FuzzyInterval(-1000, -1000, -2, -1));
    horizontalMovement.addInputSet(0, "No chng", new FuzzyNumber(-2, 0, 2));
    horizontalMovement.addInputSet(0, "To right", new FuzzyInterval(1, 2, 1000, 1000));
    //Horizontal speed
    horizontalMovement.addInputSet(1, "Move left", new FuzzyInterval(-1, -1, -0.6, -0.3));
    horizontalMovement.addInputSet(1, "No move", new FuzzyNumber(-0.5, 0, 0.5));
    horizontalMovement.addInputSet(1, "Move right", new FuzzyInterval(0.3, 0.6, 1, 1));

    //OUTPUT PARAMETERS
    horizontalMovement.addOutputSet("Move left", new FuzzyInterval(-1, -1, -0.5, 0));
    horizontalMovement.addOutputSet("Nothing", new FuzzyNumber(-0.5, 0, 0.5));
    horizontalMovement.addOutputSet("Move right", new FuzzyInterval(0, 0.5, 1, 1));

    //RULES
    //==========================Parallax====Speed=========
    horizontalMovement.setRule(["To left" , "Move left" ], "Move right");
    horizontalMovement.setRule(["To left" , "No move"   ], "Move right");
    horizontalMovement.setRule(["To left" , "Move right"], "Nothing");
    //==========================Parallax====Speed=========
    horizontalMovement.setRule(["No chng" , "Move left" ], "Move right");
    horizontalMovement.setRule(["No chng" , "No move"   ], "Nothing");
    horizontalMovement.setRule(["No chng" , "Move right"], "Move left");
    //==========================Parallax====Speed========
    horizontalMovement.setRule(["To right", "Move left" ], "Nothing");
    horizontalMovement.setRule(["To right", "No move"   ], "Move left");
    horizontalMovement.setRule(["To right", "Move right"], "Move left");

    //ACCURACY
    horizontalMovement.setAccuracy(100);

    this.horizontalMovement = horizontalMovement;
}

PortCraneFuzzyLogic.prototype.getVerticalMovement = function(distToShip, containerSpeedY, parralaX){
    var x = this.verticalMovement.calc([distToShip, containerSpeedY, Math.abs(parralaX)]);
    console.log("%d %d %d %d\%", distToShip, containerSpeedY * 10, Math.abs(parralaX), x * 100);
    // console.log("(" + distToShip + ", " + containerSpeedY + ", " + parralaX + "): " + x);
    return x;
    // return this.verticalMovement.calc([distToShip, containerSpeedY, Math.abs(parralaX)]);
}

PortCraneFuzzyLogic.prototype.getHorizontalMovement = function(parallax, containerSpeedX){
    // console.log("xSpeed: " + containerSpeedX);
    // console.log("parallax: " + parallax);
    // var x = this.horizontalMovement.calc([parallax, containerSpeedX]);
    // console.log(x);
    // return x;
    return this.horizontalMovement.calc([parallax, containerSpeedX]);
}