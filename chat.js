const validateMessage = require('./utils/validator')
const sessionDB = require("./models/session")
const Menu = require("./utils/menu")
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

        var checksessionID;
        checksessionID = sessionDB.findOne({ sessionId });

        if (!checksessionID) {
            checksessionID = sessionDB.create({ sessionId });
        }
        this.session  = checksessionID
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
            case 1:
                this.saveOrder(message)
        }
    }
    checkUserMessage({message}){

        var botresponse ="";
        switch(parseInt(message)){
            case 1:
                this.displayMenu()
                break;
            case 99:
                botresponse += "You selected 99 <br> checkout your order";
                break;
            case 98:
                this.showOrderHistory();
                break;
            case 97:
                botresponse += "You selected option 97 <br>order canceled";
                break;
            default:
                this.displayOptions()
                break;
        }
        //this.stage++;
        const inputEvent = this.createEvent({message: botresponse})
        this.emitMessage(inputEvent)
    }

    saveOrder({message}){
        var botresponse ="You ordered ";
        console.log('Received order:', message);
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
                this.displayError()
        }
        this.stage++;
        const inputEvent = this.createEvent({message: botresponse})
        this.emitMessage(inputEvent)
    }
    checkoutOrder(){

    }
    cancelOrder(){

    }
    async showOrderHistory(){
        const session = await sessionDB.findOne({ sessionId: this.sessionId });
    	var botresponse = "";

        if (session.currentOrder.length < 1) {
            botresponse += "You do not have any order yet";
        } else {
            botresponse += sessionOrder.currentOrder;
        }

        const inputEvent = this.createEvent({message: botresponse})
        this.emitMessage(inputEvent)
    }
    showCurrentOrder(){

    }

}

module.exports = ChatSession