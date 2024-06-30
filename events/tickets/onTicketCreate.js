const EventEmitter = require('node:events');
const emitter = new EventEmitter();

emitter.on('ticketCreated', () => {
    console.log("Who is edging right now?")
})