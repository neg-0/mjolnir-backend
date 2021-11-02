const express = require('express');
const app = express();

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.get('/', (req,res) =>{
    res.send("this is the Home screen")
})

let PORT = 3000
app.listen(PORT, () => {
    console.log(`Mjolnir is bringing the hammer down on ${PORT}`);
});

module.exports = app;