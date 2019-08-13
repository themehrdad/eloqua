import { expect } from 'chai';
import { Eloqua } from '../dist/index';
import * as nock from 'nock';

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

  describe("with good credentials", () => {
    let expectedResponse: object;
    before(() => {
      eloqua = new Eloqua("good-site", "good-user", "good-password");
      expectedResponse = { 
        "site": { 
          "id": 1, 
          "name": "good-site" }, 
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
                "bulk": "https://secure.p01.eloqua.com/API/Bulk/{version}/" } } } };
    });
    it('login successfully', () => {
      const url = new URL(Eloqua.loginUrl);
      nock(url.origin)
        .get(url.pathname)
        .reply(200, expectedResponse);

      return eloqua.login().then(body => {
        expect(body).eq(JSON.stringify(expectedResponse));
      });
    });
  });
});