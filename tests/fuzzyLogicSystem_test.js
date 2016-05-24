/**
 * Created by torte on 24.05.2016.
 */

function initialize(){
    var res = new FuzzyLogicSystem();
    res.inputSystem["Less"] = new FuzzyInterval(0, 0, 5, 10);
    res.inputSystem["Normal"] = new FuzzyNumber(5, 15);
    res.inputSystem["More"] = new FuzzyInterval(10, 15, 20, 20);

    res.outputSystem["Left"] = new FuzzyInterval(0, 0, 5, 10);
    res.outputSystem["Right"] = new FuzzyInterval(5, 10, 15, 15);

    res.setRule("Less", "Left");
    res.setRule("Normal", "Left");
    res.setRule("More", "Right");
    return res;
}

QUnit.test ("constructor", function (assert){
    var flSystem = initialize();
    assert.ok(true);
});

QUnit.test ("setRule", function (assert){
    var flSystem = initialize();
    flSystem.setRule("Less", "Left");
    assert.equal(flSystem.ruleMapping["Less"], "Left", "Correctly set rule");
});

QUnit.test ("setRule exception", function (assert){
    var flSystem = initialize();
    assert.throws(
        function() {flSystem.setRule("NULL", "Left")},
        Error,
        "Throws exception when input system not contains current key"
    )
});

QUnit.test ("setRule exception1", function (assert){
    var flSystem = initialize();
    assert.throws(
        function() {flSystem.setRule("Less", "NULL")},
        Error,
        "Throws exception when output system not contains current key"
    )
});