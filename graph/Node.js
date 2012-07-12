var node = function createNode(xCoord, yCoord) {
    return {
        x : xCoord,
        y : yCoord,
        above : null,
        right : null,
        below : null,
        left : null,
        containedEntity : null,

        place : function(entity) {
            this.containedEntity = entity;
        }
    };
};

module.exports.Node = node;