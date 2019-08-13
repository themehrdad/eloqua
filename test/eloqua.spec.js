"use strict";
exports.__esModule = true;
var chai_1 = require("chai");
var index_1 = require("../dist/index");
var nock = require("nock");
describe('test login method', function () {
    var eloqua;
    describe('with invalid credentials', function () {
        before(function () {
            eloqua = new index_1.Eloqua("dummy-org", "dummy-user", "dummy-pass");
        });
        it('login unsuccessful', function () {
            return eloqua.login().then(function (body) {
                chai_1.expect(body).eq('"Not authenticated."');
            });
        });
    });
    describe("with good credentials", function () {
        before(function () {
            eloqua = new index_1.Eloqua("good-site", "good-user", "good-password");
        });
        it('login successfully', function () {
            var url = new URL(index_1.Eloqua.loginUrl);
            console.log(url);
            nock(url.origin)
                .get(url.pathname)
                .reply(200, "hello");
            return eloqua.login().then(function (body) {
                chai_1.expect(body).eq("hello");
            });
        });
    });
});
