const express = require('express');
const app = express();
const knex = require('knex')(require('./knexfile.js')[process.env.NODE_ENV || 'development']);
const cors = require('cors');
const PORT = 3001

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

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

//admin feature
app.get('/users', async (req, res) => {
  let userList = await knex('users').select('*')
  res.json(userList)
})

//create new user
app.post('/users', async (req, res) => {
  let userFromBody = req.body.user_name
  let passwordFromBody = req.body.password

  await knex('users').insert({ user_name: userFromBody, password: passwordFromBody });

  res.status(201).send('Posted user successfully')
})

//login/load user
app.get('/users/:user_name', (req, res) => {
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

//get history of created documents
app.get('/users/:user_name/history', async (req, res) => {
  let user = req.params.user_name
  let userId = await getUserIdByUserName(user);
  let historyArr = [];
  let templateIdHist = await getTemplateIdHistoryByUserId(userId) //array of all templates_ids from users_templates

  for (let i = 0; i < templateIdHist.length; i++) {
    historyArr.push(await getHistoryRecord(userId, templateIdHist[i]))
  }

  res.send(historyArr)
})

//post history POST
app.post('/users/:user_name/history', async (req, res) => {
  let user = req.params.user_name
  let templateId = req.body.template_id
  let serializedOptions = req.body.serialized_options
  let userId = await getUserIdByUserName(user)

  await knex('users_templates').insert({ user_id: userId, template_id: templateId, serialized_options: serializedOptions });

  res.status(201).send('Posted history successfully')
})

//replacing old serialized options with newly fed serialized_options
app.patch('/users/:user_name/history', async (req, res) => {//DONE
  await knex('users_templates')
    .where({ 'history_id': req.body.history_id })
    .update({ serialized_options: req.body.serialized_options })

  res.status(200).send('Document updated')
})

//delete a doc from history
app.delete('/users/:user_name/history', async (req, res) => {//DONE
  let user = req.params.user_name
  let idToDelete = req.body.history_id

  await knex('users_templates').where('history_id', idToDelete)
    .del()

  res.status(200).send(`Successfully deleted`)
})

//get users favorites GET /users/:user_name/favorites
app.get('/users/:user_name/favorites', async (req, res) => { //DONE
  let user = req.params.user_name;
  let userId = await getUserIdByUserName(user)

  let favorites = await knex.select('template_id')
    .from('favorites')
    .where('user_id', userId)
    .then(async (data) => {
      let favoriteTemplateId = await data.map((element) => element.template_id)
      return favoriteTemplateId
    })

  res.send(favorites)
})

//add to favorites
app.post('/users/:user_name/:template_id', async (req, res) => {//DONE
  let user = req.params.user_name;
  let userId = await getUserIdByUserName(user)
  let templateId = parseInt(req.params.template_id, 10)

  let favorites = await knex.select('template_id')
    .from('favorites')
    .where('user_id', userId)
    .then(async (data) => {
      let favoriteTemplateId = await data.map((element) => element.template_id)
      return favoriteTemplateId
    })
  if(favorites.includes(templateId)===false){
    await knex('favorites').insert({ user_id: userId, template_id: templateId })
    res.status(201).send(`Favorite Successfully Added`)
  }else{
      res.send('Did not post favorite, this favorite already exists')
  }

})

//delete a favorite DELETE /users/:user_name/:template_id
app.delete('/users/:user_name/:template_id', async (req, res) => { //DONE
  await knex('favorites')
    .select('template_id')
    .where('user_id', await getUserIdByUserName(req.params.user_name))
    .andWhere('template_id', req.params.template_id)
    .del()

  res.send('Template removed from favorites');
})

//get a list of all templates (id, title, body, options)
app.get('/templates', async (req, res) => {
  let templateTable = await knex.select('id', 'title', 'body')
    .from('templates')

  let templateOutput = [];

  for (let i of templateTable) {
    let template = await knex.select('id', 'title', 'body')
      .from('templates')
      .where('id', i.id)

    let templateOptions = await knex.select('*')
      .from('template_options')
      .where('template_id', i.id)

    templateOutput.push({ templates: template[0], template_options: templateOptions })
  }

  res.status(200).json(templateOutput)
})

//get template body and options by id
app.get('/templates/:template_id', async (req, res) => {
  let templateId = req.params.template_id

  let template = await knex.select('id', 'title', 'body')
    .from('templates')
    .where('id', templateId)

  let templateOptions = await knex.select('*')
    .from('template_options')
    .where('template_id', templateId)

  let templateOutput = { template: template[0], template_options: templateOptions }

  res.status(200).send(templateOutput)
})

app.listen(PORT, () => {
  console.log(`Mjolnir is bringing the hammer down on ${PORT}`);
});

module.exports = app;