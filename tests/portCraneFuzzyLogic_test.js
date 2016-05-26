/**
 * Created by torte on 26.05.2016.
 */

QUnit.test ("constructor", function (assert){
    var portCrane = new PortCraneFuzzyLogic();
    assert.ok(true)
});

QUnit.test ("debug print", function (assert){
   var portCrane = new PortCraneFuzzyLogic();
    console.log("close, slow: " + portCrane.getVerticalMovement(0, 0));
    console.log("close, fast: " + portCrane.getVerticalMovement(0, 3));
    console.log("far  , slow: " + portCrane.getVerticalMovement(10, 0));
    console.log("far  , fast: " + portCrane.getVerticalMovement(10, 3));

    console.log("===============");
    console.log("left , left:  " + portCrane.getHorizontalMovement(-4, -4));
    console.log("left , no:    " + portCrane.getHorizontalMovement(-4, 0));
    console.log("left , right: " + portCrane.getHorizontalMovement(-4, 4));

    console.log("no   , left:  " + portCrane.getHorizontalMovement(0, -4));
    console.log("no   , no:    " + portCrane.getHorizontalMovement(0, 0));
    console.log("no   , right: " + portCrane.getHorizontalMovement(0, 4));

    console.log("right, left:  " + portCrane.getHorizontalMovement(4, -4));
    console.log("right, no:    " + portCrane.getHorizontalMovement(4, 0));
    console.log("right, right: " + portCrane.getHorizontalMovement(4, 4));
    assert.ok(true);
});