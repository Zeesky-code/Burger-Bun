class ChatSessionEvent{
    constructor({eventName, message}){
        this.eventName =  eventName;
        this.message = message
    }
}
class ChatSession{
    constructor({io, sessionData}){
        this.socket = io
        this.sessionData = sessionData
    }
    createEvent({eventName, message}){
        const event  = new ChatSessionEvent({eventName, message})
        return event
    }   
    emitMessage(event){
        this.socket.emit(event.eventName, event.message)
    }
    displayOptions(socket){
        const options = `Select 1 to place an order
                        <br />Select 99 to checkout order
                        <br />Select 98 to see order history
                        <br />Select 97 to see current order
                        <br />Select 0 to cancel order`
        const optionsEvent = this.createEvent({eventName:'options',message:options})
        this.emitMessage(optionsEvent)
    }
}

module.exports = ChatSession