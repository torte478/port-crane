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
    verticalMovement.addInputSet(1, "Slow", new FuzzyInterval(0, 0, 1, 2));
    verticalMovement.addInputSet(1, "Normal", new FuzzyNumber(1, 2, 3));
    verticalMovement.addInputSet(1, "Fast", new FuzzyInterval(2, 3, 4, 4));

    //OUTPUT PARAMETERS
    verticalMovement.addOutputSet("Reduce", new FuzzyInterval(-0.005, -0.005, -0.0005, 0));
    verticalMovement.addOutputSet("Nothing", new FuzzyNumber(-0.0005, 0, 0.0005));
    verticalMovement.addOutputSet("Increase", new FuzzyInterval(0, 0.0005, 0.002, 0.002));

    //RULES
    //==========Distance to ship ===Vertical speed=====
    verticalMovement.setRule(["Close", "Slow"], "Nothing");
    verticalMovement.setRule(["Close", "Normal"], "Reduce");
    verticalMovement.setRule(["Close", "Fast"], "Reduce");
    //----------------------------------------------------
    verticalMovement.setRule(["Normal", "Slow"], "Increase");
    verticalMovement.setRule(["Normal", "Normal"], "Nothing");
    verticalMovement.setRule(["Normal", "Fast"], "Reduce");
    //----------------------------------------------------
    verticalMovement.setRule(["Far",   "Slow"], "Increase");
    verticalMovement.setRule(["Far",   "Normal"], "Increase");
    verticalMovement.setRule(["Far",   "Fast"], "Nothing");

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

PortCraneFuzzyLogic.prototype.getVerticalMovement = function(distToShip, containerSpeedY){
    // console.log("speedY: " + containerSpeedY);
    // console.log("distToShip: " + distToShip);
    return this.verticalMovement.calc([distToShip, containerSpeedY]);
}

PortCraneFuzzyLogic.prototype.getHorizontalMovement = function(parallax, containerSpeedX){
    // console.log("xSpeed: " + containerSpeedX);
    // console.log("parallax: " + parallax);
    // var x = this.horizontalMovement.calc([parallax, containerSpeedX]);
    // console.log(x);
    // return x;
    return this.horizontalMovement.calc([parallax, containerSpeedX]);
}