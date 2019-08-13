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
    before(() => {
      eloqua = new Eloqua("good-site", "good-user", "good-password");
    });
    it('login successfully', () => {
      const url = new URL(Eloqua.loginUrl);
      console.log(url);
      nock(url.origin)
        .get(url.pathname)
        .reply(200, "hello");

      return eloqua.login().then(body => {
        expect(body).eq("hello");
      });
    });
  });
});