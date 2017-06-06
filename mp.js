const qr = require('qr-image');

exports.mpGet = (mp) => (req, res, next) => {
  const id = (req.query.id)? req.query.id: false;
  if(!id) {
    next({error: 'BAD_REQUEST', message: 'No id to get'});
    return;
  }
  mp.getPayment(id)
    .then(
      result => res.json(result),
      error => next({ error: 'SERVER_ERROR' })
    );
};

exports.mpQr = (mp) => (req, res, next) => {
  const email = (req.query.email)? req.query.email: false;
  const firstname = (req.query.firstname)? req.query.firstname: false;
  const lastname = (req.query.lastname)? req.query.lastname: false;
  if(!email || !firstname || !lastname) {
    next({error: 'BAD_REQUEST', message: 'No id to get'});
    return;
  }

  const code = qr.image(`BEGIN:VCARD VERSION:3.0 N:${lastname};${firstname} FN:${firstname} ${lastname} EMAIL;TYPE=INTERNET:${email} END:VCARD`, { type: 'svg'})
  res.type('svg');
  code.pipe(res);
};
