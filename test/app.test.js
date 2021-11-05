const { expect } = require('@jest/globals');
const { default: knex } = require('knex');
const request = require('supertest');
const app = require('../app.js');


describe('the /users', () => {


    it('posts user credentials to create user that can be called from database', async () => {

        await request(app)
            .post('/users')
            .send({user_name: 'Dustin', password: "checkpoints"});

        const res = await request(app)
            .get('/users/Dustin')
            .expect(200);
      
            
            expect(res.body[0].id).toBe(4)
        const userId = res.body[0].id
        console.log('user')
        const output = pullUserNameAndPassword(userId)


            expect(output[0].user_name).toBe("Dustin")
            expect(output[0].password).toBe("checkpoints")

    });

});

describe('the /users/:user', () => {

    it('get user credentials from database', async () => {
        const res = await request(app)
            .get('/users/Mario')
            .expect(200);

            // console.log('res.body is:', res.body[0])
            expect(res.body[0].id).toBe(2)
    });

});

describe('the /users/:user/history', () => {

    it('get the templates and serialized_options from a users history with one object', async () => {
        const res = await request(app)
            .get('/users/Mario/history')
            .expect(200);

            // console.log('res.body is:', res.body[0])
            expect(res.body.template_body).toBe('long string here')
            expect(res.body.serialized_options).toBe('user_2 supplied form data')
    });

    it('get the templates and serialized_options from a users history with one object', async () => {
        const res = await request(app)
            .get('/users/Floyd/history')
            .expect(200);

            // console.log('res.body is:', res.body[0])
            expect(res.body.template_body).toBe('long string here')
            expect(res.body.serialized_options).toBe('user_2 supplied form data')
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

