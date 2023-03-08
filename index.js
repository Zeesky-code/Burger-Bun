const express = require('express')
const path = require('path')
const cors = require('cors')
const bodyParser = require('body-parser')
const http = require("http");
const app = express();

const server = http.createServer(app)

const {Server} = require("socket.io")
const io = new Server(server)

const PORT = 8080 || process.env.PORT

app.use(bodyParser.urlencoded({extended:false}))
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

io.on("connection",(socket) =>{
    socket.emit("message", "Welcome to Burger Bun");
})




server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})