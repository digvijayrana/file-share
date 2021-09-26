require('dotenv').config()
const express = require('express')
const connectiondb= require('./config/db')
const path = require('path')
const app = express()
connectiondb()

//template engine
app.use(express.static('public'))
app.set('views',path.join(__dirname,'/views'));
app.set('view engine','ejs')

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/files',require('./routes/files'));
app.use('/showfiles',require('./routes/show'))
app.use('/files/download',require('./routes/download'))



const PORT = process.env.PORT || 3000

app.listen(PORT,()=>{
    console.log(`Listening on Port ${PORT}`)
})