const express = require('express')
const app = express()
const mongoose = require('mongoose')
require('dotenv').config()
const {MONGO_URL,PORT} = process.env


mongoose.connect(MONGO_URL,{
    useUnifiedTopology:true,
    useNewUrlParser:true,
})
.then(()=> console.log('Database connection established'))
.catch(err=> console.log(err.message))

app.listen(PORT,()=>{
    console.log(`Server listening on port  ${PORT} `)
})