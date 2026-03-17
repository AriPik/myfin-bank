const fs = require("fs");

console.log("Start reading file...");

fs.readFile("data.txt", "utf8", (err, data) => {
    if (err) {
        console.error("Error reading file:", err);
        return;
    }

    console.log("File Content:", data);

    // Intentional delay
    setTimeout(() => {
        console.log("Read operation completed");
    }, 2000);
});

console.log("This runs before file reading finishes");