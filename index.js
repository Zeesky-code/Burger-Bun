const express = require('express')
const http = require("http");
const app = express();
const server = http.createServer(app)

const path = require('path')
const cors = require('cors')
const bodyParser = require('body-parser')

const ChatSession = require('./chat');

const { Server } = require("socket.io");
const io = new Server(server);

const { connectToMongoDB } = require('./config/db')
//connectToMongoDB()

const PORT = 8080 || process.env.PORT;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

const session = require('express-session')
require('dotenv').config()

const sessionMiddleware = session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        //set expiry time for session to 7 days
        maxAge: 1000 * 60 * 60 * 24 * 7,
    },
});

io.engine.use(sessionMiddleware);
app.use(sessionMiddleware)

// Define options to be sent to customer on landing page


io.on("connection", (socket) => {
    // Listen for order requests
	const sessionId = session.id;
    const sessionData = socket.request.session;
    
    socket.join(sessionId)

    const chatSession = new ChatSession({io, sessionId})
    console.log("User connected")
    chatSession.displayOptions()
    socket.on('userMessage', (message) => {
        chatSession.checkUserMessage({message})
        console.log('Received order:', message);

        // // Add order to localStorage
        // const deviceId = socket.handshake.headers['sec-websocket-key'];
        // if (!orders[deviceId]) {
        //     orders[deviceId] = [];
        // }
        // orders[deviceId].push(order);
        // //localStorage.setItem('orders', JSON.stringify(orders));

        // Send confirmation message
        socket.emit('message', 'Order placed');

    });
    
    


})




server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})