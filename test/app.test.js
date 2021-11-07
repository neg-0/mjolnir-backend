const { expect } = require('@jest/globals');
const { default: knex } = require('knex');
const request = require('supertest');
const app = require('../app.js');


describe('the /users path', () => {
    it('posts user credentials to create user that can be called from database', async () => {

        await request(app)
            .post('/users')
            .send({ user_name: 'Dustin', password: "checkpoints" });

        const res = await request(app)
            .get('/users/Dustin')
            .expect(200);

        expect(res.body.id).toBe(4)

        const output = await request(app)
            .get('/users');

        expect(output.body[3].user_name).toBe("Dustin")
        expect(output.body[3].password).toBe("checkpoints")
    });
});

describe('the /users/:user_name', () => {

    it('get user credentials from database', async () => {
        const res = await request(app)
            .get('/users/Floyd')
            .expect(200);

        expect(res.body.id).toBe(1)
        expect(res.body.user_name).toBe("Floyd")
    });
});


describe('the /users/:user_name/history', () => {
    it('returns an array of the template ids from a user\'s history', async () => {
        const res = await request(app)
            .get('/users/Floyd/history')
            .expect(200);

        expect(res.body.length).toBe(2)
    });
});


describe('the /history path', () => {
    it('returns all of the history objects in the database', async () => {
        const res = await request(app)
            .get('/history')
            .expect(200);

        expect(res.body.length).toBe(3)
        expect(res.body[2].file_name).toBe("Floyd\'s Second Letter")
    });
});

describe('the /history/:history_id path', () => {
    it('returns a history object from the input history id"', async () => {
        const res = await request(app)
            .get('/history/2')
            .expect(200);

        expect(res.body.history_object.history_id).toBe(2)
        expect(res.body.history_object.user_id).toBe(2)
        expect(res.body.history_object.template_id).toBe(1)
        expect(res.body.history_object.serialized_options.ITEM_LIST[2]).toBe("ammo")
        expect(res.body.template.title).toBe("Letter to Santa")
        expect(res.body.template_options.length).toBe(6)
    });
});

describe('the post function of the user/:user_name/history', () => {
    it('it posts a user\'s history', async () => {
        const res = await request(app)
            .post('/users/Floyd/history')
            .send({ user_id: 1, template_id: 3, file_name: "Resignation Letter", serialized_options: { NAME: "Floyd again" } })
            .expect(201);

        const resTwo = await request(app)
            .get('/users/Floyd/history')
            .expect(200)

        expect(resTwo.body.length).toBe(3)
    })
})

describe('the delete function of the user/:user_name/history/:history_id', () => {
    it('it deletes a post from a user\'s history', async () => {
        const res = await request(app)
            .delete('/users/Floyd/history/4');

        const resTwo = await request(app)
            .get('/users/Floyd/history')
            .expect(200)

        expect(resTwo.body.length).toBe(2)

    })
})

describe('the /users/:user_name/favorites path', () => {
    it('returns all favorite templates for a user', async () => {
        const res = await request(app)
            .get('/users/Floyd/favorites')
            .expect(200);

        expect(res.body.length).toBe(2)
    });
});

describe('the /users/:user_name/favorites/:template_id path', () => {
    it('posts a favorite for a user', async () => {
        await request(app)
            .post('/users/Floyd/favorites/4')
            .expect(201);

        const res = await request(app)
            .get('/users/Floyd/favorites')
            .expect(200);

        expect(res.body.length).toBe(3)
    })

    it('can delete a template from the user\'s favorites list', async ()=>{
        await request(app)
            .delete('/users/Floyd/favorites/4');

        const res = await request(app)
            .get('/users/Floyd/favorites')
            .expect(200);

        expect(res.body.length).toBe(2)
    })
})

