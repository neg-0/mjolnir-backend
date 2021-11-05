const express = require('express');
const app = express();
const knex = require('knex')(require('./knexfile.js')[process.env.NODE_ENV || 'development']);
const cors = require('cors');

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())



app.post('/users', async (req, res) => {
    //create new user

    let userFromBody = req.body.user_name
    let passwordFromBody = req.body.password

    await knex('users').insert({ user_name: userFromBody, password: passwordFromBody });

    res.status(201).send('Posted user successfully')

})

app.get('/users/:user_name', (req, res) => {
    //login/load user

    let user = req.params.user_name

    knex.select('id')
        .from('users')
        .where('user_name', user)
        .then(data => {
            if (data.length > 0) {
                res.status(200).json(data)
            }
            else {
                res.status(404).json('User not found, please input a different username')
            }
        })
        .catch(err =>
            res.status(404).json({
                message:
                    'The data you are looking for could not be found. Please try again'
            })
        );

})


//get user_id by user_name in url
async function getUserIdByUserName(userName) {
    return await knex.select('id')
        .from('users')
        .where('user_name', userName)
        .then(data => data[0].id)


}
//get template id by user Id//produces a list of all templates created by user
async function getTemplateIdHistoryByUserId(userId) {

    return await knex.select('template_id')
        .from('users_templates')
        .where('user_id', userId)
        .then(async (data) => {
            let valueArr = [];
            for (let n = 0; n < data.length; n++) {
                valueArr.push(data[n].template_id)
            }
            return valueArr
        })
}

//get template by id
async function getTemplateByTemplateId(templateId) {
    return await knex.select('*')
        .from('templates')
        .where('id', templateId)
}
//get template options by id
async function getTemplateOptionsByTemplateId(templateId) {
    return await knex.select('*')
        .from('template_options')
        .where('template_id', templateId)
}
//get serialized options by userID and templateId
async function getSerializedOptionsByUserIdAndTemplateId(userId, templateId) {
    return await knex.select('history_id', 'serialized_options')
        .from('users_templates')
        .where('template_id', templateId)
        .andWhere('user_id', userId)
}
//return an object that looks like {template: [], template_options: [], serialized_options: [{}]}
async function getHistoryRecord(userId, templateId) {
    let history = {}

    history.template = await getTemplateByTemplateId(templateId)
    history.template_options = await getTemplateOptionsByTemplateId(templateId)
    history.serialized_options = await getSerializedOptionsByUserIdAndTemplateId(userId, templateId)

    return history
}

app.get('/users/:user_name/history', async (req, res) => {
    //get history of created documents

    let user = req.params.user_name

    let userId = await getUserIdByUserName(user);

    let historyArr = [];

    let templateIdHist = await getTemplateIdHistoryByUserId(userId) //array of all templates_ids from users_templates

    for (let i = 0; i < templateIdHist.length; i++) {
        historyArr.push(await getHistoryRecord(userId, templateIdHist[i]))
    }

    res.send(historyArr)

})



app.post('/users/:user_name/history', async (req, res) => {
    //post history POST
    let user = req.params.user_name
    let templateId = req.body.template_id
    let serializedOptions = req.body.serialized_options

    let userId = await getUserIdByUserName(user)
    console.log(userId)

    await knex('users_templates').insert({ user_id: userId, template_id: templateId, serialized_options: serializedOptions });

    res.status(201).send('Posted history successfully')

})

app.patch('/users/:user_name/history', async (req, res) => {//DONE
    //patch history //:history is the history_id retrieved from get history
    //replacing old serialized options with newly fed serialized
    await knex('users_templates')
        .where({ 'history_id': req.body.history_id })
        .update({ serialized_options: req.body.serialized_options })

    res.status(200).send('Document updated')
})

app.delete('/users/:user_name/history', async (req, res) => {//DONE
    //delete a doc from history
    let user = req.params.user_name

    let idToDelete = req.body.history_id

    await knex('users_templates').where('history_id', idToDelete)
        .del()

    //let result = await knex.select("*").from('users_templates')

    res.status(200).send(`Successfully deleted`)



})

app.get('/users/:user_name/favorites', async (req, res) => { //DONE
    //get users favorites GET /users/:user_name/favorites
    let user = req.params.user_name;

    let userId = await getUserIdByUserName(user)
    console.log('userId is:', userId)

    let favorites = await knex.select('template_id')
        .from('favorites')
        .where('user_id', userId)
        .then(async (data) => {

            let favoriteTemplateId = await data.map((element) => element.template_id)
            return favoriteTemplateId
        })
    console.log('favorites are:', favorites)

    res.send(favorites)

})

app.post('/users/:user_name/:template_id', async (req, res) => {//DONE
    //add to favorites
    let user = req.params.user_name;
    let userId = await getUserIdByUserName(user)
    let templateId = req.params.template_id

    await knex('favorites').insert({ user_id: userId, template_id: templateId })


    //let favorites = await knex.select('*').from('favorites')

    res.status(201).send(`Favorite Successfully Added`)



})

app.delete('/users/:user_name/:template_id', async (req, res) => { //DONE
    //delete a favorite DELETE /users/:user_name/:template_id


    await knex('favorites')
        .select('template_id')
        .where('user_id', await getUserIdByUserName(req.params.user_name))
        .andWhere('template_id', req.params.template_id)
        .del()

    res.send('Template removed from favorites');
})

app.get('/templates', async (req, res) => {
    //get a list of all templates (id, title, body, options) 

    let templateTable = await knex.select('id', 'title', 'body')
        .from('templates')

    let templateOptionsTable = await knex.select('*')
        .from('template_options')

    let templateOutput = { templateTable: templateTable, template_options: templateOptionsTable }

    res.status(200).send(templateOutput)
})

app.get('/templates/:template_id', async (req, res) => {
    //get template body and options by id
    let templateId =req.params.template_id

    let template = await knex.select('id', 'title', 'body')
        .from('templates')
        .where('id', templateId)

    let templateOptions = await knex.select('*')
        .from('template_options')
        .where('template_id', templateId)

    let templateOutput = { template: template, template_options: templateOptions }

    res.status(200).send(templateOutput)

})


let PORT = 3001
app.listen(PORT, () => {
    console.log(`Mjolnir is bringing the hammer down on ${PORT}`);
});

module.exports = app;