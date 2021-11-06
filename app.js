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
    .then(data => {
      if (data.length === 0) {
        return null
      }
      return data[0].id
    })
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
    .then(template => template[0])
}

//get template options by id
async function getTemplateOptionsByTemplateId(templateId) {
  return await knex.select('*')
    .from('template_options')
    .where('template_id', templateId)
  // .then(arr => arr.map((obj => { return { ...obj, option_value: JSON.parse(obj.option_value) } })))

}

//get serialized options by userID and templateId
async function getSerializedOptionsByUserIdAndTemplateId(userId, templateId) {
  return await knex.select('*')
    .from('users_templates')
    .where('template_id', templateId)
    .andWhere('user_id', userId)
  // .then(arr => arr.map((obj => { return { history_id: obj.history_id, serialized_options: JSON.parse(obj.serialized_options) } })))
}

//get all serialized options
async function getSerializedOptions() {
  return await knex.select('*')
    .from('users_templates')
}

//get serialized options by userID
async function getSerializedOptionsByUserId(userId) {
  return await knex.select('*')
    .from('users_templates')
    .where('user_id', userId)
}

//get serialized options by userID and templateId
async function getSerializedOptionsByHistoryId(historyId) {
  return await knex.select('*')
    .from('users_templates')
    .where('history_id', historyId)
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

  knex.select('id', 'user_name')
    .from('users')
    .where('user_name', user)
    .then(data => {
      if (data.length > 0) {
        res.status(200).json(data[0])
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
  let serializedOptionsArray = await getSerializedOptionsByUserId(userId) //array of all serializedOptions from users_templates

  for (let serialized_options of serializedOptionsArray) {
    let template = await getTemplateByTemplateId(serialized_options.template_id)
    let template_options = await getTemplateOptionsByTemplateId(serialized_options.template_id)
    historyArr.push({ serialized_options, template, template_options })
  }
  // for (let i = 0; i < templateIdHist.length; i++) {
  //   historyArr.push(await getHistoryRecord(userId, templateIdHist[i]))
  // }

  res.json(historyArr)
})

//get all history
app.get('/history', async (req, res) => {
  let options = await getSerializedOptions() //array of all serializedOptions from users_templates
  res.json(options)
})

//get history of single document by id
app.get('/history/:history_id', async (req, res) => {
  let history_id = req.params.history_id

  let options = await getSerializedOptionsByHistoryId(history_id) //array of all serializedOptions from users_templates

  if (options.length === 0) {
    res.status(404).send('History ID not found')
    return
  }

  let serialized_options = options[0]
  let template = await getTemplateByTemplateId(serialized_options.template_id)
  let template_options = await getTemplateOptionsByTemplateId(serialized_options.template_id)

  let historyObject = { serialized_options, template, template_options }

  res.json(historyObject)
})

//post history POST
app.post('/users/:user_name/history', async (req, res) => {
  let user = req.params.user_name
  let template_id = req.body.template_id
  let file_name = req.body.file_name
  let serialized_options = JSON.stringify(req.body.serialized_options)
  let user_id = await getUserIdByUserName(user)

  await knex('users_templates')
    .insert({ user_id, template_id, file_name, serialized_options })
    .returning('*')
    .then(history => {
      res.status(201).json(history)
    });
})

//replacing old serialized options with newly fed serialized_options
app.patch('/users/:user_name/history', async (req, res) => {//DONE
  let serialized_options = JSON.stringify(req.body.serialized_options)
  await knex('users_templates')
    .where({ 'history_id': req.body.history_id })
    .update({ serialized_options })

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

  // If userId is not found, send back empty array
  if (!userId) {
    res.json([])
    return
  }

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

  if (favorites.includes(templateId) === false) {
    let favorites = await knex('favorites').insert({ user_id: userId, template_id: templateId }).returning('template_id')
    res.status(201).json(favorites)
  } else {
    res.status(304).send('Favorite not sent, duplicate.')
  }

})

//delete a favorite DELETE /users/:user_name/:template_id
app.delete('/users/:user_name/:template_id', async (req, res) => { //DONE
  let userId = await getUserIdByUserName(req.params.user_name)
  await knex('favorites')
    .select('template_id')
    .where('user_id', userId)
    .andWhere('template_id', req.params.template_id)
    .del()

  let newFavorites = await knex('favorites')
    .select('template_id')
    .where('user_id', userId)

  res.json(newFavorites)
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

    template_options = await getTemplateOptionsByTemplateId(i.id)

    templateOutput.push({ template: template[0], template_options })
  }

  res.status(200).json(templateOutput)
})

//get template body and options by id
app.get('/templates/:template_id', async (req, res) => {
  let templateId = req.params.template_id

  let template = await knex.select('id', 'title', 'body')
    .from('templates')
    .where('id', templateId)

  template_options = await getTemplateOptionsByTemplateId(templateId)

  let templateOutput = { template: template[0], template_options }

  res.status(200).send(templateOutput)
})

app.listen(PORT, () => {
  console.log(`Mjolnir is bringing the hammer down on ${PORT}`);
});

module.exports = app;