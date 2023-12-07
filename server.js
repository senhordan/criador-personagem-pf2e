const express = require('express')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const bodyParser = require('body-parser')
const path = require('path')
let ip = require('ip').address()
const fs = require('fs')
const cheerio = require('cheerio')
const multer = require("multer");

// const puppeteer = require('puppeteer-core');
app.use(bodyParser.urlencoded({extended: true}))
app.engine('html', require('ejs').renderFile)
app.set('view engine', 'html')
app.use('/publico', express.static(path.join(__dirname, 'publico')))

app.set('views', path.join(__dirname, 'publico'))

const criar_novo_usuario = (nome)=>{
  fs.mkdirSync(`./usuarios/${nome}`, { recursive: true })
}

const usuarios = ()=>{
  
  return pastas
}

const remover_usuario = (usuario)=>{
  fs.rmdir(`./usuarios/${usuario}`, { recursive: true }, ()=>{})
}

const editar_usuario = (usuario_antigo, novo_usuario)=>{
  fs.renameSync(`./usuarios/${usuario_antigo}`, `./usuarios/${novo_usuario}`, ()=>{})
}

const remover_token = (usuario, token_nome)=>{
  try {
    fs.unlinkSync(`./usuarios/${usuario}/${token_nome}.json`)
    fs.unlinkSync(`./publico/img/${token_nome}.png`)
  } catch(e) {
    console.log(e);
  }
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // console.log(req.params)
    // const usuario = req.params.usuario
    cb(null, `publico/img/`);
  },
  filename: function (req, file, cb) {
    // console.log(req.params)
    const ext = path.extname(file.originalname);
    // const filename = file.fieldname + "-" + Date.now() + ext;
    const filename = req.params.token + ext;
    // const image_name = 
    cb(null, filename);
  },
});

app.get('/', (req, res)=>{
  
  io.once('connection', (socket) => {
    console.log(`usuario conectado ${socket.id}`);

    socket.on('criar novo usuario', (nome)=>{
      criar_novo_usuario(nome)
      socket.broadcast.emit('retorno usuarios', nome)
    })

    socket.on('usuarios', ()=>{
      let usuarios = fs.readdirSync('./usuarios')
      if (typeof usuarios != 'object') {
        usuarios = [usuarios]
      }
      // console.log(usuarios)
      socket.emit('retorno usuarios', usuarios)
    })

    socket.on('editar nome de usuario', (array)=>{editar_usuario(array[0], array[1])})

    socket.on('remover usuario', (usuario)=>{remover_usuario(usuario)})

  });

  res.render('index')

})

app.get('/usuario/:usuario', (req, res)=>{
  io.once('connection', (socket)=>{
    socket.once('tokens', (usuario)=>{
      console.log(usuario)
      let tokens_json = fs.readdirSync(`./usuarios/${usuario}`)

      if (typeof tokens_json != 'object') {tokens_json = [tokens_json]}

      const tokens = []
      tokens_json.forEach(i=>{

        const token_nome = i.replace('.json', '')

        tokens.push({"nome": token_nome})
      })

      socket.emit('retorno tokens', tokens)
    })

    socket.on('criar token', (array)=>{
      const [usuario, token_nome] = array
      const obj = JSON.parse(fs.readFileSync('./ficha.json', 'utf-8'))

      fs.writeFileSync(`./usuarios/${usuario}/${token_nome}.json`, JSON.stringify(obj, null, 2))

      fs.copyFileSync('./publico/img/undefined.png', `./publico/img/${token_nome}.png`)
      // console.log(obj)

      // console.log( [usuario, token_nome])
    })

    socket.on('remover token', (array)=>{remover_token(array[0], array[1])})

    socket.on('editar token nome', (array)=>{
      // console.log(array)
      const [usuario, token_nome, novo_nome] = array

      fs.renameSync(`./usuarios/${usuario}/${token_nome}.json`, `./usuarios/${usuario}/${novo_nome}.json`, (err)=>{console.log(err)})
      fs.renameSync(`./publico/img/${token_nome}.png`, `./publico/img/${novo_nome}.png`, (err)=>{console.log(err)})

      const ficha = JSON.parse(fs.readFileSync(`./usuarios/${usuario}/${novo_nome}.json`, 'utf-8'))
      fs.writeFileSync(`./usuarios/${usuario}/${novo_nome}.json`, JSON.stringify(ficha, '', 2), ()=>{})
    })
    
  })

  // res.render('ficha-de-personagem')
  res.render(`tokens`)
})

app.get('/usuario/:usuario/:token', (req, res)=>{
  io.once('connection', (socket)=>{
    socket.on('ficha de personagem', (usuario_token)=>{

      const usuario = usuario_token[0]
      const token = usuario_token[1]

        console.log(usuario)
        console.log(token)
      try {
        const file = fs.readFileSync(`./usuarios/${usuario}/${token}.json`, 'utf-8')
        const json = JSON.parse(file)
        socket.emit('retorno ficha', json)
        // statements
      } catch(e) {
        console.log(e)
        console.log('token não existe');
      }


    })

    socket.on('update token', (usuario_token_ficha)=>{
      const usuario = usuario_token_ficha[0]
      const token = usuario_token_ficha[1]
      const ficha = usuario_token_ficha[2]
      fs.writeFileSync(`./usuarios/${usuario}/${token}.json`, JSON.stringify(ficha, null, 2), ()=>{console.log(ficha)})

      // if (token != ficha.NOME) {
      //   // console.log(token)
      //   // console.log(ficha.NOME)
      //   // console.log(fs.readFileSync(`./usuarios/Dan/${token}.json`, 'utf-8'))

      //   // console.log(fs.readdirSync('./usuarios'+"/Dan"))
      //   fs.renameSync(`./usuarios/${usuario}/${token}.json`, `./usuarios/${usuario}/${ficha.NOME}.json`, (err)=>{console.log(err)})
      //   fs.renameSync(`./publico/img/${token}.png`, `./publico/img/${ficha.NOME}.png`, (err)=>{console.log(err)})
      // }

    })

  })

  res.render('ficha-de-personagem')
})

app.post('/', (req, res)=>{
  res.redirect(`/usuario/${req.body.usuario}`)
})

app.post('/usuario/:usuario', (req, res)=>{
  res.redirect(`/usuario/${req.body.usuario}/${req.body.token}`)
  // res.send(req.body.teste)
})

const upload = multer({ storage: storage });

app.post("/usuario/:usuario/:token/upload", upload.single("imagem"), (req, res) => {
  if (!req.file) {
    res.status(400).send("Nenhum arquivo enviado");
    return;
  }

  console.log(req.file.filename)
  console.log(req.file.originalname)
  // const filename = req.file.filename;
  // const originalname = req.file.originalname;
  // const size = req.file.size;

  res.status(200).send("Imagem recebida e salva com sucesso!");
});


const porta = 4000
// ip = "0.0.0.0"
const { exec } = require('child_process')


http.listen(porta, ip, ()=>{
// ip = 'localhost'
// http.listen(porta, 'localhost', ()=>{
  console.log(`http://${ip}:${porta}`)

  try {
    const url = fs.readFileSync('/tmp/url', 'utf-8')
    console.log(url)
  } catch(e) {
    fs.writeFileSync('/tmp/url', `http://${ip}:${porta}`, ()=>{})
    exec(`microsoft-edge http://${ip}:${porta}`, (err, output) => {
        // once the command has completed, the callback function is called
        if (err) {
            // log and return if we encounter an error
            console.error("could not execute command: ", err)
            return
        }
        // log the output received from the command
        console.log("Output: \n", output)
    })
  }
})

