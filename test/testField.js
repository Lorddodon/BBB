/**
 * Created with JetBrains WebStorm.
 * User: chip
 * Date: 12.07.12
 * Time: 15:36
 * To change this template use File | Settings | File Templates.
 */
var assert = require('assert');
var fieldFactory = require('../graph/Field');
var nodeFactory = require('../graph/Node');

function createTest() {
    var field = fieldFactory.Field(9,9);
    assert.equal(field.width, 9, "Width not right");
    assert.equal(field.height, 9, "Height not right");
    assert.equal(field.nodes, 0, "Nodes not empty");
}

function putTest() {
    var field = fieldFactory.Field(5, 5);
    field.addNode(nodeFactory.Node(3, 2));
    assert.ok(field.nodes.length > 0);
    assert.ok(field.getNode(3, 2));
}

createTest();
putTest();