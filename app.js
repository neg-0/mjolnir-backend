const express = require('express');
const app = express();
const knex = require('knex')(require('./knexfile.js')[process.env.NODE_ENV || 'development']);
const cors = require('cors');
const PORT = 3001

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

//get user_id by user_name
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

//get template_id by user_id //produces a list of template_id's of all docs associated with user_id
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

//get template by template_id
async function getTemplateByTemplateId(templateId) {
  return await knex.select('*')
    .from('templates')
    .where('id', templateId)
    .then(template => template[0])
}

//get template options by template_id
async function getTemplateOptionsByTemplateId(templateId) {
  return await knex.select('*')
    .from('template_options')
    .where('template_id', templateId)
  // .then(arr => arr.map((obj => { return { ...obj, option_value: JSON.parse(obj.option_value) } })))
}

//get serialized options by user_id and template_id
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

//get serialized options by user_id
async function getSerializedOptionsByUserId(userId) {
  return await knex.select('*')
    .from('users_templates')
    .where('user_id', userId)
}

//get serialized options by history_id
async function getSerializedOptionsByHistoryId(historyId) {
  return await knex.select('*')
    .from('users_templates')
    .where('history_id', historyId)
  }

  //returns {template: [], template_options: [], serialized_options: [{}]}
  async function getHistoryRecord(userId, templateId) {
    let history = {}

    history.template = await getTemplateByTemplateId(templateId)
    history.template_options = await getTemplateOptionsByTemplateId(templateId)
    history.history_object = await getSerializedOptionsByUserIdAndTemplateId(userId, templateId)

    return history
  }

  async function getHistoryByUserId(userId) {
    let historyArr = [];
    let serializedOptionsArray = await getSerializedOptionsByUserId(userId) //array of all userId's serializedOptions from users_templates

    for (let history_object of serializedOptionsArray) {
      let template = await getTemplateByTemplateId(history_object.template_id)
      let template_options = await getTemplateOptionsByTemplateId(history_object.template_id)
      historyArr.push({ history_object, template, template_options })
    }

    return historyArr
  }

//admin feature
app.get('/users', async (req, res) => {
  let userList = await knex('users').select('*')
  res.json(userList)
})

//create new user
app.post('/users', async (req, res) => {
  let { user_name, password } = req.body
  await knex('users').where({ user_name }).then(result => {
    if (result.length > 0) {
      res.status(409).send('Username already exists')
    } else {
      knex('users')
        .insert({ user_name, password })
        .returning(['id', 'user_name'])
        .then(newUser => res.status(201).json(newUser[0]))
    }
  })
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

  let history = await getHistoryByUserId(userId)

  res.json(history)
})

//get all history
app.get('/history', async (req, res) => {
  let options = await getSerializedOptions() //array of all serializedOptions from users_templates
  res.json(options)
})

//get document by history_id
app.get('/history/:history_id', async (req, res) => {
  let history_id = req.params.history_id

  let options = await getSerializedOptionsByHistoryId(history_id) //array of all serializedOptions from users_templates

  if (options.length === 0) {
    res.status(404).send('History ID not found')
    return
  }

  let history_object = options[0]
  let template = await getTemplateByTemplateId(history_object.template_id)
  let template_options = await getTemplateOptionsByTemplateId(history_object.template_id)

  let historyObject = { history_object, template, template_options }

  res.json(historyObject)
})

//post history
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
      res.status(201).json(history[0])
    });
})

//replacing old serialized options with newly fed serialized_options
app.patch('/history', async (req, res) => {
  let serialized_options = JSON.stringify(req.body.serialized_options)
  let history_id = req.body.history_id
  let file_name = req.body.file_name

  let newHistory = await knex('users_templates')
    .where('history_id', history_id)
    .update({ serialized_options, file_name })
    .returning('*')

  res.status(200).json(newHistory[0])
})

//delete a doc from history
app.delete('/users/:user_name/history/:history_id', async (req, res) => {
  let user = req.params.user_name
  let idToDelete = parseInt(req.params.history_id)

  await knex('users_templates')
    .where('history_id', idToDelete)
    .del()

  let user_id = await getUserIdByUserName(user)
  let history = await getHistoryByUserId(user_id)

  res.json(history)
})

//get users favorites GET /users/:user_name/favorites
app.get('/users/:user_name/favorites', async (req, res) => {
  let user = req.params.user_name;
  let userId = await getUserIdByUserName(user)

  if (!userId) {
    res.status(404).send('User not found')
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
app.post('/users/:user_name/favorites/:template_id', async (req, res) => {
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
    await knex('favorites').insert({ user_id: userId, template_id: templateId }).returning('template_id')
  }

  favorites = await knex.select('template_id')
    .from('favorites')
    .where('user_id', userId)
    .then(async (data) => {
      let favoriteTemplateId = await data.map((element) => element.template_id)
      return favoriteTemplateId
    })
  res.status(201).json(favorites)
})

//delete a favorite
app.delete('/users/:user_name/favorites/:template_id', async (req, res) => {
  let userId = await getUserIdByUserName(req.params.user_name)
  await knex('favorites')
    .select('template_id')
    .where('user_id', userId)
    .andWhere('template_id', req.params.template_id)
    .del()

  let newFavorites = await knex.select('template_id')
    .from('favorites')
    .where('user_id', userId)
    .then(async (data) => {
      let favoriteTemplateId = await data.map((element) => element.template_id)
      return favoriteTemplateId
    })


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