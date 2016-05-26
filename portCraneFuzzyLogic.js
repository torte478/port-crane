/**
 * Created by torte on 25.05.2016.
 */

function PortCraneFuzzyLogic(){
    //VERTICAL MOVEMENT
    var verticalMovement = new FuzzyLogicSystem();

    verticalMovement.addInputSet("Very close", new FuzzyInterval(0, 0, 2, 5));
    verticalMovement.addInputSet("Close", new FuzzyInterval(2, 5, 8, 10));
    verticalMovement.addInputSet("Normal", new FuzzyInterval(7, 10, 15, 20));
    verticalMovement.addInputSet("Far", new FuzzyInterval(16, 20, 25, 30));
    verticalMovement.addInputSet("Very far", new FuzzyInterval(25, 30, 50, 50));

    verticalMovement.addOutputSet("Very slow", new FuzzyInterval(0, 0, 1, 2));
    verticalMovement.addOutputSet("Slow", new FuzzyInterval(1, 2, 3, 4));
    verticalMovement.addOutputSet("Normal", new FuzzyInterval(3, 4, 5, 6));
    verticalMovement.addOutputSet("Fast", new FuzzyInterval(5, 6, 7, 8));
    verticalMovement.addOutputSet("Very fast", new FuzzyInterval(7, 8, 9, 10));

    verticalMovement.setRule("Very close", "Very slow");
    verticalMovement.setRule("Close", "Slow");
    verticalMovement.setRule("Normal", "Normal");
    verticalMovement.setRule("Far", "Fast");
    verticalMovement.setRule("Very far", "Very fast");

    verticalMovement.setAccuracy(1000);

    this.verticalMovement = verticalMovement;

    //HORIZONTAL MOVEMENT
    var horizontalMovement = new FuzzyLogicSystem();

    horizontalMovement.addInputSet("Left", new FuzzyInterval(-20, -20, -10, -5));
    horizontalMovement.addInputSet("Center", new FuzzyInterval(-10, -5, 5, 10));
    horizontalMovement.addInputSet("Right", new FuzzyInterval(5, 10, 20, 20));

    horizontalMovement.addOutputSet("Move left", new FuzzyInterval(-10, -10, -5, -2));
    horizontalMovement.addOutputSet("Don't move", new FuzzyInterval(-5, -2, 2, 5));
    horizontalMovement.addOutputSet("Move right", new FuzzyInterval(2, 5, 10, 10));

    horizontalMovement.setRule("Left", "Move right");
    horizontalMovement.setRule("Center", "Don't move");
    horizontalMovement.setRule("Right", "Move left");

    horizontalMovement.setAccuracy(100);

    this.horizontalMovement = horizontalMovement;
}

PortCraneFuzzyLogic.prototype.getVerticalMovement = function(distToShip, currentSpeedY){
    return 0;//this.verticalMovement.calc(distToShip);
}

PortCraneFuzzyLogic.prototype.getHorizontalMovement = function(wind, containerSpeedX, cabinSpeedX){
    return 0;//this.horizontalMovement.calc(windDeviation);
}
