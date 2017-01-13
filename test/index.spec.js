import http from 'http';
import {expect} from 'chai';

import '../src/index.js';

describe('Node Server', () => {
  it('should return 200', () => {
    http.get('http://127.0.0.1:1337', res => {
      expect(res.statusCode).to.equal(200);
    });
  });
});
