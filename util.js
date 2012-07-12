var remove = function(arr, index) {
    var arr2 = arr.splice(index).splice(1);
    return arr.concat(arr2);
};

module.exports.remove = remove;