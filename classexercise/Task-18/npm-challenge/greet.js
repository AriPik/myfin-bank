import moment from "moment";

const name = process.argv[2];

if (!name) {
    console.log("Please provide your name.");
    process.exit(1);
}

const formattedDate = moment().format("ddd MMM D YYYY, hh:mm A");

console.log(`Hello, ${name}! Today is ${formattedDate}`);