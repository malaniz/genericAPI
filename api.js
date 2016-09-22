exports.gLst = function(db){
  return function(req, res) {
    var filters = req.body.filters || {};
    var options = req.body.options || {};
    var keys,k, v, regParts, r;

    keys = Object.keys(filters);
    for (var i=0; i<keys.length; i++){
      k = keys[i];
      v = filters[k];

      console.log(typeof v);
      if (v[0] === '/') {
        regParts = v.split('/').filter(function(x){ return x!== ''});
        if (regParts.length === 2) {
          r = new RegExp(regParts[0], regParts[1]);
        } else if (regParts.length === 1) {
          r = new RegExp(regParts[0]);
        } else {
          r = v;
        }
        filters[k] = r;
        console.log(r);
      }
    }
    console.log(filters);
    db.get(req.params.entity).find(filters, options, function(err, doc){
      if (err) {
        res.status(500).json({error: err});
        return;
      }
      res.json(doc);
    });
  };
};

exports.gGet = function(db) {
  return function(req, res) {
    var _id = (req.query._id)? req.query._id: false;
    if(!_id) {
      res.status(500).json({ error: 'No Data to delete'});
      return;
    }

    db.get(req.params.entity).findById(_id, {}, function(err, doc){
      if (err) {
        res.status(500).json({error: err});
        return;
      }
      res.json(doc);
    });

  };
};

exports.gDel = function(db){
  return function(req, res) {
    var _id = (req.query._id)? req.query._id: false;
    if(!_id) {
      res.status(500).json({ error: 'No Data to delete'});
      return;
    }
    db.get(req.params.entity).remove({_id: _id}, function(err, doc){
      if (err) {
        res.status(500).json({error: err});
        return;
      }
      res.json(doc);
    });
  };
};


exports.gPut = function(db){
  return function(req, res) {
    var data = (req.body.data)? req.body.data: false;
    console.log(req.body);
    if (!data) {
      res.status(500).json({ error: 'No Data to save'});
      return;
    }
    
    db.get(req.params.entity).insert(data, function(err, doc) {
      if (err) {
        res.status(500).json({error: err});
      }
      res.json(doc);
    });
  };
};

exports.gUpd = function(db){
  return function(req, res) {
    var data = (req.body.data)? req.body.data: false;
    if (!data || !('_id' in data)) {
      res.status(500).json({ error: 'No Data to update'});
      return;
    }
    var updData = JSON.parse(JSON.stringify(data));
    delete updData._id;
    db.get(req.params.entity).update({'_id': data._id}, {$set: updData}, function(err, doc) {
      if (err) {
        res.status(500).json({error: err});
        return;
      }
      res.json(doc);
    });
  };
};


