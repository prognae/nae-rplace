const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const server = require('http').createServer(app);
const WebSocket = require('ws')

const wss = new WebSocket.Server({ server:server })

app.set('trust proxy', 1)
app.set('view engine', 'ejs')
app.use(express.static('views'))
app.use(bodyParser.json())

let port = process.env.PORT || 9000

wss.on('connection', function connection(ws) {
    console.log('A new client has connected!')

    ws.on('message', function incoming(message) {

    wss.clients.forEach(function each(client) {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(`${message}`);
        }
    })

    })    
})

server.listen(port, () => {
    console.log(`app listening on port ${port}`)
})

app.get('/', async(req, res) => {
    res.render('pages/pixel')
})

app.get('/trypost', async(req, res) => {
    res.render('pages/trypost')
})

app.post('/trypost', async(req, res) => {
    res.send('trypost posted')
})

app.post('/save', async(req,res) => {
    console.log('SAVE TO DB')
    console.log(req.body.x)
})