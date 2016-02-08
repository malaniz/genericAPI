
exports.data = function(db) {
  return function(req, res) {
    res.json({"data": "data restringida1"});
  };
};


exports.otro = function(db) {
  return function(req, res) {
    res.json({"data": "otro restringido"});
  };
};
