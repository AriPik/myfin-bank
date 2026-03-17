const fs = require("fs").promises;

// Artificial delay function (Bonus requirement)
function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function copyFile() {
    try {
        console.log("Starting file copy...");

        const data = await fs.readFile("input.txt", "utf8");
        console.log("File read successfully.");

        // Bonus: simulate slow operation
        await delay(1000);

        await fs.writeFile("output.txt", data);

        console.log("File copied successfully!");
    } catch (error) {
        console.error("Error occurred:", error.message);
    }
}

copyFile();

console.log("This runs before async function completes.");