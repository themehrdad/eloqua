import { expect } from 'chai';
import { Eloqua } from '../dist/index';
import * as nock from 'nock';
import * as yargs from 'yargs';
import { stringify } from 'querystring';

describe('test login method', () => {
  let eloqua: Eloqua;
  describe('with invalid credentials', () => {
    before(() => {
      eloqua = new Eloqua("dummy-org", "dummy-user", "dummy-pass");
    });
    it('login unsuccessful', () => {
      return eloqua.login().then(body => {
        expect(body).eq('"Not authenticated."');
      });
    });
  });

  describe("with good credentials (mocked)", () => {
    let expectedResponse: object;
    before(() => {
      eloqua = new Eloqua("good-site", "good-user", "good-password");
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
      const url = new URL(Eloqua.loginUrl);
      nock(url.origin)
        .get(url.pathname)
        .reply(200, expectedResponse);
    });
    it('login successfully', () => {
      return eloqua.login().then(body => {
        expect(body).eq(JSON.stringify(expectedResponse));
      });
    });
  });

  describe("with good credentials from console", () => {
    let argv: { user: string, site: string, password: string };
    before(() => {
      argv = yargs.options({
        site: { type: 'string', demandOption: true },
        user: { type: 'string', demandOption: true },
        password: { type: 'string', demandOption: true }
      }).argv;
      nock.cleanAll();
      eloqua = new Eloqua(argv.site, argv.user, argv.password);
    });

    it("should successfully login", () => {
      return eloqua.login().then(body => {
        expect(body).not.eq('"Not authenticated."');
        const id = JSON.parse(body);
        expect(id.site).to.be.a('object');
        expect(id.urls).to.be.a('object');
      })
    });
  });
});