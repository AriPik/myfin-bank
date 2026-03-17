import chalk from "chalk";
import figlet from "figlet";
// Generate ASCII banner
figlet("Welcome to Node.js", function (err, data) {
    if (err) {
        console.log("Something went wrong...");
        return;
    }

    console.log(chalk.green(data));
});