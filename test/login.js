var supertest = require("supertest");
var should    = require("should");
var server    = supertest.agent("http://localhost:8080");
expect        = require("chai").expect;

describe("Login unit test",function(){

  it("should  try login member with false auth",function(done){
    var credentials = {credentials: { username: 'x@gmail.com', password: '1233'}};
    server
    .post('/login')
    .send(credentials)
    .expect("Content-type",/json/)
    .expect(200)
    .end(function(err,res){
      res.status.should.equal(401);
      res.ok.should.equal(false);
      done();
    });
  });

  it("should  try login member with auth",function(done){
    var credentials = {credentials: { username: 'x@gmail.com', password: '1234'}};
    server
    .post('/login')
    .send(credentials)
    .expect("Content-type",/json/)
    .expect(200)
    .end(function(err,res){
      res.status.should.equal(200);
      res.ok.should.equal(true);
      var data = JSON.parse(res.text);
      expect(data.token).to.exist;
      done();
    });
  });
});