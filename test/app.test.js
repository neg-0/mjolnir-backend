const { expect } = require('@jest/globals');
const request = require('supertest');
const app = require('../app.js');





describe('the / path', () => {
    it('returns this is the Home screen', async () => {
        await request(app)
            .get('/')
            .expect(200, 'this is the Home screen');
    });
});

describe('the /templates path', () => {
    it('returns "Please Select a Template"', async () => {
        await request(app)
            .get('/templates')
            .expect(200);

    });
});

describe('the /users', () => {

    it('returns "Please Input your User Name and Password"', async () => {

        await request(app)
            .get('/users')
            .expect("Please Input your User Name and Password");

    });

    it('posts a input user credentials to create user that can be called from database', async () => {

        await request(app)
            .post('/users')
            .send({user_name: 'Dustin', password: "checkpoints"});

        const res = await request(app)
            .get('/users/Dustin')
            .expect(200);

            expect(res.body[0].user_name).toBe("Dustin")
            expect(res.body[0].password).toBe("checkpoints")

    });

});

describe('the /users/:users', () => {

    it('get user credentials from database', async () => {
        const res = await request(app)
            .get('/users/Mario')
            .expect(200);

            // console.log('res.body is:', res.body[0])
            expect(res.body[0].user_name).toBe("Mario")
    });



});