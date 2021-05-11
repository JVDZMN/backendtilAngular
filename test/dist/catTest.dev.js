"use strict";

describe('Sample Test', function () {
  it('should test that true === true', function () {
    expect(true).toBe(true);
  });
});
describe("Category", function () {
  describe("GET /", function () {
    // Test to get all category record
    it("should get all category record", function (done) {
      chai.request(app).get('/').end(function (err, res) {
        res.should.have.status(200);
        res.body.should.be.a('object');
        done();
      });
    }); // Test to get single category record

    it("should get a single category record", function (done) {
      var id = '609a202ae80fca3bf0fbed3e';
      chai.request(app).get("/".concat(id)).end(function (err, res) {
        res.should.have.status(200);
        res.body.should.be.a('object');
        done();
      });
    }); // Test to get single category record

    it("should not get a single category record", function (done) {
      var id = 5;
      chai.request(app).get("/".concat(id)).end(function (err, res) {
        res.should.have.status(404);
        done();
      });
    });
  });
});