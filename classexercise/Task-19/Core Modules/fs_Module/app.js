import { writeFile, readFile } from "fs/promises";

const userInput = process.argv[2];

if (!userInput) {
    console.log("Please provide input text.");
    process.exit(1);
}

async function run() {
    try {
        await writeFile("feedback.txt", userInput);
        console.log("Data written successfully.");

        console.log("Reading file...");

        const data = await readFile("feedback.txt", "utf-8");
        console.log(data);

    } catch (err) {
        console.error("Error:", err);
    }
}

run();