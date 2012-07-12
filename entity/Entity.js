var entity = function(xPos, yPos, theId, theType) {
    return {
        x : xPos,
        y : yPos,
        id : theId,
        type : theType
    };
};

module.exports.entity = entity;