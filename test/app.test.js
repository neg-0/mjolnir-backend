const request = require('supertest'); 
const app = require('../app.js'); 





describe('the / path', () => {
    it('returns this is the Home screen', async () => {
        await request(app)
        .get('/')
        .expect(200, 'this is the Home screen');
    });
  });