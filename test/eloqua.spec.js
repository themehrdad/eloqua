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
        var expectedResponse;
        before(function () {
            eloqua = new index_1.Eloqua("good-site", "good-user", "good-password");
            expectedResponse = {
                "site": {
                    "id": 1,
                    "name": "good-site"
                },
                "user": {
                    "id": 2,
                    "username": "good-user",
                    "displayName": "good-user",
                    "firstName": "good",
                    "lastName": "user",
                    "emailAddress": "good-user@good-site.com"
                },
                "urls": {
                    "base": "https://secure.p01.eloqua.com",
                    "apis": {
                        "soap": {
                            "standard": "https://secure.p01.eloqua.com/API/{version}/Service.svc",
                            "dataTransfer": "https://secure.p01.eloqua.com/API/{version}/DataTransferService.svc",
                            "email": "https://secure.p01.eloqua.com/API/{version}/EmailService.svc",
                            "externalAction": "https://secure.p01.eloqua.com/API/{version}/ExternalActionService.svc"
                        },
                        "rest": {
                            "standard": "https://secure.p01.eloqua.com/API/REST/{version}/",
                            "bulk": "https://secure.p01.eloqua.com/API/Bulk/{version}/"
                        }
                    }
                }
            };
        });
        it('login successfully', function () {
            var url = new URL(index_1.Eloqua.loginUrl);
            nock(url.origin)
                .get(url.pathname)
                .reply(200, expectedResponse);
            return eloqua.login().then(function (body) {
                chai_1.expect(body).eq(JSON.stringify(expectedResponse));
            });
        });
    });
});
