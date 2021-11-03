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

describe('the /templates/:template_id path', () => {
    it('returns the selected template when called by id in template table', async () => {
        const res =await request(app)
            .get('/templates/1')
            .expect(200);

            expect(res.body[0].title).toBe('letter to Santa');

    });
});

describe('the /users', () => {

    it('returns "Please Input your User Name and Password"', async () => {

        await request(app)
            .get('/users')
            .expect("Please Input your User Name and Password");

    });

    it('posts user credentials to create user that can be called from database', async () => {

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

describe('the /users/:user', () => {

    it('get user credentials from database', async () => {
        const res = await request(app)
            .get('/users/Mario')
            .expect(200);

            // console.log('res.body is:', res.body[0])
            expect(res.body[0].user_name).toBe("Mario")
    });

});

describe('the /users/:user/history', () => {

    it('get the templates and serialized_options from a users history', async () => {
        const res = await request(app)
            .get('/users/Mario/history')
            .expect(200);

            // console.log('res.body is:', res.body[0])
            expect(res.body[0].template_id).toBe(1)
            expect(res.body[0].serialized_options).toBe('user_2 supplied form data')
    });

});