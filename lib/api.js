exports.productoList = function (db) {
  return function (req, res) {
    db.get('productos').find(null, {},function(err, doc) {
      if (err)  res.status(500).json({err: err});
      else      res.json(doc);
    });
  };
};

exports.productoGet = function (db) {
  return function (req, res) {
    db.get('productos').findById(req.query.id, function(err,doc) { 
      if (err)  res.status(500).json({ err: err});
      else      res.json(doc);
    });
  };
};

exports.clienteList = function (db) {
  return function (req, res) {
    db.get('clientes').find(null, {}, function(err,doc) { 
      if (err)  res.status(500).json({ err: err});
      else      res.json(doc);
    });
  };
};


exports.clienteGet = function (db) {
  return function (req, res) {
    db.get('clientes').findById(req.query.id, function(err,doc) { 
      if (err)  res.status(500).json({ err: err});
      else      res.json(doc);
    });
  };
};
