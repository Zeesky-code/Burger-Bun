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
    saveUninitialized: false
});

io.engine.use(sessionMiddleware);
const orders = {};

// Define options to be sent to customer on landing page
const options = [
    'Select 1 to place an order',
    'Select 99 to checkout order',
    'Select 98 to see order history',
    'Select 97 to see current order',
    'Select 0 to cancel order',
];


io.on("connection", (socket) => {
    // Listen for order requests
    socket.on('order', (order) => {
        console.log('Received order:', order);

        // Add order to localStorage
        const deviceId = socket.handshake.headers['sec-websocket-key'];
        if (!orders[deviceId]) {
            orders[deviceId] = [];
        }
        orders[deviceId].push(order);
        //localStorage.setItem('orders', JSON.stringify(orders));

        // Send confirmation message
        socket.emit('message', 'Order placed');
        console.log(deviceId)
        console.log(order)
    });
    const sessionData = socket.request.session;
    const chatSession = new ChatSession({io, sessionData})
    chatSession.displayOptions()
    // socket.emit("options", options);
    // console.log(sessionData)
})




server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})