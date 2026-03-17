// 1️⃣ Print Node.js version
console.log("Node Version:", process.version);

// 2️⃣ Print current file name
console.log("Current File:", __filename);

// 3️⃣ Print current directory
console.log("Current Directory:", __dirname);

// 4️⃣ Print welcome message every 3 seconds
const intervalId = setInterval(() => {
    console.log("Welcome to Node.js! 🚀");
}, 3000);

// 5️⃣ Stop the interval after 10 seconds (Bonus)
setTimeout(() => {
    clearInterval(intervalId);
    console.log("Stopped the welcome messages after 10 seconds.");
}, 10000);