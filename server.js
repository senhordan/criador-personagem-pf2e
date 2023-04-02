const express = require('express')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const bodyParser = require('body-parser')
const path = require('path')
let ip = require('ip').address()
const fs = require('fs')
// const puppeteer = require('puppeteer-core');
app.use(bodyParser.urlencoded({extended: true}))
app.engine('html', require('ejs').renderFile)
app.set('view engine', 'html')
app.use('/publico', express.static(path.join(__dirname, 'publico')))

app.set('views', path.join(__dirname, 'publico'))


app.get('/', (req, res)=>{

  io.on('connection', (socket) => {
    console.log(`usuario ${socket.id}`);
  });

  res.render('ficha')


})

const porta = 4000
// ip = "0.0.0.0"

http.listen(porta, ip, ()=>{
  console.log(`Rodando servidor em http://${ip}:${porta}`)
})

