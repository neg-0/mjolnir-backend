const express = require('express')
const app = express()

let PORT = 3000
app.listen(PORT, () => {
    console.log(`Mjolnir is bringing the hammer down on ${PORT}`);
}