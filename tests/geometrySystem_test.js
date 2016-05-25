/**
 * Created by torte on 25.05.2016.
 */

function initializeGeometrySystem(){
    var res = new GeometrySystem(0, 15, 30);
    return res;
}


QUnit.test ("constructor", function(assert){
    var geomSys = new GeometrySystem(-10, 10, 20);
    assert.ok(
        geomSys.leftBorder == -10 &&
            geomSys.rightBorder == 10 &&
            geomSys.stepCount == 20,
        "Constructor works"
    )
});

QUnit.test( "constructor exception", function(assert){
   assert.throws(
       function() {var geomSys = new GeometrySystem(10, -10)},
       Error,
       "Construct throws exception on wrong data (leftBorder greater than rightBorder)"
   )
});

QUnit.test( "constructor exception2", function(assert){
    assert.throws(
        function() {var geomSys = new GeometrySystem(10, 20, -10)},
        Error,
        "Construct throws exception on wrong data (stepCount not positive)"
    )
});

QUnit.test( "evaluate", function(assert){
    var geomSys = initializeGeometrySystem();
    assert.equal(geomSys.evaluate(), 0, "Return 0 when data is empty");
});

QUnit.test( "add", function(assert){
    var geomSys = initializeGeometrySystem();
    geomSys.add(new FuzzyInterval(0, 0, 5, 10), 0.8);
    assert.equal(geomSys.shape[2], 0.8, "Correctly add one shape (full value)")
    assert.equal(geomSys.shape[15], 0.4, "Correctly add one shape (part of value)")
    assert.equal(geomSys.shape[27], 0, "Correctly add one shape (null value)")
});

QUnit.test( "add1", function(assert){
    var geomSys = initializeGeometrySystem();
    geomSys.add(new FuzzyInterval(0, 0, 5, 10), 0.8);
    geomSys.add(new FuzzyInterval(6.5, 8, 13, 14), 0.6);
    assert.equal(geomSys.shape[20], 0.6, "Correctly add second shape (full value)")
    assert.equal(geomSys.shape[15], 0.4, "Correctly add second shape (part of value)")
    assert.equal(geomSys.shape[29], 0, "Correctly add second shape (null value)")
});

QUnit.test( "add2", function(assert){
    var geomSys = initializeGeometrySystem();
    geomSys.add(new FuzzyInterval(0, 0, 5, 10), 0.8);
    geomSys.add(new FuzzyInterval(6.5, 8, 13, 14), 0.6);
    geomSys.add(new FuzzyInterval(5, 7, 7, 9), 1);
    assert.equal(geomSys.shape[14], 1, "Correctly add one shape (full value)")
    assert.equal(geomSys.shape[12], 0.64, "Correctly add one shape (part of value)")
    assert.equal(geomSys.shape[16], 0.6, "Correctly add one shape (part of value)")
});

QUnit.test ("evaluate", function(assert){
   var geomSys = initializeGeometrySystem();
    geomSys.add(new FuzzyInterval(0, 0, 10, 10), 1);
    assert.equal(geomSys.evaluate(), 5, "Return center when shape is symmetric");
});

