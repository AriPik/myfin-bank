const fs = require("fs").promises;

console.log("Starting file copy...");

fs.readFile("input.txt", "utf8")
    .then((data) => {
        console.log("File read successfully.");
        return fs.writeFile("output.txt", data);
    })
    .then(() => {
        console.log("File copied successfully!");
    })
    .catch((err) => {
        console.error("Error occurred:", err.message);
    });

console.log("This runs before promise resolves.");