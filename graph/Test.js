var nodeFactory = require('./Node');
var fieldFactory = require('./Field');

var field = new fieldFactory.Field(9, 9);
var elapsed = Date.now();
field.connect();
console.log(field);