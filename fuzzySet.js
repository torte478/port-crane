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
        return new FuzzyNumber(this.xLeft, this.xTop, this.xRight);
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
 FUZZY LOGIC SYSTEM
 ===================================
 */

function FuzzyLogicSystem(){
    this.inputSystem = {};
    this.outputSystem = {};
    this.ruleMapping = {};
}

FuzzyLogicSystem.prototype.setRule = function(from, to){
    if (!(from in this.inputSystem))
        throw new Error("Input system not contains current key");
    if (!(to in this.outputSystem))
        throw new Error("Output system not contains current key");

    this.ruleMapping[from] = to;
}

FuzzyLogicSystem.prototype.calc = function(inputValue)
{
    //var resultShape = new Shape();
    for(var key in this.inputSystem){
        if (!(key in this.ruleMapping))
            throw new Error("There is not that rule");
        var grade = this.inputSystem[key].getMembershipGrade(inputValue);
        var outputSet = this.outputSystem[this.ruleMapping[key]];
        //resultShape.add(outputSet.getFuzzySetFromGrade(grade), grade);
    }
    //return resultShape.evaluate();
    return 0;
}