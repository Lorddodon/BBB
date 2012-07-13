/**
 * Created with JetBrains WebStorm.
 * User: chip
 * Date: 12.07.12
 * Time: 15:36
 * To change this template use File | Settings | File Templates.
 */
var assert = require('assert');
var fieldFactory = require('../graph/Field');
createTest();
function createTest() {
    var field = fieldFactory.Field(9,9);
    assert.equal(field.width, 9, "NOT");
}