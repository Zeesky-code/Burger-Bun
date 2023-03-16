const validateMessage = require('./utils/validator')
const sessionDB = require("./models/session")
const {Menu} = require("./utils/menu")
class ChatSessionEvent{
    constructor({eventName, message}){
        this.eventName =  eventName;
        this.message = message
    }
}
class ChatSession{
    constructor({io, sessionId}){
        this.socket = io
        this.sessionId = sessionId
        //to keep track of the order operation
        this.stage = 0;

        this.saveSession(this.sessionId)
    }
    //to debug
    async saveSession(session){
        console.log(session)
        var checksessionID = await sessionDB.findOne({ sessionId:session});

        if (!checksessionID) {
            checksessionID = await sessionDB.create({ sessionId: session });
        }
        this.session  = checksessionID
        console.log(this.session)
    }
    createEvent({message}){
        const event  = new ChatSessionEvent({eventName:'botMessage', message})
        return event
    }   
    emitMessage(event){
        this.socket.emit(event.eventName, event.message)
    }
    displayOptions(){
        const options = `Select 1 to place an order
                        <br />Select 99 to checkout order
                        <br />Select 98 to see order history
                        <br />Select 97 to see current order
                        <br />Select 0 to cancel order`
        const optionsEvent = this.createEvent({message:options})
        this.emitMessage(optionsEvent)
    }

    displayError(){
        const errorEvent = this.createEvent({message: 'Invalid Selection, please try again'})
        this.emitMessage(errorEvent)
        
        
    }

    displayMenu(){
        const menu = `Select an item to place an order
                        <br />Mini cheese Burger    $9.50
                        <br />Double size Burger    $13.75
                        <br />Bread beans on toast  $50.00
                        <br />Bacon, Egg and Cheese $10.50`
        const menuEvent = this.createEvent({message:menu})
        this.emitMessage(menuEvent)
    }
    determineLevel({message}){
        if(!validateMessage(message)){
            this.displayError()
        }
        switch(this.stage){
            case 0:
                this.checkUserMessage({message})
                break;
            case 1:
                this.saveOrder({message})
                break;
            default:
                this.displayOptions()
                break;
        }
    }
    checkUserMessage({message}){
        this.stage++
        var botresponse = "";
        switch(parseInt(message)){
            case 1:
                this.displayMenu();
                break;
            case 99:
                this.checkoutOrder();
                break;
            case 98:
                this.showOrderHistory();
                break;
            case 97:
                this.showCurrentOrder();
                break;
            case 0:
                this.cancelOrder();
                break;
            default:
                this.displayOptions();
                break;
        }
        //this.stage++;
        const inputEvent = this.createEvent({message: botresponse})
        this.emitMessage(inputEvent)
    }

    async saveOrder({message}){
        var botresponse ="You ordered ";
        switch(parseInt(message)){
            case 1:
                botresponse += ` ${Menu[0].food}`;
                break;
            case 2:
                botresponse += ` ${Menu[1].food}`;
                break;
            case 3:
                botresponse += ` ${Menu[2].food}`;
                break;
            case 4:
                botresponse += ` ${Menu[3].food}`;
                break;
            default:
                this.displayMenu()
                break;
        }
        this.stage = 0;
        const order = { food: ` ${Menu[parseInt(message)-1].food}` };
        await sessionDB.findOneAndUpdate(
            { sessionId: this.sessionId },
            { $push: { currentOrder: order } },
            { new: true } // Return the updated document
        );
        const inputEvent = this.createEvent({message: botresponse})
        this.emitMessage(inputEvent)
        this.displayOptions()
    }
    async checkoutOrder(){
        const session = await sessionDB.findOne({ sessionId: this.sessionId });
        var botresponse = "";
        if (session.currentOrder.length < 1) {
            botresponse += "You do not have any order yet";
        } else {
            await sessionDB.findOneAndUpdate(
                { sessionId: this.sessionId },
                {
                    $push: { Orders: { $each: session.currentOrder } },
                    $set: { currentOrder: [] }
                },
                { new: true } // Return the updated document
            );
            botresponse += `Your order has been checked out.`;
        }
        this.stage = 0;
        const checkOutEvent = this.createEvent({message: botresponse})
        this.emitMessage(checkOutEvent)
        this.displayOptions()
    }
    async cancelOrder(){
        const session = await sessionDB.findOne({ sessionId: this.sessionId });
        var botresponse = "";
        if (session.currentOrder.length < 1) {
            botresponse += "You do not have any order yet";
        } else {
            await sessionDB.findOneAndUpdate(
                { sessionId: this.sessionId },
                { $set: { currentOrder: [] }},
                { new: true } // Return the updated document
            );
            botresponse += `Your order has been cancelled.`;
        }
        this.stage = 0;
        const cancelEvent = this.createEvent({message: botresponse})
        this.emitMessage(cancelEvent)
        this.displayOptions()

    }
    async showOrderHistory(){
        const session = await sessionDB.findOne({ sessionId: this.sessionId });
    	var botresponse = "";

        if (session.Orders.length < 1) {
            botresponse += "You do not have any order yet";
        } else {
            session.Orders.forEach((order)=>{
                botresponse += `${order.food} <br />`;
            })
        }
        this.stage = 0;
        const inputEvent = this.createEvent({message: botresponse})
        this.emitMessage(inputEvent)
        this.displayOptions()
    }
    async showCurrentOrder(){
        const session = await sessionDB.findOne({ sessionId: this.sessionId });

    	var botresponse = "";

        if (session.currentOrder.length < 1) {
            botresponse += "You do not have any order yet";
        } else {
            session.currentOrder.forEach((order)=>{
                botresponse += `${order.food} <br />`;
            })
        }
        this.stage = 0;
        const inputEvent = this.createEvent({message: botresponse})
        this.emitMessage(inputEvent)
        this.displayOptions()
    }

}

module.exports = ChatSession