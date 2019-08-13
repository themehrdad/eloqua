"use strict";
exports.__esModule = true;
var chai_1 = require("chai");
var index_1 = require("../dist/index");
var nock = require("nock");
var yargs = require("yargs");
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
    describe("with good credentials (mocked)", function () {
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
            var url = new URL(index_1.Eloqua.loginUrl);
            nock(url.origin)
                .get(url.pathname)
                .reply(200, expectedResponse);
        });
        it('login successfully', function () {
            return eloqua.login().then(function (body) {
                chai_1.expect(body).eq(JSON.stringify(expectedResponse));
            });
        });
    });
    describe("with good credentials from console", function () {
        var argv;
        before(function () {
            argv = yargs.options({
                site: { type: 'string', demandOption: true },
                user: { type: 'string', demandOption: true },
                password: { type: 'string', demandOption: true }
            }).argv;
            nock.cleanAll();
            eloqua = new index_1.Eloqua(argv.site, argv.user, argv.password);
        });
        it("should successfully login", function () {
            return eloqua.login().then(function (body) {
                chai_1.expect(body).not.eq('"Not authenticated."');
                var id = JSON.parse(body);
                chai_1.expect(id.site).to.be.a('object');
                chai_1.expect(id.urls).to.be.a('object');
                console.log(eloqua.id);
            });
        });
    });
});
