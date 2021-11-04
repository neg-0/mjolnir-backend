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
async function getUserIdByUserName(userName){
    return await knex.select('id')
               .from('users')
               .where('user_name', userName)
               .then(data => data[0].id)
              

}
//get template id by user Id//produces a list of all templates created by user
async function getTemplateIdHistoryByUserId(userId){
    
     return await knex.select('template_id')
                     .from('users_templates')
                     .where('user_id', userId)
                     .then(async (data) =>{
                         let valueArr =[];
                         for(let n=0; n<data.length; n++){
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
    return await knex.select('serialized_options')
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

// async function getFullUserHistory(userName) {
//     // Get all template options from user
//     let userHistory = []

//     for (let userTemplate of userTemplates) {
//         userHistory.push(getUserHistory(userName, userTemplate))
//     }

//     res.json(userHistory)
// }

app.get('/users/:user_name/history', async (req, res) => {
    //get history of created documents

    let user = req.params.user_name

    let userId = await getUserIdByUserName(user);

    let historyArr =[];

    let templateIdHist = await getTemplateIdHistoryByUserId(userId) //array of all templates_ids from users_templates

    for(let i=0; i<templateIdHist.length; i++){
        historyArr.push(await getHistoryRecord(userId, templateIdHist[i]))
    }

    res.send(historyArr)

})

/*
{
    template: {

    }
    template_options: [

    ]
    serialized_options: {

    }
}
*/





app.post('/users/:user_name/history', (req, res) => {
    //post history POST
    let user=req.params.user_name

    knex.select('id')

})

app.patch('/users/:user_name/history', (req, res) => {
    //patch history //:history is the history_id retrieved from get history

})

app.delete('/users/:user_name/history', (req, res) => {
    //delete a doc from history

})

app.get('/users/:user_name/favorites', (req, res) => {
    //get users favorites GET /users/:user_name/favorites

})

app.post('/users/:user_name/:template_id', (req, res) => {
    //add to favorites

})

app.delete('/users/:user_name/:template_id', (req, res) => {
    //delete a favorite DELETE /users/:user_name/:template_id

})

app.get('/templates', (req, res) => {
    //get a list of all templates (id, title, body, options) 
    res.status(200).send("Please Select a Template")
})

app.get('/templates/:template_id', (req, res) => {
    //get template body and options by id

    let template_id = req.params.template_id

    knex.select('title')
        .from('templates')
        .where('id', template_id)
        .then(data => {
            if (data.length > 0) {
                res.status(200).json(data)
            }
            else {
                res.status(404).json('Template not found, please input a valid template_id')
            }
        })
        .catch(err =>
            res.status(404).json({
                message:
                    'The data you are looking for could not be found. Please try again'
            })
        );
})


let PORT = 3001
app.listen(PORT, () => {
    console.log(`Mjolnir is bringing the hammer down on ${PORT}`);
});

module.exports = app;