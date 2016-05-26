/**
 * Created by torte on 25.05.2016.
 */

function PortCraneFuzzyLogic(){
    //=====================
    //VERTICAL MOVEMENT
    //=====================
    var verticalMovement = new FuzzyLogicSystem();

    //ВХОДНЫЕ ПАРАМЕТРЫ
    //Расстояние до палубы
    verticalMovement.addInputSet(0, "Close", new FuzzyInterval(0, 0, 3, 4));
    verticalMovement.addInputSet(0, "Far", new FuzzyInterval(3, 4, 500, 500));
    //Скорость спуска груза
    verticalMovement.addInputSet(1, "Slow", new FuzzyInterval(0, 0, 1, 2));
    verticalMovement.addInputSet(1, "Fast", new FuzzyInterval(1, 2, 4, 4));

    //ВЫХОДНЫЕ ПАРАМЕТРЫ
    verticalMovement.addOutputSet("Reduce", new FuzzyInterval(-1, -1, -0.5, 0));
    verticalMovement.addOutputSet("Nothing", new FuzzyNumber(-0.5, 0, 0.5));
    verticalMovement.addOutputSet("Increase", new FuzzyInterval(0, 0.5, 1, 1));

    //ПРАВИЛА
    //==========Расстояние до палубы===Скорость спуска груза=====
    verticalMovement.setRule(["Close", "Slow"], "Nothing");
    verticalMovement.setRule(["Close", "Fast"], "Reduce");
    //----------------------------------------------------
    verticalMovement.setRule(["Far",   "Slow"], "Increase");
    verticalMovement.setRule(["Far",   "Fast"], "Nothing");

    //ТОЧНОСТЬ
    verticalMovement.setAccuracy(100);

    this.verticalMovement = verticalMovement;

    //=====================
    //HORIZONTAL MOVEMENT
    //=====================
    var horizontalMovement = new FuzzyLogicSystem();

    //ВХОДНЫЕ ПАРАМЕТРЫ
    //Смещение от цели по X
    horizontalMovement.addInputSet(0, "To left", new FuzzyInterval(-5, -5, -2, -1));
    horizontalMovement.addInputSet(0, "No chng", new FuzzyNumber(-2, 0, 2));
    horizontalMovement.addInputSet(0, "To right", new FuzzyInterval(1, 2, 5, 5));
    //Скорость контейнера по Х
    horizontalMovement.addInputSet(1, "Move left", new FuzzyInterval(-5, -5, -2, -1));
    horizontalMovement.addInputSet(1, "No move", new FuzzyNumber(-2, 0, 2));
    horizontalMovement.addInputSet(1, "Move right", new FuzzyInterval(1, 2, 5, 5));

    //ВЫХОДНЫЕ ПАРАМЕТРЫ
    horizontalMovement.addOutputSet("Move left", new FuzzyInterval(-1, -1, -0.5, 0));
    horizontalMovement.addOutputSet("Nothing", new FuzzyNumber(-0.5, 0, 0.5));
    horizontalMovement.addOutputSet("Move right", new FuzzyInterval(0, 0.5, 1, 1));

    //ПРАВИЛА
    //==========================Смещение====Контейнер=========
    horizontalMovement.setRule(["To left" , "Move left" ], "Move right");
    horizontalMovement.setRule(["To left" , "No move"   ], "Move right");
    horizontalMovement.setRule(["To left" , "Move right"], "Nothing");
    //==========================Смещение====Контейнер=========
    horizontalMovement.setRule(["No chng" , "Move left" ], "Move right");
    horizontalMovement.setRule(["No chng" , "No move"   ], "Nothing");
    horizontalMovement.setRule(["No chng" , "Move right"], "Move left");
    //==========================Смещение====Контейнер========
    horizontalMovement.setRule(["To right", "Move left" ], "Nothing");
    horizontalMovement.setRule(["To right", "No move"   ], "Move left");
    horizontalMovement.setRule(["To right", "Move right"], "Move left");

    //ТОЧНОСТЬ
    horizontalMovement.setAccuracy(100);

    this.horizontalMovement = horizontalMovement;
}

PortCraneFuzzyLogic.prototype.getVerticalMovement = function(distToShip, containerSpeedY){
    return this.verticalMovement.calc([distToShip, containerSpeedY]);
}

PortCraneFuzzyLogic.prototype.getHorizontalMovement = function(parallax, containerSpeedX){
    return this.horizontalMovement.calc([parallax, containerSpeedX]);
}