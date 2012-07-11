var nodeFactory = require('./Node');

var field = function createField(fieldWidth, fieldHeight) {
    return {
        width : fieldWidth,
        height : fieldHeight,
        nodes : [],

        addNode : function(node) {
            this.nodes[node.y * fieldHeight + node.x] = node;
        },

        getNode : function (x, y) {
        return this.nodes[y * fieldHeight + x];
        },

        createNodeIfUndefined : function(x, y) {
        var node = this.getNode(x, y);
        if(typeof node === "undefined")
            node = new nodeFactory.Node(x, y);
        return node;
        },

        connect : function() {
        for(var y = 0; y < fieldHeight; y++)
            for(var x = 0; x < fieldWidth; x++) {
                if(y%2 == 0 || x%2 == 0) {
                    var currentNode = this.createNodeIfUndefined(x, y);
                    if(x%2 == 1) {
                        if(currentNode.left == null)
                            currentNode.left = this.createNodeIfUndefined(x - 1, y);
                        if(currentNode.right == null)
                            currentNode.right = this.createNodeIfUndefined(x + 1, y);
                    }
                    else if(y%2 == 1) {
                        if(currentNode.above == null)
                            currentNode.above = this.createNodeIfUndefined(x, y - 1);
                        if(currentNode.below == null)
                            currentNode.below = this.createNodeIfUndefined(x, y + 1);
                    }
                    else {
                        if(y > 0 && currentNode.above == null)
                            currentNode.above = this.createNodeIfUndefined(x, y - 1);
                        if(y < this.height - 1 && currentNode.below == null)
                            currentNode.below = this.createNodeIfUndefined(x, y + 1);
                        if(x > 0 && currentNode.left == null)
                            currentNode.left = this.createNodeIfUndefined(x - 1, y);
                        if(x < this.width - 1 && currentNode.right == null)
                            currentNode.right = this.createNodeIfUndefined(x + 1, y);
                    }
                    this.addNode(currentNode);
                }
            }
        }
    };
};

module.exports.Field = field;
module.exports.addNode = field.addNode;
module.exports.getNode = field.getNode;
module.exports.connect = field.connect;