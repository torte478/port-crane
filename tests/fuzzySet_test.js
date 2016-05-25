/**
 * Created by torte on 24.05.2016.
 */

QUnit.test( "fuzzyNumber constructor", function (assert){
    var number = new FuzzyNumber(0, 5, 10);
    assert.ok(
        (number.xLeft == 0) &&
            (number.xTop == 5) &&
            (number.xRight == 10)
        , "Constructor is correct");
});

 QUnit.test( "fuzzyNumber constructor exception", function (assert){
     assert.throws(
         function() {FuzzyNumber(0, 5, -4)},
         Error,
        "Throws exception on wrong data (xRight smaller than xLeft");
 });

QUnit.test( "fuzzyNumber constructor exception1", function (assert){
    assert.throws(
        function() {FuzzyNumber(0, 20, 10)},
        Error,
        "Throws exception on wrong data (xTop greater than xRight)");
});

QUnit.test( "fuzzyNumber getMembershipGrade", function (assert){
    var number = new FuzzyNumber(0, 5, 10);
    assert.equal(
        number.getMembershipGrade(20),
        0,
        "Returns 0 when element isn't member of set"
    )
});

QUnit.test( "fuzzyNumber getMembershipGrade1", function (assert){
    var number = new FuzzyNumber(0, 5, 10);
    assert.equal(
        number.getMembershipGrade(5),
        1,
        "Returns 1 when element is complete member of set"
    )
});

QUnit.test( "fuzzyNumber getMembershipGrade2", function (assert){
    var number = new FuzzyNumber(0, 5, 10);
    assert.ok(
        Math.abs(number.getMembershipGrade(2) - 0.4) < 0.001,
        "Calc grade of membership correctly when element is fuzzy (smaller than top)"
    )
});

QUnit.test( "fuzzyNumber getMembershipGrade3", function (assert){
    var number = new FuzzyNumber(0, 5, 10);
    assert.ok(
        Math.abs(number.getMembershipGrade(9) - 0.2) < 0.001,
        "Calc grade of membership correctly when element is fuzzy (greater than top)"
    )
});

QUnit.test( "fuzzyInterval constructor", function (assert){
    var interval = new FuzzyInterval(0, 4, 8, 10);
    assert.ok(
        interval.xLeft == 0 &&
            interval.xTopLeft == 4 &&
            interval.xTopRight == 8 &&
            interval.xRight == 10,
        "Constructor is correct"
    )
});

QUnit.test( "fuzzyInterval constructor exception", function (assert){
    assert.throws(
        function() {FuzzyInterval(0, 4, 8, -10)},
        Error,
        "Throws exception on wrong data (xLeft greater than xRight)");
});

QUnit.test( "fuzzyInterval constructor exception1", function (assert){
    assert.throws(
        function() {FuzzyInterval(0, 4, 2, 10)},
        Error,
        "Throws exception on wrong data (xTopLeft greater than xTopRight)");
});

QUnit.test( "fuzzyInterval constructor exception2", function (assert){
    assert.throws(
        function() {FuzzyInterval(0, -3, 4, 10)},
        Error,
        "Throws exception on wrong data (xLeft greater than xTopLeft)");
});

QUnit.test( "fuzzyInterval constructor exception3", function (assert){
    assert.throws(
        function() {FuzzyInterval(0, 3, 14, 10)},
        Error,
        "Throws exception on wrong data (xTopRight greater than xRight)");
});

QUnit.test( "fuzzyInterval getMembershipGrade", function (assert){
    var interval = new FuzzyInterval(0, 4, 8, 10);
    assert.equal(interval.getMembershipGrade(100),
        0,
        "Returns 0 when element isn't member of set");
});

QUnit.test( "fuzzyInterval getMembershipGrade1", function (assert){
    var interval = new FuzzyInterval(0, 4, 8, 10);
    assert.equal(interval.getMembershipGrade(6),
        1,
        "Returns 1 when element is complete member of set");
});

QUnit.test( "fuzzyInterval getMembershipGrade2", function (assert){
    var interval = new FuzzyInterval(0, 4, 8, 10);
    assert.ok(
        Math.abs(interval.getMembershipGrade(3) - 0.75) < 0.001,
        "Calc grade of membership correctly when element is fuzzy (smaller than xTopLeft)"
    )
});

QUnit.test( "fuzzyInterval getMembershipGrade3", function (assert){
    var interval = new FuzzyInterval(0, 4, 8, 10);
    assert.ok(
        Math.abs(interval.getMembershipGrade(9) - 0.5) < 0.001,
        "Calc grade of membership correctly when element is fuzzy (greater than xTopRight)"
    )
});

QUnit.test( "fuzzyNumber getFuzzySetFromGrade", function (assert){
    var number = new FuzzyNumber(0, 5, 10);
    var fuzzySet = number.getFuzzySetFromGrade(1);
    assert.ok(
        fuzzySet.xLeft == 0 &&
            fuzzySet.xTop == 5 &&
            fuzzySet.xRight == 10,
        "Return equal fuzzy set when grade is 1)");
});

QUnit.test( "fuzzyNumber getFuzzySetFromGrade exception", function (assert){
    var number = new FuzzyNumber(0, 5, 10);
    assert.throws(
        function() {number.getFuzzySetFromGrade(-10)},
        Error,
        "Throws exception on wrong data (Membership grade smaller than 0)");
});

QUnit.test( "fuzzyNumber getFuzzySetFromGrade1", function (assert){
    var number = new FuzzyNumber(0, 5, 10);
    var fuzzySet = number.getFuzzySetFromGrade(0);
    assert.ok(
        fuzzySet == 0,
        "Return 0 when grade is 0");
});

QUnit.test( "fuzzyNumber getFuzzySetFromGrade2", function (assert){
    var number = new FuzzyNumber(0, 5, 10);
    var fuzzySet = number.getFuzzySetFromGrade(0.6);
    assert.ok(
        fuzzySet.xLeft == 0 &&
            fuzzySet.xTopLeft == 3 &&
            fuzzySet.xTopRight == 7 &&
            fuzzySet.xRight == 10,
        "Return correct set on fuzzy grade");
});

QUnit.test( "fuzzyInterval getFuzzySetFromGrade", function (assert){
    var interval = new FuzzyInterval(0, 4, 8, 10);
    var fuzzySet = interval.getFuzzySetFromGrade(1);
    assert.ok(
        fuzzySet.xLeft == 0 &&
        fuzzySet.xTopLeft == 4 &&
        fuzzySet.xTopRight == 8 &&
        fuzzySet.xRight == 10,
        "Return equal fuzzy set when grade is 1");
});

QUnit.test( "fuzzyInterval getFuzzySetFromGrade exception", function (assert){
    var interval = new FuzzyInterval(0, 4, 8, 10);
    assert.throws(
        function() {interval.getFuzzySetFromGrade(-10)},
        Error,
        "Throws exception on wrong data (Membership grade smaller than 0)");
});

QUnit.test( "fuzzyInterval getFuzzySetFromGrade1", function (assert){
    var interval = new FuzzyInterval(0, 4, 8, 10);
    var fuzzySet = interval.getFuzzySetFromGrade(0);
    assert.ok(
        fuzzySet == 0,
        "Return 0 when grade is 0");
});

QUnit.test( "fuzzyInterval getFuzzySetFromGrade2", function (assert){
    var interval = new FuzzyInterval(0, 4, 8, 10);
    var fuzzySet = interval.getFuzzySetFromGrade(0.6);
    assert.ok(
        fuzzySet.xLeft == 0 &&
        fuzzySet.xTopLeft == 2.4 &&
        fuzzySet.xTopRight == 8.8 &&
        fuzzySet.xRight == 10,
        "Return correct set on fuzzy grade");
});