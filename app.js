const express = require('express');
const app = express();
const knex = require('knex')(require('./knexfile.js')[process.env.NODE_ENV || 'development']);
const cors = require('cors');

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())


app.get('/', (req, res) => {
    res.send("this is the Home screen")
})

app.get('/templates', (req, res) => {
    res.status(200).send("Please Select a Template")
})

app.get('/templates/:template_id', (req, res) => {

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

app.get('/users', (req, res) => {
    // Returns users dummy data
    res.send("Please Input your User Name and Password")
})

app.post('/users', async (req, res) => {
    let userFromBody = req.body.user_name
    let passwordFromBody = req.body.password

    await knex('users').insert({ user_name: userFromBody, password: passwordFromBody });

    res.status(201).send('Posted user successfully')

})

app.get('/users/:user', (req, res) => {
    let user = req.params.user

    knex.select('user_name', 'password')
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



app.get('/users/:user/history', async(req, res) => {
    let user = req.params.user
    var userIdHist;
    var templateIdHist = [];
    var serializedOptionsHist = []; //want to return this as {template_body: templateBodyHist[i]}
    var templateBodyHist = []; //want to return this as {template_body: templateBodyHist[i]}
    var resultArr =[];


    knex.select('id')
        .from('users')
        .where('user_name', user)
        .then(data => {
            //console.log('data is', data)
            //console.log('user is', user)
            userIdHist = data[0].id
            console.log('user is', userIdHist)
             knex.select('template_id', 'serialized_options')
                .from('users_templates')
                .where('user_id', userIdHist)
                .then(async (data) => {
                    //let {template_id} = data[0]


                    if (data.length > 0) {
                        console.log('data is:', data)
                        for (let i = 0; i < data.length; i++) {
                            templateIdHist.push(data[i].template_id);
                            serializedOptionsHist.push(data[i].serialized_options);
                        
                        await knex.select('body')
                            .from('templates')
                            .where('id', templateIdHist[i])
                            .then(data => {
                                console.log('data for templates is', data)
                                templateBodyHist.push(data[0].body)
                                console.log('templateBodyHist is', templateBodyHist)
                            })
                        }
                        //console.log('templateBodyHist is 2', templateBodyHist)
                        //console.log('anything')
                        //console.log('serializedOptionsHist is:', serialOptionsHist)
                        //console.log('anything 2')
                        
                        for (let j=0; j<data.length; j++){
                        console.log('templateBodyHist[j]', templateBodyHist[j])

                        resultArr.push({'template_body': templateBodyHist[j], 'serialized_options': serializedOptionsHist[j]})
                        }
                        
                        console.log('resultArr is', resultArr)
                        res.status(200).send(resultArr)
                    
                        
                    }


                    
                    else {
                        res.status(404).json('User history not found')
                    }
                })
                .catch(err =>
                    res.status(404).json({
                        message:
                            'The data you are looking for could not be found. Please try again'
                    })
                );
        })





})

app.get('/users/:user/favorites', (req, res) => {

})





let PORT = 3001
app.listen(PORT, () => {
    console.log(`Mjolnir is bringing the hammer down on ${PORT}`);
});

module.exports = app;