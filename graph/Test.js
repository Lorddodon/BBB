var nodeFactory = require('./Node');
var fieldFactory = require('./Field');
var util = require('../util');

var field = fieldFactory.Field(9, 9);
field.connect();
console.log(field);