/**
 * Created by torte on 24.05.2016.
 */

/*
 ===================================
 FUZZY SET
 ===================================
 */

function FuzzySet(){}

FuzzySet.prototype.getMembershipGrade = function(x){
    return 0;
}

FuzzySet.prototype.getFuzzySetFromGrade = function(y){
    return 0;
}

/*
===================================
FUZZY NUMBER
 ===================================
 */
var parentFuzzyNumber = new FuzzySet();
function FuzzyNumber(xLeft, xTop, xRight){
    if (xLeft >= xRight)
        throw new Error("xLeft should be smaller than xRight");
    if (xTop < xLeft || xTop > xRight)
        throw new Error("xTop should be between xLeft and xRight");

    this.xLeft = xLeft;
    this.xTop = xTop;
    this.xRight = xRight;
}
FuzzyNumber.prototype = parentFuzzyNumber;

FuzzyNumber.prototype.getMembershipGrade = function(x){
    if (x < this.xLeft || x > this.xRight)
        return 0;
    if (x == this.xTop)
        return 1;

    var side = 0;
    if (x < this.xTop)
        side = (x - this.xLeft);
    else
        side = (this.xRight - x);

    return side / (this.xTop - this.xLeft);
}

FuzzyNumber.prototype.getFuzzySetFromGrade = function(y)
{
    if (y > 1 || y < 0)
        throw new Error("Membership grade should be between 0 and 1");

    if (y == 1)
        return new FuzzyInterval(this.xLeft, this.xTop, this.xTop, this.xRight);
    if (y == 0)
        return 0;

    var side = (1 - y) * (this.xRight - this.xLeft) / 2;
    return new FuzzyInterval(
        this.xLeft,
        this.xTop - side,
        this.xTop + side,
        this.xRight
    );
}

/*
 ===================================
 FUZZY INTERVAL
 ===================================
 */
var parentFuzzyInterval = new FuzzySet();
function FuzzyInterval(xLeft, xTopLeft, xTopRight, xRight){
    if (xLeft >= xRight)
        throw new Error("xLeft should be smaller than xRight");
    if (xTopLeft > xTopRight)
        throw new Error("xLeftTop should be smaller than xTopRight");
    if (xTopLeft < xLeft || xTopRight > xRight)
        throw new Error("Top should be between bottom");

    this.xLeft = xLeft;
    this.xTopLeft = xTopLeft;
    this.xTopRight = xTopRight;
    this.xRight = xRight;
}
FuzzyInterval.prototype = parentFuzzyInterval;

FuzzyInterval.prototype.getMembershipGrade = function(x){
    if (x < this.xLeft || x > this.xRight)
        return 0;
    if (x >= this.xTopLeft && x <= this.xTopRight)
        return 1;

    var res = 0;
    if (x < this.xTopLeft)
        res = (x - this.xLeft) / (this.xTopLeft - this.xLeft);
    else
        res = (this.xRight - x) / (this.xRight - this.xTopRight);
    return res;
}

FuzzyInterval.prototype.getFuzzySetFromGrade = function(y)
{
    if (y > 1 || y < 0)
        throw new Error("Membership grade should be between 0 and 1");

    if (y == 1)
        return new FuzzyInterval(this.xLeft, this.xTopLeft, this.xTopRight, this.xRight);
    if (y == 0)
        return 0;

    return new FuzzyInterval(
        this.xLeft,
        this.xTopLeft - (this.xTopLeft - this.xLeft) * (1 - y),
        this.xTopRight + (this.xRight - this.xTopRight) * (1 - y),
        this.xRight
    );
}

/*
 ===================================
 GEOMETRY SYSTEM
 ===================================
 */

function GeometrySystem(leftBorder, rightBorder, stepCount)
{
    if (leftBorder >= rightBorder)
        throw new Error("leftBorder should be smaller than rightBorder");
    if (stepCount <= 0)
        throw new Error("stepCount should be greater than 0");

    this.leftBorder = leftBorder;
    this.rightBorder = rightBorder;
    this.stepCount = stepCount;

    this.shape = new Array();
    this.step = (rightBorder - leftBorder) / stepCount;
    for (var i = 0; i < stepCount; ++i)
        this.shape[i] = 0;
}

GeometrySystem.prototype.evaluate = function(){
    var xm = 0;
    var M = 0;
    for (var i = 0; i < this.stepCount; ++i)
    {
        xm += (this.leftBorder + i * this.step) * this.shape[i];
        M += this.shape[i];
    }
    if (M == 0)
        return 0;

    return xm / M;
}

GeometrySystem.prototype.add = function(fuzzyInterval, grade){
    if (fuzzyInterval.xLeft < this.leftBorder || fuzzyInterval.xRight > this.rightBorder)
        throw new Error("New shape should be bertween leftBorder and rightBorder");
    if (grade < 0 || grade > 1)
        throw new Error("Grade should be between 0 and 1");

    for (var i = 0; i < this.stepCount; ++i) {
        var pos = this.leftBorder + i * this.step;
        if (pos >= fuzzyInterval.xLeft && pos <= fuzzyInterval.xRight) {
            var currentValue = 0;
            if (pos >= fuzzyInterval.xTopLeft && pos <= fuzzyInterval.xTopRight)
                currentValue = grade;
            else if (pos <= fuzzyInterval.xTopLeft)
                currentValue = grade * (pos - fuzzyInterval.xLeft) / (fuzzyInterval.xTopLeft - fuzzyInterval.xLeft);
            else
                currentValue = grade * (fuzzyInterval.xRight - pos) / (fuzzyInterval.xRight - fuzzyInterval.xTopRight);

            this.shape[i] = Math.max(this.shape[i], currentValue);
        }
    }
}

GeometrySystem.prototype.print = function(){
    console.log("shape:");
    for (var height = 1; height >= 0; height -= 0.1)
    {
        var s = "";
        for (var i = 0; i < this.stepCount; ++i)
            if (this.shape[i] >= height)
                s += ":";
            else
                s += " ";
        console.log(s);
    }
    var s = ""
    for (var i = 0; i < this.stepCount; ++i)
        s += "-";
    console.log(s);
}

/*
 ===================================
 FUZZY LOGIC SYSTEM
 ===================================
 */

function FuzzyLogicSystem(){
    this.inputSystem = {};
    this.outputSystem = {};
    this.ruleMapping = {};

    this.leftBorder = "NULL";
    this.rightBorder = "NULL";
    this.accuracy = 100;
}

FuzzyLogicSystem.prototype.setRule = function(from, to){
    if (!(from in this.inputSystem))
        throw new Error("Input system not contains current key");
    if (!(to in this.outputSystem))
        throw new Error("Output system not contains current key");

    this.ruleMapping[from] = to;
}

FuzzyLogicSystem.prototype.addInputSet = function(name, fuzzySet){
    this.inputSystem[name] = fuzzySet;
}

FuzzyLogicSystem.prototype.addOutputSet = function(name, fuzzySet){
    this.outputSystem[name] = fuzzySet;

    if (this.leftBorder == "NULL")
    {
        this.leftBorder = fuzzySet.xLeft;
        this.rightBorder = fuzzySet.xRight;
    }
    else
    {
        this.leftBorder = Math.min(this.leftBorder, fuzzySet.xLeft);
        this.rightBorder = Math.max(this.rightBorder, fuzzySet.xRight);
    }
}

FuzzyLogicSystem.prototype.setAccuracy = function(accuracy){
    if (accuracy <= 0)
        throw new Error("Accuracy should be positive");
    this.accuracy = accuracy;
}

FuzzyLogicSystem.prototype.calc = function(inputValue)
{
    if (this.leftBorder == "NULL")
        return 0;

    var resultShape = new GeometrySystem(this.leftBorder, this.rightBorder, this.accuracy);
    for(var key in this.inputSystem){
        if (!(key in this.ruleMapping))
            throw new Error("There is not that rule");

        var grade = this.inputSystem[key].getMembershipGrade(inputValue);
        var outputSet = this.outputSystem[this.ruleMapping[key]];
        resultShape.add(outputSet.getFuzzySetFromGrade(grade), grade);
    }
    return resultShape.evaluate();
}