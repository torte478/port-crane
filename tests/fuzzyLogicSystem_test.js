/**
 * Created by torte on 24.05.2016.
 */

function initialize(){
    var res = new FuzzyLogicSystem();
    res.addInputSet(0, "Less", new FuzzyInterval(0, 0, 5, 10));
    res.addInputSet(0, "Normal", new FuzzyNumber(5, 10, 15))
    res.addInputSet(0, "More", new FuzzyInterval(10, 15, 20, 20))

    res.addOutputSet("Left", new FuzzyInterval(0, 0, 5, 10));
    res.addOutputSet("Right", new FuzzyInterval(5, 10, 15, 15));

    res.setRule(new Array("Less"), "Left");
    res.setRule(new Array("Normal"), "Left");
    res.setRule(new Array("More"), "Left");
    return res;
}

QUnit.test ("constructor", function (assert){
    var flSystem = initialize();
    assert.ok(true)
});

QUnit.test ("setRule", function (assert){
    var flSystem = initialize();
    flSystem.setRule(new Array("Less"), "Left");
    assert.equal(flSystem.ruleMapping["Less"], "Left", "Correctly set rule");
});
//
// QUnit.test ("setRule exception", function (assert){
//     var flSystem = initialize();
//     assert.throws(
//         function() {new Array("Less"), "Left")},
//         Error,
//         "Throws exception when input system not contains current key"
//     )
// });

QUnit.test ("setRule exception1", function (assert){
    var flSystem = initialize();
    assert.throws(
        function() {flSystem.setRule(new Array("Less"), "NULL")},
        Error,
        "Throws exception when output system not contains current key"
    )
});

QUnit.test ("setRule exception2", function (assert){
    var flSystem = initialize();
    assert.throws(
        function() {flSystem.setRule(new Array("NULL"), "Left")},
        Error,
        "Throws exception when current input system not contains current key"
    )
});

QUnit.test ("calc borders", function (assert){
    var flSystem = initialize();
    assert.ok(
        flSystem.leftBorder == 0 &&
        flSystem.rightBorder == 15,
        "Constructor is correct"
    );
})

QUnit.test ("setAccuracy", function (assert){
   var flSystem = initialize();
    flSystem.setAccuracy(256);
    assert.equal(flSystem.accuracy, 256, "Correctly changes accuracy");
});
