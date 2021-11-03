const express = require('express');
const app = express();
const knex = require('knex')(require('./knexfile.js')[process.env.NODE_ENV || 'development']);
const cors = require('cors')

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
    res.send("Please Select a Template")
})

app.get('/users', (req, res) => {

    res.send('Please Input your User Name and Password')

})

app.post('/users', (req, res) => {
    let usr = req.body.user_name
    let pswd = req.body.password

    knex('users').insert({ user_name: usr });

    res.send('Posted user successfully')

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



app.get('/users/:users/history', (req, res) => {

})

app.get('/users/:users/favorites', (req, res) => {

})





let PORT = 3001
app.listen(PORT, () => {
    console.log(`Mjolnir is bringing the hammer down on ${PORT}`);
});

module.exports = app;