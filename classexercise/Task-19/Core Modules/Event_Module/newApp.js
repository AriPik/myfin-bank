const EventEmitter = require("events");

const eventEmitter = new EventEmitter();

// Listeners
eventEmitter.on("userLoggedIn", (username) => {
    console.log(`User ${username} logged in.`);
});

eventEmitter.on("userLoggedOut", (username) => {
    console.log(`User ${username} logged out.`);
});

eventEmitter.on("sessionExpired", (username) => {
    console.log(`Session expired for ${username}.`);
});

// Emit login
eventEmitter.emit("userLoggedIn", "John");

// Emit sessionExpired after 5 seconds
setTimeout(() => {
    eventEmitter.emit("sessionExpired", "John");
}, 5000);

// Emit logout after 6 seconds
setTimeout(() => {
    eventEmitter.emit("userLoggedOut", "John");
}, 6000);