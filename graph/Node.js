var node = function createNode(xCoord, yCoord) {
    return {
        x : xCoord,
        y : yCoord,
        above : null,
        right : null,
        below : null,
        left : null
    };
};

module.exports.Node = node;