var nodeFactory = require('./Node');
var fieldFactory = require('./Field');
var generator = require('./Generator');
var util = require('../util');

var field = fieldFactory.Field(9, 9);
field.connect();
generator.generate(field, 25);
console.log(field);