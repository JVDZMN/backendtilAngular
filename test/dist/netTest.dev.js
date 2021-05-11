"use strict";

var request = require("supertest");

var app = require("../app");

describe("Test the root path", function () {
  test("It should response the GET method", function () {
    return request(app).get("/").expect(200);
  });
});