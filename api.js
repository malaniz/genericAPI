"use strict";

const parseFilters = (x) => {
  let regParts = [];
  if (x instanceof Array) {
    let oresult = [];
    for (let i=0; i<x.length; i++) {
      oresult[i] = parseFilters (x[i]);
    }
    return oresult;
  }
  if (typeof (x) === 'object' ) {
    const ks = Object.keys(x);
    let oresult = {};
    for (let i=0; i<ks.length; i++) {
      oresult[ks[i]] = parseFilters (x[ks[i]]);
    }
    return oresult;
  } else if ((typeof (x) === 'string') && (x[0] === '/')) {
    let r = '';
    regParts = x.split('/').filter(y => y!== '');
    if (regParts.length === 2) {
      r = new RegExp(regParts[0], regParts[1]);
    } else if (regParts.length === 1) {
      r = new RegExp(regParts[0]);
    }
    return r;
  } else {
    return x;
  }
}

exports.gLst = function(db){
  return function(req, res, next) {
    var filters = req.body.filters || {};
    var options = req.body.options || {};
    var keys,k, v, r;

    console.log(filters);
    filters = parseFilters(filters);
    db.get(req.params.entity).find(filters, options, function(err, doc){
      if (err) {
        next({error: 'SERVER_ERROR'});
        return;
      }
      res.json(doc);
    });
  };
};

exports.gGet = function(db) {
  return function(req, res, next) {
    var _id = (req.query._id)? req.query._id: false;
    if(!_id) {
      next({error: 'BAD_REQUEST', message: 'No _id to get'});
      return;
    }

    db.get(req.params.entity).findById(_id, {}, function(err, doc){
      if (err) {
        next({error: 'SERVER_ERROR'});
        return;
      }
      res.json(doc);
    });

  };
};

exports.gDel = function(db){
  return function(req, res, next) {
    var _id = (req.query._id)? req.query._id: false;
    if(!_id) {
      next({error: 'BAD_REQUEST', message: 'No _id to delete'});
      return;
    }
    db.get(req.params.entity).remove({_id: _id}, function(err, doc){
      if (err) {
        next({error: 'SERVER_ERROR'});
        return;
      }
      res.json(doc);
    });
  };
};


exports.gPut = function(db){
  return function(req, res, next) {
    var data = (req.body.data)? req.body.data: false;
    console.log(req.body);
    if (!data) {
      next({error: 'BAD_REQUEST', message: 'No data to put'});
      return;
    }
    
    db.get(req.params.entity).insert(data, function(err, doc) {
      if (err) {
        next({error: 'SERVER_ERROR'});
      }
      res.json(doc);
    });
  };
};

exports.gUpd = function(db){
  return function(req, res, next) {
    var data = (req.body.data)? req.body.data: false;
    if (!data || !('_id' in data)) {
      next({error: 'BAD_REQUEST', message: 'No data or _id to update'});
      return;
    }
    var updData = JSON.parse(JSON.stringify(data));
    delete updData._id;
    db.get(req.params.entity).update({'_id': data._id}, {$set: updData}, function(err, doc) {
      if (err) {
        next({error: 'SERVER_ERROR'});
        return;
      }
      res.json(doc);
    });
  };
};


